import Link from "next/link";
import { AdminOrderListItemDto } from "@/server/services/admin-order.service";
import { formatPrice } from "@/features/products/format-price";
import { AdminOrderStatusBadge } from "./admin-order-status-badge";
import { PAYMENT_METHOD_LABELS } from "@/features/admin/constants";

interface AdminOrderListProps {
  orders: AdminOrderListItemDto[];
}

export function AdminOrderList({ orders }: AdminOrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Sipariş Bulunamadı
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Seçili filtreye uygun sipariş bulunmamaktadır.
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3.5">
                  Sipariş No & Tarih
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Müşteri & Telefon
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Adres
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Ürünler
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Tutar & Ödeme
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Durum
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orders.map((order) => (
                <tr key={order.publicId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 align-top whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.publicId}`}
                      className="font-mono font-semibold text-sky-700 hover:text-sky-800 hover:underline block"
                    >
                      {order.publicId}
                    </Link>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <span className="font-medium text-slate-900 block">
                      {order.customerName}
                    </span>
                    <a
                      href={`tel:${order.phone}`}
                      className="text-xs text-slate-600 hover:text-sky-700 block mt-0.5"
                    >
                      {order.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 align-top max-w-xs">
                    <p className="text-xs text-slate-700 line-clamp-2">
                      {order.addressLine1}
                    </p>
                    {order.deliveryNotes && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 line-clamp-1 border border-amber-100">
                        Not: {order.deliveryNotes}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 align-top max-w-xs">
                    <span className="text-xs text-slate-800 line-clamp-2">
                      {order.itemsSummary}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      ({order.totalItemsCount} parça)
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top whitespace-nowrap">
                    <span className="font-semibold text-slate-900 block">
                      {formatPrice(parseFloat(order.total))}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top whitespace-nowrap">
                    <AdminOrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3.5 align-top text-right whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.publicId}`}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
                    >
                      Detay Gör &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order.publicId}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <Link
                  href={`/admin/orders/${order.publicId}`}
                  className="font-mono font-bold text-sky-700 hover:text-sky-800 text-sm block"
                >
                  {order.publicId}
                </Link>
                <span className="text-xs text-slate-500">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <AdminOrderStatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Müşteri</span>
                <span className="font-medium text-slate-900">
                  {order.customerName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Telefon</span>
                <a
                  href={`tel:${order.phone}`}
                  className="font-medium text-sky-700 hover:underline"
                >
                  {order.phone}
                </a>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-slate-400 block">Adres</span>
              <p className="text-slate-700 line-clamp-2 mt-0.5">
                {order.addressLine1}
              </p>
              {order.deliveryNotes && (
                <p className="text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 border border-amber-100">
                  Not: {order.deliveryNotes}
                </p>
              )}
            </div>

            <div className="text-xs bg-slate-50 rounded-lg p-2 border border-slate-100">
              <span className="text-slate-500 block mb-0.5">Ürünler:</span>
              <span className="font-medium text-slate-800">
                {order.itemsSummary}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-400 text-xs block">Toplam Tutar</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatPrice(parseFloat(order.total))}
                </span>
                <span className="text-[11px] text-slate-500 ml-1.5">
                  ({PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod})
                </span>
              </div>
              <Link
                href={`/admin/orders/${order.publicId}`}
                className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 min-h-[36px] flex items-center justify-center"
              >
                Detay &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
