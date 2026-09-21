"use client";

// import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import type { ProductDto } from "@/server/services/product.service";
// import { useCart } from "@/features/cart/cart-context";
// import { AddToCartButton } from "./add-to-cart-button";
import { formatPrice } from "./format-price";

export function ProductCard({ product }: { product: ProductDto }) {
  // const { addToCart } = useCart();
  // const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = !product.isActive;
  // const isDamacana = product.type === "DAMACANA_WATER";

  /*
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };
  */

  return (
    <div
      className={`group relative rounded-2xl shadow-xs hover:shadow-md border border-slate-200 bg-white flex flex-col overflow-hidden h-full transition-all duration-200${
        isOutOfStock ? " grayscale opacity-60" : ""
      }`}
    >
      {/* 
        [GEÇİCİ OLARAK GİZLENDİ - YALNIZCA TELEFONLA SİPARİŞ MODU]
        Hızlı sepete ekle (+) butonu geçici olarak gizlenmiştir.
        Geri getirmek için bu yorum bloğunu kaldırmanız yeterlidir.
      */}
      {/*
      {!isOutOfStock && (
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`${product.name} sepete ekle`}
          className={`absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:scale-90 ${
            justAdded
              ? "bg-emerald-600 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          title="Sepete Ekle"
        >
          {justAdded ? (
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
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
          )}
        </button>
      )}
      */}

      {/* Product Image */}
      <Link
        href={`/urunler/${product.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-sky-700 focus-visible:outline-offset-2"
      >
        <div className="aspect-square w-full bg-slate-50 relative p-4 flex items-center justify-center">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details & Action (Uniform across all products) */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link
          href={`/urunler/${product.slug}`}
          className="focus-visible:outline-2 focus-visible:outline-sky-700"
        >
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 leading-snug hover:text-sky-700 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price Display */}
        <div className="text-xl sm:text-2xl font-bold text-slate-950">
          {formatPrice(product.price)}
        </div>

        {/* Full-width Order Button at Bottom */}
        <div className="mt-auto pt-3 w-full">
          {isOutOfStock ? (
            <button
              disabled
              className="bg-slate-200 text-slate-500 font-semibold text-sm rounded-xl px-4 py-2.5 min-h-[44px] w-full cursor-not-allowed"
            >
              Stokta Yok
            </button>
          ) : (
            <a
              href={siteConfig.phoneHref}
              className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-sm rounded-xl px-4 py-2.5 min-h-[44px] w-full transition-colors duration-150 flex items-center justify-center gap-2 shadow-xs hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
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
              <span>Telefonla Sipariş</span>
            </a>
          )}

          {/* 
            [GEÇİCİ OLARAK GİZLENDİ - YALNIZCA TELEFONLA SİPARİŞ MODU]
            Sepete Ekle Butonu geliştiricinin talebiyle geçici olarak yorum satırına alınmıştır.
            Geri getirmek için yukarıdaki <a> butonunu kaldırıp aşağıdaki satırı açmanız yeterlidir.
          */}
          {/* <AddToCartButton product={product} disabled={isOutOfStock} /> */}
        </div>
      </div>
    </div>
  );
}
