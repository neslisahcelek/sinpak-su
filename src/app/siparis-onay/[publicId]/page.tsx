import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderConfirmation } from "@/server/services/order-confirmation.service";
import { formatPrice } from "@/features/products/format-price";

interface Props {
  params: Promise<{ publicId: string }>;
}

export const metadata: Metadata = {
  title: "Sipariş Onayı | Sinpak Su",
  description: "Sipariş detayları ve onay bilgisi",
  robots: {
    index: false,
    follow: false,
  },
};

const statusLabels: Record<string, string> = {
  PENDING: "Sipariş Alındı (Beklemede)",
  CONFIRMED: "Onaylandı",
  PREPARING: "Hazırlanıyor",
  OUT_FOR_DELIVERY: "Dağıtımda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const paymentMethodLabels: Record<string, string> = {
  CASH_ON_DELIVERY: "Kapıda Nakit",
  POS: "Kapıda Kredi / Banka Kartı (POS)",
  BANK_TRANSFER: "Banka Havalesi / EFT",
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { publicId } = await params;
  const order = await getOrderConfirmation(publicId);

  if (!order) {
    notFound();
  }

  const depositTotal = order.items.reduce(
    (acc, item) => acc + parseFloat(item.depositTotal),
    0
  );

  const formattedDate = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <main className="px-4 lg:px-6 py-8 max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 mb-2">
          Teşekkürler, Siparişiniz Alındı!
        </h1>
        <p className="text-base text-slate-600">
          Siparişiniz başarıyla kaydedildi ve dağıtım ekibimize iletildi.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:p-6 mb-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-4 text-sm">
          <div>
            <span className="text-slate-500 block text-xs mb-0.5">
              Sipariş Numarası
            </span>
            <span className="font-mono font-semibold text-slate-900 break-all">
              {order.publicId}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs mb-0.5">
              Sipariş Tarihi
            </span>
            <span className="font-medium text-slate-900">{formattedDate}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs mb-0.5">
              Sipariş Durumu
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
              {statusLabels[order.status] ?? order.status}
            </span>
          </div>
        </div>

        <div>
          <span className="text-slate-500 block text-xs mb-0.5">
            Ödeme Yöntemi
          </span>
          <span className="font-medium text-slate-900 text-sm">
            {paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod}
          </span>
        </div>

        {/* Items List */}
        <div className="mt-2">
          <h2 className="text-base font-semibold text-slate-950 mb-3">
            Sipariş Edilen Ürünler
          </h2>
          <div className="flex flex-col divide-y divide-slate-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-3 first:pt-0 last:pb-0 flex justify-between items-start gap-4"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-slate-900">
                    {item.productName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.quantity} adet × {formatPrice(item.baseUnitPrice)}
                  </span>
                  {item.productType === "DAMACANA_WATER" && (
                    <span className="text-xs text-slate-600">
                      İade Boş Damacana: {item.emptyBottleQuantity} adet
                      {parseFloat(item.depositTotal) > 0 ? (
                        <span className="text-amber-600 ml-1">
                          (+{formatPrice(item.depositTotal)} depozito)
                        </span>
                      ) : (
                        <span className="text-green-600 ml-1">
                          (Depozitosuz)
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-950 whitespace-nowrap">
                  {formatPrice(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-slate-200 pt-4 flex flex-col gap-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Ara Toplam</span>
            <span className="font-medium text-slate-900">
              {formatPrice(order.subtotal)}
            </span>
          </div>

          {depositTotal > 0 && (
            <div className="flex justify-between">
              <span>Depozito Toplamı</span>
              <span className="font-medium text-amber-600">
                + {formatPrice(depositTotal.toString())}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Teslimat Ücreti</span>
            <span className="font-medium text-green-600">Ücretsiz (İzmit)</span>
          </div>

          <div className="border-t border-slate-200 pt-2 mt-1 flex justify-between text-base font-bold text-slate-950">
            <span>Genel Toplam</span>
            <span className="text-xl text-sky-700">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery & Support Notice */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 lg:p-5 mb-8 text-sm text-sky-900 flex flex-col gap-2">
        <h3 className="font-semibold text-sky-950 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Teslimat Bilgilendirmesi
        </h3>
        <p className="text-sky-800 leading-relaxed">
          Siparişiniz mesai saatleri (09:00 - 19:00) içerisinde İzmit adresinize
          en kısa sürede teslim edilmek üzere yola çıkacaktır. Siparişinizle
          ilgili herhangi bir sorunuz olduğunda sipariş numaranız ile bizimle
          iletişime geçebilirsiniz.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base rounded-lg px-6 py-3 min-h-[44px] inline-flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </main>
  );
}
