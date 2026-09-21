import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import {
  listActiveProducts,
  type ProductDto,
} from "@/server/services/product.service";
import { ProductCatalogSection } from "@/features/products/product-catalog-section";

export const metadata: Metadata = {
  title: "Sinpak Su | Abant Su Yetkili Bayisi - İzmit Su Siparişi",
  description:
    "Abant Su Yetkili Bayisi Sinpak Su. Doğal damacana su, pet şişe su ve soğuk içecek siparişlerinizi İzmit adresinize kapıda ödeme kolaylığıyla en kısa sürede ulaştırıyoruz.",
  openGraph: {
    title: "Sinpak Su | Abant Su Yetkili Bayisi - İzmit Su Siparişi",
    description:
      "Abant Su Yetkili Bayisi Sinpak Su ile doğal damacana su, şişe su ve içecek siparişleriniz kapınızda.",
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
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-sky-100 text-xs sm:text-sm font-medium border border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>İzmit İçi Hızlı & Ücretsiz Teslimat</span>
            <span className="text-white/40">•</span>
            <span className="font-semibold text-white">
              {siteConfig.authorizedDealer}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Abant Su Yetkili Bayisi Sinpak Su Kapınızda
          </h2>

          <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-xl">
            Siparişlerinizi mesai saatleri (09:00 - 19:00) içerisinde oluşturun,
            Abant Su güvencesiyle en kısa sürede kapınıza teslim edelim. Kapıda
            nakit veya kartla (POS) güvenle ödeyin.
          </p>

          {/* Direct Phone Order CTA button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white text-sky-950 font-bold text-sm sm:text-base shadow-lg hover:bg-sky-50 active:scale-98 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-sky-600 animate-pulse"
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
              <span>Telefonla Sipariş: {siteConfig.phoneFormatted}</span>
            </a>
            <a
              href="#catalog-heading"
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-sky-800/60 hover:bg-sky-800 text-sky-100 text-sm sm:text-base font-medium border border-sky-600/50 transition-colors"
            >
              Ürünleri İncele ↓
            </a>
          </div>

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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{siteConfig.authorizedDealer} Güvencesi</span>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Kapıda Ödeme Kolaylığı</span>
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
              İhtiyacınız olan ürünleri inceleyip doğrudan telefonla arayarak
              sipariş verebilirsiniz
            </p>
            {/* [ORİJİNAL METİN - SEPET MODU İÇİN]: <p className="text-sm text-slate-500 mt-1">İhtiyacınız olan ürünleri seçip sepetinize ekleyin</p> */}
          </div>
        </div>

        {fetchError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            <p className="text-base font-medium">
              Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
          </div>
        ) : (
          <ProductCatalogSection products={products} />
        )}
      </section>

      {/* Corporate Trust & Contact Section */}
      <section
        aria-labelledby="contact-info-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                Resmi Dağıtım Merkezi
              </span>
              <span className="text-[11px] font-bold text-sky-800 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">
                {siteConfig.authorizedDealer}
              </span>
            </div>
            <h2
              id="contact-info-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 mt-1"
            >
              {siteConfig.companyName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              İzmit genelinde Abant Su yetkili bayisi olarak doğal damacana su,
              pet su ve soğuk içecek tedariği
            </p>
          </div>

          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm shadow-xs transition-colors shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
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
            <span>Hemen Ara: {siteConfig.phoneFormatted}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Adresimiz</p>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                {siteConfig.address.full}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Yetkili / İletişim</p>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                {siteConfig.contactPerson}
              </p>
              <a
                href={siteConfig.phoneHref}
                className="text-xs sm:text-sm text-sky-700 font-semibold hover:underline mt-0.5 inline-block"
              >
                {siteConfig.phoneFormatted}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Çalışma Saatleri</p>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Haftanın 7 Günü: {siteConfig.workingHours}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Kapıda Nakit veya Kredi Kartı / POS
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
