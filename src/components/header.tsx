"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";

export function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="text-sky-700 font-bold text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 rounded"
        >
          Sinpak Su
        </Link>

        <button
          onClick={() => setIsCartOpen(true)}
          aria-label="Sepeti aç"
          className="relative p-2 text-slate-600 hover:text-sky-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
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
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>

          {totalItems > 0 && (
            <span
              aria-live="polite"
              aria-atomic="true"
              className="absolute top-0.5 right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-sky-700 rounded-full"
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
