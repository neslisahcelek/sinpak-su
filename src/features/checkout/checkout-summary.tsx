"use client";

import Image from "next/image";
import { useCart } from "@/features/cart/cart-context";
import { formatPrice } from "@/features/products/format-price";

export function CheckoutSummary() {
  const { items, products, updateEmptyBottles } = useCart();

  const displayItems = items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return [];
    return [{ ...item, product }];
  });

  const subtotal = displayItems.reduce(
    (acc, di) => acc + parseFloat(di.product.price) * di.quantity,
    0
  );

  const depositTotal = displayItems.reduce((acc, di) => {
    if (
      di.product.type === "DAMACANA_WATER" &&
      di.emptyBottleQuantity < di.quantity
    ) {
      return (
        acc +
        parseFloat(di.product.depositAmount) *
          (di.quantity - di.emptyBottleQuantity)
      );
    }
    return acc;
  }, 0);

  const total = subtotal + depositTotal;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-950 border-b border-slate-100 pb-3">
        Sipariş Özeti
      </h2>

      <div className="flex flex-col gap-3 divide-y divide-slate-100">
        {displayItems.map((di) => {
          const missingBottles =
            di.product.type === "DAMACANA_WATER"
              ? Math.max(0, di.quantity - di.emptyBottleQuantity)
              : 0;
          const itemDeposit =
            di.product.type === "DAMACANA_WATER" && missingBottles > 0
              ? parseFloat(di.product.depositAmount) * missingBottles
              : 0;
          const lineTotal =
            parseFloat(di.product.price) * di.quantity + itemDeposit;

          return (
            <div key={di.productId} className="pt-3 first:pt-0 flex gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                {di.product.imageUrl ? (
                  <Image
                    src={di.product.imageUrl}
                    alt={di.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : null}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium text-slate-900 leading-tight">
                    {di.product.name}
                  </span>
                  <span className="text-sm font-bold text-slate-950 whitespace-nowrap">
                    {formatPrice(lineTotal.toString())}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  {di.quantity} adet × {formatPrice(di.product.price)}
                </div>

                {di.product.type === "DAMACANA_WATER" && (
                  <div className="mt-1 flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor={`checkout-empty-${di.productId}`}
                        className="text-slate-600 font-medium"
                      >
                        İade Boş Damacana:
                      </label>
                      <select
                        id={`checkout-empty-${di.productId}`}
                        value={di.emptyBottleQuantity}
                        onChange={(e) =>
                          updateEmptyBottles(
                            di.productId,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 text-xs min-h-[36px]"
                      >
                        {Array.from({ length: di.quantity + 1 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} adet {i === di.quantity ? "(Depozitosuz)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {itemDeposit > 0 ? (
                      <div className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        + {formatPrice(itemDeposit.toString())} depozito (
                        {missingBottles} adet boş iadesiz)
                      </div>
                    ) : (
                      <div className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                        Depozitosuz (Tüm boş damacanalar iade edilecek)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-200 pt-3 flex flex-col gap-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Ara Toplam</span>
          <span className="font-medium text-slate-900">
            {formatPrice(subtotal.toString())}
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
            {formatPrice(total.toString())}
          </span>
        </div>
      </div>
    </div>
  );
}
