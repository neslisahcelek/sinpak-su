"use client";

import { useState } from "react";
import { Card, Chip } from "@heroui/react";
import { lookupOrderAction } from "@/features/orders/tracking-actions";
import type { OrderTrackingDto } from "@/server/services/order-tracking.service";
import { normalizeTurkishPhone } from "@/server/validation/order.schema";
import { formatPrice } from "@/features/products/format-price";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Sipariş Alındı — Hazırlanıyor",
  OUT_FOR_DELIVERY: "Dağıtımda — Kurye Yolda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  PENDING: "Siparişiniz sistemimize ulaştı ve kurye ekibimiz tarafından hazırlanıyor.",
  OUT_FOR_DELIVERY:
    "Siparişiniz kuryemiz tarafından teslimat adresinize ulaştırılmak üzere yola çıktı.",
  DELIVERED: "Siparişiniz başarıyla teslim edilmiştir. Afiyet olsun!",
  CANCELLED: "Bu sipariş iptal edilmiştir.",
};

const STATUS_CHIP_CONFIG: Record<
  string,
  { label: string; color: "warning" | "accent" | "success" | "danger" }
> = {
  PENDING: { label: "Hazırlanıyor", color: "warning" },
  OUT_FOR_DELIVERY: { label: "Dağıtımda", color: "accent" },
  DELIVERED: { label: "Teslim Edildi", color: "success" },
  CANCELLED: { label: "İptal Edildi", color: "danger" },
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
      <Card className="rounded-2xl shadow-sm border border-slate-200/90 bg-white p-6 sm:p-7">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="order-number"
              className="text-sm font-semibold text-slate-800"
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
              className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 focus-visible:outline-none min-h-[46px] uppercase"
            />
            <p className="text-xs text-slate-500">
              Sipariş onay sayfasında gösterilen numarayı giriniz (örn: SP-260830-4F3A).
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="tracking-phone"
              className="text-sm font-semibold text-slate-800"
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
              className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 focus-visible:outline-none min-h-[46px]"
            />
            <p className="text-xs text-slate-500">
              Siparişi verirken kullandığınız telefon numarasını giriniz.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 shrink-0 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-base rounded-xl px-5 py-3.5 min-h-[48px] flex items-center justify-center transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs hover:shadow-md hover:scale-[1.005] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
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
                <span>Sorgulanıyor...</span>
              </span>
            ) : (
              "Siparişimi Sorgula"
            )}
          </button>
        </form>
      </Card>

      {/* Tracking Result */}
      {result && (
        <div className="flex flex-col gap-5 animate-page-enter">
          {/* Status Card with HeroUI Chip */}
          <Card className="rounded-2xl border border-slate-200/90 p-6 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Sipariş Durumu
                </span>
                <p className="font-extrabold text-xl text-slate-950">
                  {STATUS_LABELS[result.status] ?? result.status}
                </p>
              </div>

              <Chip
                size="md"
                variant="soft"
                color={STATUS_CHIP_CONFIG[result.status]?.color ?? "default"}
                className="font-bold text-xs px-3 py-1"
              >
                {STATUS_CHIP_CONFIG[result.status]?.label ?? result.status}
              </Chip>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {STATUS_DESCRIPTIONS[result.status] ?? ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-500 border-t border-slate-100">
              <p>Son güncelleme: {formatDate(result.updatedAt)}</p>
              {result.deliveredAt && (
                <p className="font-semibold text-emerald-700">
                  Teslim tarihi: {formatDate(result.deliveredAt)}
                </p>
              )}
              {result.cancelledAt && (
                <p className="font-semibold text-rose-700">
                  İptal tarihi: {formatDate(result.cancelledAt)}
                </p>
              )}
            </div>
          </Card>

          {/* Order Summary Receipt */}
          <Card className="rounded-2xl border border-slate-200/90 p-6 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Sipariş Detayı
              </h2>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                {result.orderNumber}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Sipariş tarihi: {formatDate(result.createdAt)}
            </p>

            <div className="flex flex-col divide-y divide-slate-100">
              {result.items.map((item, i) => (
                <div
                  key={i}
                  className="py-3 first:pt-0 flex justify-between items-center text-sm"
                >
                  <span className="text-slate-800 font-medium">
                    {item.quantity}× {item.productName}
                  </span>
                  <span className="font-semibold text-slate-900 whitespace-nowrap ml-3">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3.5 flex justify-between items-center">
              <span className="text-base font-bold text-slate-900">
                Genel Toplam
              </span>
              <span className="text-xl font-extrabold text-sky-700">
                {formatPrice(result.total)}
              </span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
