import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { getOrderByPublicId } from "@/server/services/admin-order.service";
import { formatPrice } from "@/features/products/format-price";
import {
  AdminOrderStatusBadge,
  AdminOrderStatusControl,
} from "@/features/admin/components";
import { PAYMENT_METHOD_LABELS } from "@/features/admin/constants";

interface Props {
  params: Promise<{ publicId: string }>;
}

export const metadata: Metadata = {
  title: "Sipariş Detayı | Yönetim Paneli",
  description: "Sipariş ayrıntıları ve durum yönetimi",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { publicId } = await params;
  const order = await getOrderByPublicId(publicId);

  if (!order) {
    notFound();
  }

  const depositTotal = order.items.reduce(
    (acc, item) => acc + parseFloat(item.depositTotal),
    0
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link
          href="/admin/orders"
          className="hover:text-slate-800 transition-colors font-medium flex items-center gap-1"
        >
          &larr; Sipariş Listesine Dön
        </Link>
      </div>

      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                {order.orderNumber}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {order.publicId}
              </p>
            </div>
            <AdminOrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sipariş Tarihi:{" "}
            <strong className="font-medium text-slate-700">
              {formatDate(order.createdAt)}
            </strong>
            {order.updatedAt && (
              <span className="ml-2 text-slate-400">
                (Son Güncelleme: {formatDate(order.updatedAt)})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Order items & pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-semibold text-slate-900">
                Sipariş Edilen Ürünler
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Ürün
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Adet
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Birim Fiyat
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Depozito
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Satır Toplamı
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item) => {
                    const hasDeposit = parseFloat(item.depositTotal) > 0;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3.5 align-middle font-medium text-slate-900">
                          {item.productName}
                        </td>
                        <td className="px-4 py-3.5 align-middle text-center font-semibold text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3.5 align-middle text-right text-slate-600">
                          {formatPrice(parseFloat(item.baseUnitPrice))}
                        </td>
                        <td className="px-4 py-3.5 align-middle text-right text-slate-600">
                          {hasDeposit ? (
                            <div>
                              <span>
                                {formatPrice(parseFloat(item.depositTotal))}
                              </span>
                              <span className="block text-[11px] text-amber-700">
                                ({item.emptyBottleQuantity} boş eksik)
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 align-middle text-right font-semibold text-slate-900">
                          {formatPrice(parseFloat(item.lineTotal))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 p-5 border-t border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Ara Toplam (Ürünler)</span>
                <span className="font-medium text-slate-900">
                  {formatPrice(parseFloat(order.subtotal))}
                </span>
              </div>

              {depositTotal > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Toplam Depozito Ücreti</span>
                  <span className="font-medium">
                    {formatPrice(depositTotal)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Teslimat Ücreti</span>
                <span className="font-medium text-slate-900">
                  {parseFloat(order.deliveryFee) === 0
                    ? "Ücretsiz"
                    : formatPrice(parseFloat(order.deliveryFee))}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-slate-950 pt-3 border-t border-slate-200">
                <span>Genel Toplam</span>
                <span className="text-sky-800 text-lg">
                  {formatPrice(parseFloat(order.total))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Status Control & Customer Details */}
        <div className="space-y-6">
          {/* Status Control Component */}
          <AdminOrderStatusControl
            publicId={order.publicId}
            currentStatus={order.status}
            deliveredAt={order.deliveredAt}
            cancelledAt={order.cancelledAt}
          />

          {/* Customer & Delivery Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Müşteri ve Teslimat Bilgileri
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">
                  Müşteri Adı Soyadı
                </span>
                <span className="font-medium text-slate-900">
                  {order.customerName}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-0.5">
                  Telefon Numarası
                </span>
                <a
                  href={`tel:${order.phone}`}
                  className="font-medium text-sky-700 hover:text-sky-800 hover:underline inline-flex items-center gap-1.5"
                >
                  <svg
                    className="w-4 h-4 text-sky-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {order.phone}
                </a>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-0.5">
                  Teslimat Adresi
                </span>
                <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                  {order.addressLine1}
                </p>
              </div>

              {order.deliveryNotes && (
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">
                    Teslimat Notu
                  </span>
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                    {order.deliveryNotes}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 block mb-0.5">
                  Ödeme Yöntemi
                </span>
                <span className="font-medium text-slate-900">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                    order.paymentMethod}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
