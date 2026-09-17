import type { Metadata } from "next";
import {
  listActiveProducts,
  type ProductDto,
} from "@/server/services/product.service";
import { ProductGrid } from "@/features/products/product-grid";

export const metadata: Metadata = {
  title: "Sinpak Su | İzmit Su ve İçecek Siparişi",
  description:
    "Doğal ve taze damacana su, pet şişe su ve soğuk içecek siparişlerinizi İzmit adresinize kapıda ödeme kolaylığıyla en kısa sürede ulaştırıyoruz.",
  openGraph: {
    title: "Sinpak Su | İzmit Su ve İçecek Siparişi",
    description:
      "Doğal damacana su, şişe su ve içecek siparişleriniz kapınızda.",
  },
};

export default async function HomePage() {
  let products: ProductDto[] = [];
  let fetchError = false;

  try {
    products = await listActiveProducts();
  } catch {
    fetchError = true;
  }

  return (
    <main className="px-4 lg:px-6 py-6 lg:py-8 max-w-5xl mx-auto space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 text-white p-6 sm:p-8 lg:p-10 shadow-lg shadow-sky-900/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-sky-100 text-xs sm:text-sm font-medium border border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            İzmit İçi Hızlı & Ücretsiz Teslimat
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Doğal Kaynak Suyu ve İçecekler Kapınızda
          </h2>

          <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-xl">
            Siparişlerinizi mesai saatleri (09:00 - 19:00) içerisinde oluşturun,
            ekibimiz en kısa sürede kapınıza teslim etsin. Kapıda nakit veya kartla
            (POS) güvenle ödeyin.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-sky-200">
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-sky-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Boş Damacana Değişimi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-sky-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Kapıda Ödeme Kolaylığı</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-sky-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>09:00 - 19:00 Çalışma Saatleri</span>
            </div>
          </div>
        </div>

        {/* Decorative background blob */}
        <div
          className="absolute -right-16 -bottom-16 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
      </section>

      {/* Product Catalog Section */}
      <section aria-labelledby="catalog-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1
              id="catalog-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
            >
              Ürünlerimiz
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              İhtiyacınız olan ürünleri seçip sepetinize ekleyin
            </p>
          </div>
        </div>

        {fetchError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            <p className="text-base font-medium">
              Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </main>
  );
}
