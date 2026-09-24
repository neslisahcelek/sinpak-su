import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PhoneCall,
  ShieldCheck,
  CreditCard,
  Droplets,
  Truck,
  ArrowRight,
} from "lucide-react";
import { brandConfig, siteConfig } from "@/lib/site-config";
import {
  listActiveProducts,
  type ProductDto,
} from "@/server/services/product.service";
import { ProductCatalogSection } from "@/features/products/product-catalog-section";

export const metadata: Metadata = {
  title: "Sinpak Su | İzmit Abant Su Siparişi & Damacana Su",
  description:
    "İzmit Abant Su yetkili bayii Sinpak Su. 19L damacana su, pet şişe su ve içecek siparişleriniz aynı gün kapınızda. Hızlı telefonla sipariş.",
  keywords: [
    "İzmit su siparişi",
    "damacana su İzmit",
    "Abant Su yetkili bayii",
    "Sinpak Su",
    "İzmit su bayisi",
    "damacana su siparişi",
  ],
  openGraph: {
    title: "Sinpak Su | İzmit Abant Su Yetkili Bayii",
    description:
      "Doğal Abant kaynak suyunu İzmit genelinde aynı gün ücretsiz teslimatla kapınıza getiriyoruz.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinpak Su | İzmit Abant Su Yetkili Bayii",
    description:
      "Doğal Abant kaynak suyunu İzmit genelinde aynı gün ücretsiz teslimatla kapınıza getiriyoruz.",
  },
  alternates: {
    canonical: "/",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sinpak Su",
  alternateName: "Sinpak Su - Abant Su Yetkili Bayii",
  description:
    "İzmit genelinde Abant Su yetkili bayisi olarak damacana doğal kaynak suyu, pet şişe su ve soğuk içecek teslimatı.",
  url: siteConfig.url,
  telephone: brandConfig.su.phone,
  priceRange: "₺",
  image: `${siteConfig.url}/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: "İzmit",
    addressRegion: "Kocaeli",
    postalCode: "41000",
    addressCountry: "TR",
  },
  areaServed: {
    "@type": "City",
    name: "İzmit",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: brandConfig.su.phone,
    contactType: "customer service",
    availableLanguage: "Turkish",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "Hangi bölgelere teslimat yapıyorsunuz?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "İzmit merkez mahalleleri başta olmak üzere Yahyakaptan, Alikahya, Bekirdere, Plajyolu, Sanayi ve çevre sanayi sitelerine aynı gün doğrudan araçlarımızla teslimat sağlıyoruz.",
      },
    },
    {
      "@type": "Question",
      "name": "Kapıda ödeme yapabilir miyim?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Evet, su siparişlerinizde kapıda nakit veya mobil POS cihazlarımızla kredi/banka kartı ile güvenle ödeme yapabilirsiniz.",
      },
    },
    {
      "@type": "Question",
      "name": "İşletmeler için kurumsal fatura ve cari hesap açılıyor mu?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Evet. Fabrika, ofis, okul ve kurumlar için e-Fatura kesilmekte ve düzenli periyodik alımlarda kurumsal cari hesap anlaşması yapılabilmektedir.",
      },
    },
  ],
};

export default async function HomePage() {
  let products: ProductDto[] = [];
  let fetchError = false;

  try {
    products = await listActiveProducts();
  } catch {
    fetchError = true;
  }

  const damacanaProduct =
    products.find((p) => p.type === "DAMACANA_WATER") ?? products[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([localBusinessSchema, faqSchema]),
        }}
      />

      <main className="px-4 lg:px-6 py-6 lg:py-8 max-w-5xl mx-auto space-y-10">
        {/* ================================================================= */}
        {/* FERAH SPLIT HERO SECTION (Sade & Modern)                          */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-sky-50/80 via-white to-slate-50/50 border border-sky-100 p-6 sm:p-8 lg:p-10 shadow-sm">
          {/* Ambient Glows */}
          <div
            className="absolute -right-16 -top-16 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading, Subtitle & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 text-sky-900 border border-sky-200/80 text-xs sm:text-sm font-semibold shadow-2xs">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  İzmit İçi Hızlı & Ücretsiz Teslimat
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs sm:text-sm font-semibold">
                  {brandConfig.su.authorizedDealer}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
                Doğal Kaynak Suyu,{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-700 via-sky-600 to-sky-800">
                  Kapınızda.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Abant Su kalitesiyle damacana ve pet su siparişlerinizi İzmit genelinde
                aynı gün kapınıza teslim ediyoruz.
              </p>

              {/* Direct Phone Order CTA */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <a
                  href={brandConfig.su.phoneHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-sky-700 hover:bg-sky-800 active:scale-98 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                >
                  <PhoneCall className="w-5 h-5 text-sky-200" />
                  <span>Hemen Sipariş Ver: {brandConfig.su.phoneFormatted}</span>
                </a>
                <a
                  href="#urunler"
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all"
                >
                  Ürünleri İncele ↓
                </a>
              </div>

              {/* 3 Trust Highlights */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-medium">Aynı Gün Hızlı Servis</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Orijinal Abant Su</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-medium">Kapıda Nakit / POS</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Product Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full aspect-[4/3] sm:aspect-square max-w-md bg-linear-to-tr from-sky-100/90 via-sky-50/50 to-white rounded-3xl p-6 border border-sky-100 shadow-sm relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-4 rounded-2xl border border-sky-200/50 pointer-events-none" />

                {/* pH Badge */}
                <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center gap-1.5 text-xs font-bold text-sky-900">
                  <Droplets className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                  <span>Doğal Kaynak • pH 8.2</span>
                </div>

                {/* Central Bottle Display */}
                {damacanaProduct?.imageUrl ? (
                  <div className="relative w-full h-full max-h-[260px] p-2">
                    <Image
                      src={damacanaProduct.imageUrl}
                      alt={damacanaProduct.name}
                      fill
                      className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                      sizes="(min-width: 1024px) 33vw, 80vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-center gap-3 p-4 text-center">
                    <div className="w-24 h-24 rounded-2xl bg-linear-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-600/25">
                      <Droplets className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Abant Su 19L Damacana
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Bolu Dağı&apos;nın Eşsiz Doğal Kaynak Suyu
                      </p>
                    </div>
                  </div>
                )}

                {/* Working Hours Badge */}
                <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>09:00 - 19:00 Kapınızda</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PRODUCT CATALOG SECTION                                           */}
        {/* ================================================================= */}
        <section id="urunler" aria-labelledby="catalog-heading" className="space-y-5 scroll-mt-20">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="catalog-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
              >
                Ürünlerimiz
              </h2>

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

        {/* ================================================================= */}
        {/* KURUMSAL TEDARİK BANNER (Sade & Şık Tek Kart)                     */}
        {/* ================================================================= */}
        <section
          aria-label="Kurumsal Tedarik Çözümleri"
          className="rounded-3xl border border-slate-200/90 bg-linear-to-r from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-block text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Sinpak Tedarik · İşletmeler & Kurumlar İçin
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Toptan Temizlik, Kağıt & Sarf Malzeme Tedariki
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              İzmit genelindeki ofis, fabrika, okul ve işletmelere toptan kağıt grubu, endüstriyel temizlik kimyasalı, çöp torbası ve sarf malzeme tedariki.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/kurumsal-tedarik"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <span>Kurumsal Kataloğu İncele</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={brandConfig.tedarik.phoneHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{brandConfig.tedarik.phoneFormatted}</span>
            </a>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SIKÇA SORULAN SORULAR (FAQ - SEO Rich Snippets Destekli)          */}
        {/* ================================================================= */}
        <section
          aria-labelledby="faq-heading"
          className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 space-y-6 shadow-xs"
        >
          <div>
            <h2
              id="faq-heading"
              className="text-xl sm:text-2xl font-extrabold text-slate-900"
            >
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Hangi bölgelere teslimat yapıyorsunuz?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                İzmit merkez mahalleleri başta olmak üzere Yahyakaptan, Alikahya, Bekirdere,
                Plajyolu, Sanayi ve çevre sanayi sitelerine aynı gün doğrudan araçlarımızla
                teslimat sağlıyoruz.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Kapıda ödeme yapabilir miyim?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Evet, su siparişlerinizde kapıda nakit veya mobil POS cihazlarımızla
                kredi/banka kartı ile güvenle ödeme yapabilirsiniz.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                İşletmeler için kurumsal fatura ve cari hesap açılıyor mu?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Evet. Fabrika, ofis, okul ve kurumlar için e-Fatura kesilmekte ve düzenli
                periyodik alımlarda kurumsal cari hesap anlaşması yapılabilmektedir.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
