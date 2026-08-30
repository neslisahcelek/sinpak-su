"use client";

import { useState } from "react";
import { lookupOrderAction } from "@/features/orders/tracking-actions";
import type { OrderTrackingDto } from "@/server/services/order-tracking.service";
import { normalizeTurkishPhone } from "@/server/validation/order.schema";
import { formatPrice } from "@/features/products/format-price";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Sipariş Alındı — Hazırlanıyor",
  OUT_FOR_DELIVERY: "Dağıtımda — Yolda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  PENDING: "Siparişiniz alınmış ve hazırlanmaktadır.",
  OUT_FOR_DELIVERY:
    "Siparişiniz kurye tarafından taşınmaktadır, kısa sürede kapınızda olacak.",
  DELIVERED: "Siparişiniz teslim edilmiştir. Afiyet olsun!",
  CANCELLED: "Bu sipariş iptal edilmiştir.",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 border-amber-200 text-amber-800",
  OUT_FOR_DELIVERY: "bg-indigo-50 border-indigo-200 text-indigo-800",
  DELIVERED: "bg-emerald-50 border-emerald-200 text-emerald-800",
  CANCELLED: "bg-rose-50 border-rose-200 text-rose-800",
};

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
}

export function OrderTrackingView({
  initialOrderNumber = "",
}: OrderTrackingViewProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<OrderTrackingDto | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResult(null);

    if (!orderNumber.trim()) {
      setErrorMessage("Sipariş numaranızı giriniz.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Telefon numaranızı giriniz.");
      return;
    }
    if (!normalizeTurkishPhone(phone.trim())) {
      setErrorMessage(
        "Geçerli bir Türkiye cep telefonu numarası giriniz (örn: 0532 123 45 67)."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await lookupOrderAction({
        orderNumber: orderNumber.trim(),
        phone: phone.trim(),
      });

      if (!response.success) {
        setErrorMessage(response.error.message);
      } else {
        setResult(response.data);
      }
    } catch {
      setErrorMessage(
        "Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  return (
    <div className="flex flex-col gap-6">
      {/* Lookup Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:p-6 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="order-number"
            className="text-sm font-medium text-slate-800"
          >
            Sipariş Numarası <span className="text-red-500">*</span>
          </label>
          <input
            id="order-number"
            type="text"
            required
            placeholder="SP-YYMMDD-XXXX"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 min-h-[44px] uppercase"
          />
          <p className="text-xs text-slate-500">
            Sipariş onay sayfasında gösterilen numarayı giriniz (örn:
            SP-260830-4F3A).
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tracking-phone"
            className="text-sm font-medium text-slate-800"
          >
            Telefon Numarası <span className="text-red-500">*</span>
          </label>
          <input
            id="tracking-phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 min-h-[44px]"
          />
          <p className="text-xs text-slate-500">
            Siparişi verirken kullandığınız telefon numarasını giriniz.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base rounded-lg px-5 py-3 min-h-[48px] flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 shadow-sm"
        >
          {isLoading ? (
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
              Sorgulanıyor...
            </span>
          ) : (
            "Siparişimi Sorgula"
          )}
        </button>
      </form>

      {/* Tracking Result */}
      {result && (
        <div className="flex flex-col gap-4">
          {/* Status Card */}
          <div
            className={`rounded-xl border p-5 flex flex-col gap-2 ${STATUS_COLORS[result.status] ?? "bg-slate-50 border-slate-200 text-slate-800"}`}
          >
            <p className="font-bold text-lg">
              {STATUS_LABELS[result.status] ?? result.status}
            </p>
            <p className="text-sm">
              {STATUS_DESCRIPTIONS[result.status] ?? ""}
            </p>
            <p className="text-xs mt-1 opacity-70">
              Son güncelleme: {formatDate(result.updatedAt)}
            </p>
            {result.deliveredAt && (
              <p className="text-xs font-semibold">
                Teslim tarihi: {formatDate(result.deliveredAt)}
              </p>
            )}
            {result.cancelledAt && (
              <p className="text-xs font-semibold">
                İptal tarihi: {formatDate(result.cancelledAt)}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Sipariş Özeti
              </h2>
              <span className="font-mono text-xs text-slate-500">
                {result.orderNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Sipariş tarihi: {formatDate(result.createdAt)}
            </p>

            <div className="flex flex-col divide-y divide-slate-100 mb-4">
              {result.items.map((item, i) => (
                <div
                  key={i}
                  className="py-2.5 first:pt-0 flex justify-between items-center text-sm"
                >
                  <span className="text-slate-800">
                    {item.quantity}× {item.productName}
                  </span>
                  <span className="font-medium text-slate-900 whitespace-nowrap ml-3">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-900">
                Genel Toplam
              </span>
              <span className="text-base font-bold text-sky-700">
                {formatPrice(result.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
