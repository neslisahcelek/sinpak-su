"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
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

        <nav className="flex items-center gap-2">
          <a
            href={siteConfig.phoneHref}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            aria-label={`Telefonla Sipariş: ${siteConfig.phoneFormatted}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-sky-600"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clipRule="evenodd"
              />
            </svg>
            <span>{siteConfig.phoneFormatted}</span>
          </a>

          <Link
            href="/siparis-takip"
            className="text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors px-2 py-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            Sipariş Takip
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
        </nav>
      </div>
    </header>
  );
}
