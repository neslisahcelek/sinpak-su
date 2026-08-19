'use client';

import { useCart } from '@/features/cart/cart-context';
import type { ProductDto } from '@/server/services/product.service';

interface Props {
  product: ProductDto;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: Props) {
  const { items, addToCart } = useCart();

  const cartItem = items.find((i) => i.productId === product.id);
  const isInCart = !!cartItem;

  if (disabled) {
    return (
      <button
        disabled
        className="bg-slate-200 text-slate-500 font-semibold text-base rounded-lg px-5 py-3 min-h-[44px] w-full cursor-not-allowed"
      >
        Stokta Yok
      </button>
    );
  }

  if (isInCart && cartItem) {
    return (
      <button
        onClick={() => addToCart(product.id)}
        className="bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 font-semibold text-base rounded-lg px-5 py-3 min-h-[44px] w-full transition-colors flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Sepette ({cartItem.quantity})
      </button>
    );
  }

  return (
    <button
      onClick={() => addToCart(product.id)}
      className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base rounded-lg px-5 py-3 min-h-[44px] w-full transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
    >
      Sepete Ekle
    </button>
  );
}
