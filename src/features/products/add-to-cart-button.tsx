"use client";

import { useCart } from "@/features/cart/cart-context";
import type { ProductDto } from "@/server/services/product.service";

interface Props {
  product: ProductDto;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ product, disabled, className }: Props) {
  const { items, addToCart } = useCart();

  const cartItem = items.find((i) => i.productId === product.id);
  const isInCart = !!cartItem;

  if (disabled) {
    return (
      <button
        disabled
        className="bg-slate-200 text-slate-500 font-semibold text-sm sm:text-base rounded-xl px-4 py-2.5 sm:py-3 min-h-[44px] w-full cursor-not-allowed"
      >
        Stokta Yok
      </button>
    );
  }

  if (isInCart && cartItem) {
    return (
      <button
        onClick={() => addToCart(product.id, 1)}
        className={`bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 font-semibold text-sm sm:text-base rounded-xl px-4 py-2.5 sm:py-3 min-h-[44px] w-full transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
          className ?? ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
        <span>Sepette ({cartItem.quantity})</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => addToCart(product.id, 1)}
      className={`bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-sm sm:text-base rounded-xl px-4 py-2.5 sm:py-3 min-h-[44px] w-full transition-colors duration-150 flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 shadow-xs hover:shadow ${
        className ?? ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>Sepete Ekle</span>
    </button>
  );
}
