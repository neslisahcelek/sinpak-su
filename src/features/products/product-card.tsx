"use client";

// import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import { PhoneCall, ImageOff } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { ProductDto } from "@/server/services/product.service";
import { formatPrice } from "./format-price";

export function ProductCard({ product }: { product: ProductDto }) {
  const isOutOfStock = !product.isActive;
  const isDamacana = product.type === "DAMACANA_WATER";
  const isPet = product.type === "BOTTLED_WATER";

  return (
    <Card
      className={`group relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-slate-200/90 bg-white rounded-2xl ${
        isOutOfStock ? "grayscale opacity-60" : ""
      }`}
    >
      {/* Category / Type Badge */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        {isDamacana ? (
          <Chip size="sm" variant="soft" color="accent" className="font-semibold text-xs bg-sky-100 text-sky-800 border-none shadow-xs">
            19L Damacana
          </Chip>
        ) : isPet ? (
          <Chip size="sm" variant="soft" className="font-semibold text-xs bg-slate-100 text-slate-700 border-none shadow-xs">
            Doğal Kaynak
          </Chip>
        ) : (
          <Chip size="sm" variant="soft" color="warning" className="font-semibold text-xs bg-amber-100 text-amber-900 border-none shadow-xs">
            Soğuk İçecek
          </Chip>
        )}
      </div>

      {/* Product Image */}
      <Link
        href={`/urunler/${product.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-sky-700 focus-visible:outline-offset-2"
      >
        <div className="aspect-square w-full bg-linear-to-b from-sky-50/50 via-slate-50/30 to-white relative p-4 flex items-center justify-center">
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
              <ImageOff className="w-10 h-10 stroke-[1.25]" />
            </div>
          )}
        </div>
      </Link>

      {/* Product Details & Action */}
      <Card.Content className="p-4 flex flex-col gap-2 flex-1">
        <Link
          href={`/urunler/${product.slug}`}
          className="focus-visible:outline-2 focus-visible:outline-sky-700"
        >
          <Card.Title className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-700 transition-colors min-h-[2.5rem]">
            {product.name}
          </Card.Title>
        </Link>

        {/* Price Display */}
        <div className="text-xl sm:text-2xl font-bold text-slate-950 mt-1 tracking-tight">
          {formatPrice(product.price)}
        </div>
      </Card.Content>

      <Card.Footer className="p-4 pt-0 w-full mt-auto">
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
            className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-sm rounded-xl px-4 py-2.5 min-h-[44px] w-full transition-all duration-150 flex items-center justify-center gap-2 shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            <PhoneCall className="w-4 h-4 text-sky-200" />
            <span>Telefonla Sipariş</span>
          </a>
        )}
      </Card.Footer>
    </Card>
  );
}

