import Link from "next/link";
import Image from "next/image";
import { type AdminProductDto } from "@/server/services/admin-product.service";
import { formatPrice } from "@/features/products/format-price";
import {
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_BADGE_CLASSES,
} from "@/features/admin/constants";
import { AdminProductStatusToggle } from "./admin-product-status-toggle";

interface AdminProductListProps {
  products: AdminProductDto[];
}

export function AdminProductList({ products }: AdminProductListProps) {
  if (products.length === 0) {
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Henüz Ürün Bulunmuyor
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
          Kataloğunuzda listelenen herhangi bir ürün bulunmamaktadır.
        </p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
        >
          + Yeni Ürün Ekle
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3.5 w-16">
                  Görsel
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Ürün Adı & Slug
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Tür
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Birim Fiyat
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Depozito
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Durum
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {products.map((product) => {
                const isInactive = !product.isActive;
                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${
                      isInactive
                        ? "bg-slate-50/60 opacity-80 hover:bg-slate-100/60"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Thumbnail */}
                    <td className="px-4 py-3.5 align-middle">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <svg
                            className="w-6 h-6 text-slate-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* Name & Slug */}
                    <td className="px-4 py-3.5 align-middle">
                      <span className="font-semibold text-slate-900 block text-sm">
                        {product.name}
                      </span>
                      <span className="text-xs font-mono text-slate-500 block mt-0.5">
                        /{product.slug}
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                          PRODUCT_TYPE_BADGE_CLASSES[product.type] ??
                          "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {PRODUCT_TYPE_LABELS[product.type] ?? product.type}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block text-sm">
                        {formatPrice(parseFloat(product.price))}
                      </span>
                    </td>

                    {/* Deposit */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      {parseFloat(product.depositAmount) > 0 ? (
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          +{formatPrice(parseFloat(product.depositAmount))}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Active/Inactive Toggle */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      <AdminProductStatusToggle
                        productId={product.id}
                        currentIsActive={product.isActive}
                        productName={product.name}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 align-middle text-right whitespace-nowrap">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
                      >
                        Düzenle &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {products.map((product) => {
          const isInactive = !product.isActive;
          return (
            <div
              key={product.id}
              className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 ${
                isInactive ? "bg-slate-50/70 opacity-80" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-slate-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">
                      {product.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full border flex-shrink-0 ${
                        PRODUCT_TYPE_BADGE_CLASSES[product.type] ??
                        "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {PRODUCT_TYPE_LABELS[product.type] ?? product.type}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 block truncate mt-0.5">
                    /{product.slug}
                  </span>
                </div>
              </div>

              {/* Price & Deposit Details */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    Birim Fiyat
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatPrice(parseFloat(product.price))}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">
                    Depozito
                  </span>
                  <span className="font-medium text-slate-800 text-sm">
                    {parseFloat(product.depositAmount) > 0
                      ? formatPrice(parseFloat(product.depositAmount))
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Footer with Status Toggle & Edit Link */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <AdminProductStatusToggle
                  productId={product.id}
                  currentIsActive={product.isActive}
                  productName={product.name}
                />
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 min-h-[36px] flex items-center justify-center"
                >
                  Düzenle &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
