import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { getActiveProductBySlug } from "@/server/services/product.service";
import { ProductDetailOrderBox } from "@/features/products/product-detail-order-box";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | Sinpak Su",
      description:
        "Aradığınız ürün bulunamadı veya satıştan kaldırılmış olabilir.",
    };
  }

  const description =
    product.description ||
    `${product.name} siparişi verin. Sinpak Su ile İzmit içi kapınıza hızlı ve güvenilir teslimat.`;

  return {
    title: `${product.name}`,
    description,
    openGraph: {
      title: `${product.name} | Sinpak Su`,
      description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Sinpak Su`,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
    alternates: {
      canonical: `/urunler/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ||
      `${product.name} - Sinpak Su ile İzmit içi hızlı teslimat.`,
    ...(product.imageUrl ? { image: product.imageUrl } : {}),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Abant Su",
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/urunler/${product.slug}`,
      priceCurrency: "TRY",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Extra bottom padding on mobile so sticky bar doesn't cover content */}
      <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto pb-32 lg:pb-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Tüm Ürünlere Dön</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-10 lg:items-start">
          {/* Product image */}
          <div className="w-full lg:w-3/5 flex-shrink-0">
            <div className="aspect-[4/3] w-full bg-linear-to-b from-sky-50/50 via-white to-slate-50/80 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden relative flex items-center justify-center p-6">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-6 hover:scale-105 transition-transform duration-300"
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 leading-tight">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Interactive Order Box (Price + Empty bottle selector + CTA) */}
            <ProductDetailOrderBox product={product} />
          </div>
        </div>
      </main>
    </>
  );
}
