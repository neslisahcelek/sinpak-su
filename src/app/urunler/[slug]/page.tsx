import Image from "next/image";
import { notFound } from "next/navigation";
import { getActiveProductBySlug } from "@/server/services/product.service";
import { formatPrice } from "@/features/products/format-price";
import { AddToCartButton } from "@/features/products/add-to-cart-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isDamacana = product.type === "DAMACANA_WATER";

  return (
    <>
      {/* Extra bottom padding on mobile so sticky bar doesn't cover content */}
      <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto pb-32 lg:pb-8">
        <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
          {/* Product image */}
          <div className="w-full lg:w-3/5 flex-shrink-0">
            <div className="aspect-[4/3] w-full bg-slate-100 rounded-xl overflow-hidden relative">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
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
          </div>

          {/* Product details */}
          <div className="flex flex-col gap-4 mt-6 lg:mt-0 lg:w-2/5">
            <h1 className="text-2xl font-semibold text-slate-950 leading-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-bold text-slate-950">
              {formatPrice(product.price)}
            </div>

            {isDamacana && (
              <div className="flex flex-col gap-2">
                <span className="inline-flex text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full self-start">
                  + {formatPrice(product.depositAmount)} depozito*
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  * Damacana depositi yalnızca boş damacana iade etmediğiniz
                  birimler için uygulanır. Sipariş sırasında kaç adet boş
                  damacanayı iade edeceğinizi belirtebilirsiniz.
                </p>
              </div>
            )}

            {product.description && (
              <p className="text-base text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Desktop Add to Cart (hidden on mobile — sticky bar is used) */}
            <div className="hidden lg:block mt-4">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky Add to Cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 lg:hidden">
        <AddToCartButton product={product} />
      </div>
    </>
  );
}
