"use client";

import { useState, useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cart-context";
import { createOrderAction } from "@/features/orders/actions";
import type { PaymentMethod } from "@prisma/client";
import { normalizeTurkishPhone } from "@/server/validation/order.schema";

interface FieldErrors {
  customerName?: string;
  phone?: string;
  addressLine1?: string;
  deliveryNotes?: string;
  general?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CASH_ON_DELIVERY");
  const idempotencyKeyRef = useRef<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const getIdempotencyKey = () => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `idemp_${Date.now()}_${Math.random()}`;
    }
    return idempotencyKeyRef.current;
  };

  const nameId = useId();
  const phoneId = useId();
  const addressId = useId();
  const notesId = useId();

  const validateClientSide = (): boolean => {
    const errors: FieldErrors = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = "Ad soyad en az 2 karakter olmalıdır.";
    } else if (customerName.trim().length > 100) {
      errors.customerName = "Ad soyad en fazla 100 karakter olabilir.";
    }

    if (!phone.trim()) {
      errors.phone = "Telefon numarası zorunludur.";
    } else if (!normalizeTurkishPhone(phone.trim())) {
      errors.phone =
        "Geçerli bir Türkiye cep telefonu numarası giriniz (örn: 0532 123 45 67).";
    }

    if (!addressLine1.trim() || addressLine1.trim().length < 5) {
      errors.addressLine1 = "Teslimat adresi en az 5 karakter olmalıdır.";
    } else if (addressLine1.trim().length > 300) {
      errors.addressLine1 = "Teslimat adresi en fazla 300 karakter olabilir.";
    }

    if (deliveryNotes.trim().length > 500) {
      errors.deliveryNotes = "Teslimat notu 500 karakterden uzun olamaz.";
    }

    if (items.length === 0) {
      errors.general = "Sepetinizde ürün bulunmamaktadır.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateClientSide()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        emptyBottleQuantity: item.emptyBottleQuantity,
      }));

      const result = await createOrderAction({
        idempotencyKey: getIdempotencyKey(),
        customerName: customerName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        deliveryNotes: deliveryNotes.trim() ? deliveryNotes.trim() : undefined,
        paymentMethod,
        items: orderItems,
      });

      if (!result.success) {
        setIsSubmitting(false);
        const err = result.error;

        switch (err.code) {
          case "OUT_OF_OPERATING_HOURS":
            setServerError(
              "Siparişler yalnızca 09:00 - 19:00 saatleri arasında kabul edilmektedir."
            );
            break;
          case "PRODUCT_UNAVAILABLE":
            setServerError(
              "Sepetinizdeki ürünlerden biri veya birkaçı artık mevcut değil. Lütfen sepetinizi kontrol edin."
            );
            break;
          case "INVALID_EMPTY_BOTTLE_QUANTITY":
            setServerError(
              "İade boş damacana adedi sipariş miktarından fazla olamaz."
            );
            break;
          case "IDEMPOTENCY_CONFLICT":
            setServerError(
              "Bu sipariş isteği daha önce farklı bilgilerle iletildi. Lütfen sayfayı yenileyip tekrar deneyin."
            );
            break;
          case "VALIDATION_ERROR": {
            setServerError("Girdiğiniz bilgileri lütfen kontrol ediniz.");
            if (
              err.details &&
              typeof err.details === "object" &&
              "fieldErrors" in err.details
            ) {
              const details = err.details as {
                fieldErrors: Record<string, string[]>;
              };
              const mappedErrors: FieldErrors = {};
              if (details.fieldErrors.customerName?.[0])
                mappedErrors.customerName = details.fieldErrors.customerName[0];
              if (details.fieldErrors.phone?.[0])
                mappedErrors.phone = details.fieldErrors.phone[0];
              if (details.fieldErrors.addressLine1?.[0])
                mappedErrors.addressLine1 = details.fieldErrors.addressLine1[0];
              if (details.fieldErrors.deliveryNotes?.[0])
                mappedErrors.deliveryNotes =
                  details.fieldErrors.deliveryNotes[0];
              setFieldErrors(mappedErrors);
            }
            break;
          }
          case "ORDER_CREATION_FAILED":
          default:
            setServerError(
              "Siparişiniz oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyiniz."
            );
            break;
        }
        return;
      }

      // Order created successfully
      clearCart();
      router.push(`/siparis-onay/${result.data.publicId}`);
    } catch {
      setIsSubmitting(false);
      setServerError(
        "Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium">{serverError}</p>
          </div>
        </div>
      )}

      {fieldErrors.general && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm"
        >
          {fieldErrors.general}
        </div>
      )}

      {/* Contact & Delivery Details */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-950 border-b border-slate-100 pb-3">
          Teslimat Bilgileri
        </h2>

        {/* Customer Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={nameId}
            className="text-sm font-medium text-slate-800"
          >
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <input
            id={nameId}
            type="text"
            required
            autoComplete="name"
            placeholder="Adınız ve Soyadınız"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (fieldErrors.customerName) {
                setFieldErrors((prev) => ({
                  ...prev,
                  customerName: undefined,
                }));
              }
            }}
            className={`w-full rounded-lg border px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 min-h-[44px] ${
              fieldErrors.customerName
                ? "border-red-500 bg-red-50/20"
                : "border-slate-300"
            }`}
          />
          {fieldErrors.customerName && (
            <p className="text-xs text-red-600 mt-0.5">
              {fieldErrors.customerName}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={phoneId}
            className="text-sm font-medium text-slate-800"
          >
            Telefon Numarası <span className="text-red-500">*</span>
          </label>
          <input
            id={phoneId}
            type="tel"
            required
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) {
                setFieldErrors((prev) => ({ ...prev, phone: undefined }));
              }
            }}
            className={`w-full rounded-lg border px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 min-h-[44px] ${
              fieldErrors.phone
                ? "border-red-500 bg-red-50/20"
                : "border-slate-300"
            }`}
          />
          <p className="text-xs text-slate-500">
            Sipariş teyidi ve teslimat bilgilendirmesi için gereklidir.
          </p>
          {fieldErrors.phone && (
            <p className="text-xs text-red-600 mt-0.5">{fieldErrors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={addressId}
            className="text-sm font-medium text-slate-800"
          >
            Teslimat Adresi (İzmit) <span className="text-red-500">*</span>
          </label>
          <textarea
            id={addressId}
            required
            rows={3}
            autoComplete="street-address"
            placeholder="Mahalle, sokak/cadde, bina no, daire no, kat..."
            value={addressLine1}
            onChange={(e) => {
              setAddressLine1(e.target.value);
              if (fieldErrors.addressLine1) {
                setFieldErrors((prev) => ({
                  ...prev,
                  addressLine1: undefined,
                }));
              }
            }}
            className={`w-full rounded-lg border px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
              fieldErrors.addressLine1
                ? "border-red-500 bg-red-50/20"
                : "border-slate-300"
            }`}
          />
          <p className="text-xs text-slate-500">
            Sadece Kocaeli / İzmit ilçesine teslimat yapılmaktadır.
          </p>
          {fieldErrors.addressLine1 && (
            <p className="text-xs text-red-600 mt-0.5">
              {fieldErrors.addressLine1}
            </p>
          )}
        </div>

        {/* Delivery Notes */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={notesId}
            className="text-sm font-medium text-slate-800"
          >
            Teslimat Notu{" "}
            <span className="text-slate-400 font-normal">(İsteğe bağlı)</span>
          </label>
          <textarea
            id={notesId}
            rows={2}
            maxLength={500}
            placeholder="Varsa kapı zili, daire tarifi veya kuryeye notunuz..."
            value={deliveryNotes}
            onChange={(e) => {
              setDeliveryNotes(e.target.value);
              if (fieldErrors.deliveryNotes) {
                setFieldErrors((prev) => ({
                  ...prev,
                  deliveryNotes: undefined,
                }));
              }
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          />
          {fieldErrors.deliveryNotes && (
            <p className="text-xs text-red-600 mt-0.5">
              {fieldErrors.deliveryNotes}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-950 border-b border-slate-100 pb-3">
          Ödeme Yöntemi
        </h2>

        <div
          className="flex flex-col gap-3"
          role="radiogroup"
          aria-label="Ödeme Yöntemi"
        >
          {/* CASH_ON_DELIVERY */}
          <label
            className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${
              paymentMethod === "CASH_ON_DELIVERY"
                ? "border-sky-600 bg-sky-50/50"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="CASH_ON_DELIVERY"
              checked={paymentMethod === "CASH_ON_DELIVERY"}
              onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
              className="w-4 h-4 text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            />
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 text-sm">
                Kapıda Nakit
              </span>
              <span className="text-xs text-slate-500">
                Teslimat sırasında nakit ödeme
              </span>
            </div>
          </label>

          {/* POS */}
          <label
            className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${
              paymentMethod === "POS"
                ? "border-sky-600 bg-sky-50/50"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="POS"
              checked={paymentMethod === "POS"}
              onChange={() => setPaymentMethod("POS")}
              className="w-4 h-4 text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            />
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 text-sm">
                Kapıda Kredi / Banka Kartı (POS)
              </span>
              <span className="text-xs text-slate-500">
                Teslimat sırasında mobil POS cihazı ile kartla ödeme
              </span>
            </div>
          </label>

          {/* BANK_TRANSFER */}
          <label
            className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${
              paymentMethod === "BANK_TRANSFER"
                ? "border-sky-600 bg-sky-50/50"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="BANK_TRANSFER"
              checked={paymentMethod === "BANK_TRANSFER"}
              onChange={() => setPaymentMethod("BANK_TRANSFER")}
              className="w-4 h-4 text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            />
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 text-sm">
                Banka Havalesi / EFT
              </span>
              <span className="text-xs text-slate-500">
                Sipariş sonrasında IBAN numarasına transfer
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className="w-full bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base rounded-lg px-5 py-3 min-h-[48px] flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 shadow-sm"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Siparişiniz Alınıyor...
          </span>
        ) : (
          "Siparişi Ver"
        )}
      </button>
    </form>
  );
}
