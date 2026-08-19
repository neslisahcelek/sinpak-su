"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";
import { CheckoutForm } from "./checkout-form";
import { CheckoutSummary } from "./checkout-summary";

export function CheckoutView() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-950 mb-2">
          Sepetiniz Boş
        </h1>
        <p className="text-base text-slate-600 max-w-md mb-6">
          Sipariş verebilmek için lütfen sepetinize en az bir ürün ekleyiniz.
        </p>
        <Link
          href="/"
          className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base rounded-lg px-6 py-3 min-h-[44px] inline-flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        >
          Ürünleri İncele
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form column (Left / Main) */}
      <div className="lg:col-span-7 order-2 lg:order-1">
        <CheckoutForm />
      </div>

      {/* Summary column (Right / Sticky on desktop) */}
      <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-20">
        <CheckoutSummary />
      </div>
    </div>
  );
}
