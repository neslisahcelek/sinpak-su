'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useCart } from './cart-context';
import { formatPrice } from '../products/format-price';

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    products,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  // Join storage items with server-fetched product catalog for display.
  // Prices come from the live product list — never from localStorage.
  const displayItems = items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return []; // product was deactivated since cart was built
    return [{ ...item, product }];
  });

  const subtotal = displayItems.reduce(
    (acc, di) => acc + parseFloat(di.product.price) * di.quantity,
    0
  );
  const depositTotal = displayItems.reduce((acc, di) => {
    if (
      di.product.type === 'DAMACANA_WATER' &&
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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer / Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sepetiniz"
        className="fixed inset-x-0 bottom-0 z-50 lg:inset-y-0 lg:right-0 lg:left-auto lg:bottom-auto w-full lg:w-96 bg-white rounded-t-2xl lg:rounded-none shadow-xl flex flex-col max-h-[85vh] lg:max-h-full lg:h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-slate-950">Sepetiniz</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Kapat"
            className="p-2 text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-300"
                aria-hidden="true"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <p className="text-base text-slate-600">Sepetiniz boş.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-sky-700 font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                Alışverişe devam et
              </button>
            </div>
          ) : (
            displayItems.map((di) => {
              const itemDeposit =
                di.product.type === 'DAMACANA_WATER' &&
                di.emptyBottleQuantity < di.quantity
                  ? parseFloat(di.product.depositAmount) *
                    (di.quantity - di.emptyBottleQuantity)
                  : 0;
              const lineTotal =
                parseFloat(di.product.price) * di.quantity + itemDeposit;

              return (
                <div
                  key={di.productId}
                  className="flex gap-3 border-b border-slate-100 pb-4 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                    {di.product.imageUrl ? (
                      <Image
                        src={di.product.imageUrl}
                        alt={di.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-medium text-slate-900 leading-tight">
                        {di.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(di.productId)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        Kaldır
                      </button>
                    </div>

                    <div className="font-bold text-slate-950 text-sm">
                      {formatPrice(lineTotal.toString())}
                    </div>

                    {itemDeposit > 0 && (
                      <div className="text-xs text-amber-600">
                        + {formatPrice(itemDeposit.toString())} depozito
                      </div>
                    )}

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        aria-label="Miktarı azalt"
                        onClick={() =>
                          updateQuantity(di.productId, di.quantity - 1)
                        }
                        className="w-11 h-11 border border-slate-300 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                        </svg>
                      </button>
                      <span className="w-6 text-center font-medium text-base">
                        {di.quantity}
                      </span>
                      <button
                        aria-label="Miktarı artır"
                        onClick={() =>
                          updateQuantity(di.productId, di.quantity + 1)
                        }
                        className="w-11 h-11 border border-slate-300 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary footer */}
        {displayItems.length > 0 && (
          <div className="border-t border-slate-200 p-4 bg-slate-50 flex flex-col gap-3 flex-shrink-0">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Teslimat</span>
              <span className="font-medium text-green-600">Ücretsiz</span>
            </div>
            {depositTotal > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Depozito</span>
                <span>{formatPrice(depositTotal.toString())}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-slate-950 pt-2 border-t border-slate-200">
              <span>Toplam</span>
              <span>{formatPrice(total.toString())}</span>
            </div>
            {/* Phase 4: checkout — disabled placeholder */}
            <button
              disabled
              title="Yakında"
              className="w-full mt-1 bg-sky-700 text-white font-semibold text-base rounded-lg px-5 py-3 min-h-[44px] opacity-50 cursor-not-allowed"
            >
              Siparişi Tamamla
            </button>
          </div>
        )}
      </div>
    </>
  );
}
