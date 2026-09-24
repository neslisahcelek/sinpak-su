"use client";

import { Card, Chip } from "@heroui/react";
import { siteConfig } from "@/lib/site-config";
import type { ProductDto } from "@/server/services/product.service";
import { formatPrice } from "./format-price";

interface Props {
  product: ProductDto;
}

export function ProductDetailOrderBox({ product }: Props) {
  const isDamacana = product.type === "DAMACANA_WATER";
  const isOutOfStock = !product.isActive;

  return (
    <div className="space-y-5">
      {/* Desktop Order Card */}
      <Card className="rounded-2xl border border-slate-200/90 shadow-sm p-6 bg-white space-y-5">
        {/* Price display */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ birim fiyat</span>
          </div>

          {isDamacana && (
            <div className="flex flex-col gap-2 pt-1">
              <Chip
                size="sm"
                variant="soft"
                color="warning"
                className="font-semibold text-xs bg-amber-50 text-amber-900 border border-amber-200/60 self-start"
              >
                + {formatPrice(product.depositAmount)} depozito bedeli*
              </Chip>
              <p className="text-xs text-slate-500 leading-relaxed">
                * Boş damacananız yoksa veya eksik boş iade edecekseniz, telefonla sipariş esnasında kolayca belirtebilirsiniz.
              </p>
            </div>
          )}
        </div>

        {/* Guarantees / Highlights */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-emerald-600 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>İzmit içi hızlı ve ücretsiz teslimat (09:00 - 19:00)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-emerald-600 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Kapıda Nakit veya Kredi Kartı (POS) ile ödeme</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-emerald-600 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{siteConfig.authorizedDealer} resmi güvencesi</span>
          </div>
        </div>

        {/* Telefonla Doğrudan Arama / Sipariş Butonu (Desktop) */}
        <div className="hidden lg:block pt-1">
          {isOutOfStock ? (
            <button
              disabled
              className="bg-slate-200 text-slate-500 font-semibold text-base rounded-xl px-5 py-3.5 min-h-[48px] w-full cursor-not-allowed"
            >
              Stokta Yok
            </button>
          ) : (
            <a
              href={siteConfig.phoneHref}
              className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-base rounded-xl px-5 py-3.5 min-h-[48px] w-full transition-all duration-150 flex items-center justify-center gap-2.5 shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-sky-200 animate-pulse"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Hemen Ara: {siteConfig.phoneFormatted}</span>
            </a>
          )}
        </div>
      </Card>

      {/* Mobile sticky phone order button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-4 lg:hidden shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Birim Fiyat</div>
            <div className="text-xl font-bold text-slate-950">
              {formatPrice(product.price)}
            </div>
          </div>
          <div className="flex-1 max-w-xs">
            <a
              href={siteConfig.phoneHref}
              className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-sm rounded-xl px-4 py-3 min-h-[44px] w-full transition-all duration-150 flex items-center justify-center gap-2 shadow-xs hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-sky-200"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Hemen Ara</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

