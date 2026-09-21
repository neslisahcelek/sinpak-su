"use client";

import { siteConfig } from "@/lib/site-config";
import type { ProductDto } from "@/server/services/product.service";
import { formatPrice } from "./format-price";
// import { AddToCartButton } from "./add-to-cart-button";

interface Props {
  product: ProductDto;
}

export function ProductDetailOrderBox({ product }: Props) {
  const isDamacana = product.type === "DAMACANA_WATER";

  return (
    <div className="space-y-4">
      {/* Price display */}
      <div className="space-y-1">
        <div className="text-3xl font-bold text-slate-950">
          {formatPrice(product.price)}
        </div>
        {isDamacana && (
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="inline-flex text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full self-start">
              + {formatPrice(product.depositAmount)} depozito*
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              * Boş damacananız yoksa veya eksik boş iade edecekseniz, telefonla
              sipariş esnasında kolayca belirtebilirsiniz.
            </p>
            {/* 
              [ORİJİNAL METİN - SEPET MODUNA DÖNÜLDÜĞÜNDE GERİ AÇILABİLİR]:
              * Boş damacananız yoksa veya eksik boş iade edecekseniz, depozito durumunu sepet aşamasında kolayca belirleyebilirsiniz.
            */}
          </div>
        )}
      </div>

      {/* Telefonla Doğrudan Arama / Sipariş Butonu (Desktop) */}
      <div className="hidden lg:block pt-2">
        <a
          href={siteConfig.phoneHref}
          className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base rounded-xl px-5 py-3 min-h-[48px] w-full transition-colors duration-150 flex items-center justify-center gap-2.5 shadow-sm hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-sky-200"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
              clipRule="evenodd"
            />
          </svg>
          <span>Telefonla Sipariş: {siteConfig.phoneFormatted}</span>
        </a>
      </div>

      {/* 
        [GEÇİCİ OLARAK GİZLENDİ - YALNIZCA TELEFONLA SİPARİŞ MODU]
        Masaüstü Sepete Ekle Butonu geliştiricinin talebiyle geçici olarak yorum satırına alınmıştır.
        Geri getirmek için yukarıdaki <div> alanını kaldırıp alttakini açmanız yeterlidir.
      */}
      {/*
      <div className="hidden lg:block pt-2">
        <AddToCartButton product={product} />
      </div>
      */}

      {/* Mobile sticky phone order button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 lg:hidden shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Birim Fiyat</div>
            <div className="text-lg font-bold text-slate-950">
              {formatPrice(product.price)}
            </div>
          </div>
          <div className="flex-1 max-w-xs">
            <a
              href={siteConfig.phoneHref}
              className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-sm rounded-xl px-4 py-2.5 min-h-[44px] w-full transition-colors duration-150 flex items-center justify-center gap-2 shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
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
              <span>Hemen Ara & Sipariş Ver</span>
            </a>
          </div>
        </div>
      </div>

      {/* 
        [GEÇİCİ OLARAK GİZLENDİ - YALNIZCA TELEFONLA SİPARİŞ MODU]
        Mobil Sepete Ekle Butonu geçici olarak yorum satırına alınmıştır.
        Geri getirmek için yukarıdaki sticky barı kaldırıp alttakini açmanız yeterlidir.
      */}
      {/*
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 lg:hidden shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Birim Fiyat</div>
            <div className="text-lg font-bold text-slate-950">
              {formatPrice(product.price)}
            </div>
          </div>
          <div className="flex-1 max-w-xs">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
      */}
    </div>
  );
}
