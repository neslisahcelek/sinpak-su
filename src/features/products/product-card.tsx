import Image from "next/image";
import Link from "next/link";
import type { ProductDto } from "@/server/services/product.service";
import { AddToCartButton } from "./add-to-cart-button";
import { formatPrice } from "./format-price";

export function ProductCard({ product }: { product: ProductDto }) {
  const isOutOfStock = !product.isActive;

  return (
    <div
      className={`rounded-xl shadow-sm border border-slate-200 bg-white flex flex-col overflow-hidden h-full${isOutOfStock ? " grayscale opacity-60" : ""}`}
    >
      <Link
        href={`/urunler/${product.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-sky-700 focus-visible:outline-offset-2"
      >
        <div className="aspect-square w-full bg-slate-100 relative">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 50vw"
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

      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link
          href={`/urunler/${product.slug}`}
          className="focus-visible:outline-2 focus-visible:outline-sky-700"
        >
          <h3 className="text-base font-medium text-slate-900 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="text-2xl font-bold text-slate-950">
          {formatPrice(product.price)}
        </div>

        {product.type === "DAMACANA_WATER" && (
          <div className="mt-1">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              + {formatPrice(product.depositAmount)} depozito
            </span>
          </div>
        )}

        <div className="mt-auto pt-4 w-full">
          <AddToCartButton product={product} disabled={isOutOfStock} />
        </div>
      </div>
    </div>
  );
}
