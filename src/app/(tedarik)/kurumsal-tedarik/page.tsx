import type { Metadata } from "next";
import Link from "next/link";
import {
  PhoneCall,
  Building2,
  Factory,
  GraduationCap,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { brandConfig, siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const config = brandConfig.tedarik;

export const metadata: Metadata = {
  title: "Kurumsal Tedarik | İzmit Ofis, Fabrika & İşletme Sarf Malzeme",
  description:
    "İzmit ve Kocaeli genelinde kurumsal su, temizlik ürünleri ve sarf malzeme tedariki. Ofis, fabrika, okul, kafe ve oteller için periyodik teslimat. Toplu sipariş için hemen arayın.",
  keywords: [
    "kurumsal temizlik tedariki İzmit",
    "ofis sarf malzeme Kocaeli",
    "fabrika temizlik ürünleri İzmit",
    "toptan havlu kağıt İzmit",
    "toptan damacana su İzmit",
    "işletme temizlik tedarikçisi",
    "kurumsal su siparişi Kocaeli",
    "periyodik teslimat İzmit",
  ],
  openGraph: {
    title: "Kurumsal Tedarik | Sinpak Tedarik İzmit",
    description:
      "Ofis, fabrika, okul ve işletmelere periyodik su, temizlik ve sarf malzeme tedariki. İzmit genelinde hızlı teslimat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kurumsal Tedarik | Sinpak Tedarik İzmit",
    description:
      "Ofis, fabrika, okul ve işletmelere periyodik su, temizlik ve sarf malzeme tedariki. İzmit genelinde hızlı teslimat.",
  },
  alternates: {
    canonical: "/kurumsal-tedarik",
  },
};

const kurumsalSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Kurumsal & Toptan Sarf Malzeme Tedariki",
  provider: {
    "@type": "LocalBusiness",
    name: siteConfig.companyName,
    telephone: "+905454543477",
    url: `${siteConfig.url}/kurumsal-tedarik`,
    image: `${siteConfig.url}/images/sinpak-tedarik-banner-clean.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: "İzmit",
      addressRegion: "Kocaeli",
      addressCountry: "TR",
    },
  },
  areaServed: { "@type": "City", name: "İzmit" },
  description:
    "İzmit ve Kocaeli genelinde ofis, fabrika, okul, kafe ve otellere periyodik temizlik kimyasalı, kağıt ürünü ve sarf malzeme tedariki.",
  serviceType: [
    "Kağıt Grubu Tedariği",
    "Temizlik Kimyasalları Tedariği",
    "Ambalaj & Çöp Torbası Tedariği",
  ],
};

const CUSTOMER_TYPES = [
  {
    icon: Building2,
    title: "Ofisler",
    desc: "Şirket ve kurum ofislerine düzenli kağıt grubu, köpük sabun ve temizlik ürünleri.",
    color: "sky",
  },
  {
    icon: Factory,
    title: "Fabrikalar",
    desc: "Üretim tesislerine toplu çöp torbası, temizlik kimyasalı ve kişisel hijyen ürünleri.",
    color: "violet",
  },
  {
    icon: GraduationCap,
    title: "Okullar & Kurumlar",
    desc: "Eğitim kurumlarına periyodik kağıt ürünleri, dezenfektan tedariki.",
    color: "emerald",
  },
  {
    icon: Coffee,
    title: "Kafe & Restoranlar",
    desc: "F&B işletmelerine sarf malzeme ve temizlik ürünleri.",
    color: "amber",
  },
];

import Image from "next/image";
import { listActiveSupplyCategories } from "@/server/services/admin-supply-category.service";
import { listActiveSupplyProducts } from "@/server/services/admin-supply-product.service";

export default async function KurumsalTedarikPage() {
  const [categories, products] = await Promise.all([
    listActiveSupplyCategories(),
    listActiveSupplyProducts(),
  ]);

  const categoriesWithProducts = categories
    .map((cat) => ({
      ...cat,
      products: products.filter((p) => p.categoryId === cat.id),
    }))
    .filter((cat) => cat.products.length > 0);

  const hasProducts = categoriesWithProducts.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kurumsalSchema) }}
      />
      <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-sky-700 transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Kurumsal Tedarik</span>
        </nav>

        {/* Modern Corporate Split Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-emerald-50/80 via-white to-slate-50 border border-emerald-100 p-6 sm:p-8 lg:p-10 shadow-sm">
          {/* Ambient Glows */}
          <div
            className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -left-16 -bottom-16 w-72 h-72 bg-teal-100/30 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl space-y-5">


            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
              İşletmenizin Tüm Temizlik İhtiyaçları{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-700 via-teal-600 to-emerald-800">
                Tek Tedarikçide
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Ofisiniz, fabrikanız, okulunuz veya işletmeniz için kağıt grubu,
              endüstriyel temizlik kimyasalı, çöp torbası ve sarf malzemelerini
              toptan koli fiyatlarıyla ve periyodik olarak kapınıza teslim ediyoruz.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={config.phoneHref}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <PhoneCall className="w-5 h-5 text-emerald-200" />
                <span>Teklif Alın: {config.phoneFormatted}</span>
              </a>
              {hasProducts && (
                <Link
                  href="/kurumsal-tedarik/urunler"
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all"
                >
                  Tüm Ürünler Kataloğu →
                </Link>
              )}
            </div>


          </div>
        </section>

        {/* Customer Types */}
        <section aria-labelledby="kimler-heading">
          <h2
            id="kimler-heading"
            className="text-xl sm:text-2xl font-bold text-slate-900 mb-5"
          >
            Kimler İçin?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CUSTOMER_TYPES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className={`rounded-2xl border p-5 bg-white shadow-xs hover:shadow-md transition-shadow ${color === "sky"
                  ? "border-sky-100"
                  : color === "violet"
                    ? "border-violet-100"
                    : color === "emerald"
                      ? "border-emerald-100"
                      : "border-amber-100"
                  }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color === "sky"
                    ? "bg-sky-50 text-sky-600"
                    : color === "violet"
                      ? "bg-violet-50 text-violet-600"
                      : color === "emerald"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">{title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        {hasProducts && (
          <section aria-labelledby="urun-gruplari-heading" className="space-y-6">
            <div>
              <h2
                id="urun-gruplari-heading"
                className="text-xl sm:text-2xl font-bold text-slate-900"
              >
                Tedarik Ettiğimiz Ürün Grupları
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Toplu alımlar ve periyodik işletme tedariki için öne çıkan ürünlerimiz
              </p>
            </div>

            <div className="space-y-10">
              {categoriesWithProducts.map((cat) => {
                const previewProducts = cat.products.slice(0, 3);

                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/kurumsal-tedarik/urunler?kategori=${cat.slug}`}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors shrink-0"
                      >
                        <span>Tümünü Gör ({cat.products.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {previewProducts.map((prod) => {
                        const whatsappHref = `https://wa.me/90${config.phone.replace(
                          /^0/,
                          ""
                        )}?text=${encodeURIComponent(
                          `Merhaba Sinpak Tedarik, "${prod.name}"${prod.unit ? ` (${prod.unit})` : ""} için kurumsal fiyat teklifi almak istiyorum.`
                        )}`;

                        return (
                          <div
                            key={prod.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="w-full h-40 rounded-xl bg-slate-50 relative overflow-hidden border border-slate-100 mb-3">
                                <Image
                                  src={prod.imageUrl || "/images/sinpak-pamukkale-logo.jpg"}
                                  alt={prod.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-contain p-2"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                  {prod.name}
                                </h4>
                                {prod.unit && (
                                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                                    {prod.unit}
                                  </p>
                                )}
                                {prod.description && (
                                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                                    {prod.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              {prod.price ? (
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-medium">
                                    Fiyat
                                  </span>
                                  <span className="font-bold text-slate-900 text-sm sm:text-base font-mono">
                                    ₺{Number(prod.price).toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Teklif Alınız
                                </span>
                              )}

                              <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-2xs"
                              >
                                <span>Teklif İste</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* View All Products CTA Button */}
              <div className="pt-4 text-center">
                <Link
                  href="/kurumsal-tedarik/urunler"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                >
                  <span>Tüm Kurumsal Ürün Kataloğunu İncele ({products.length} Ürün)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}


        {/* Why Us */}
        <section
          aria-labelledby="neden-sinpak-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
        >
          <h2
            id="neden-sinpak-heading"
            className="text-xl sm:text-2xl font-bold text-slate-900 mb-5"
          >
            Neden Sinpak Tedarik?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
            {[
              { title: "Tek Tedarikçi", desc: "Kağıt ürünleri, temizlik kimyasalı — hepsi tek yerden. Birden fazla tedarikçiyle uğraşmayın." },
              { title: "Periyodik Teslimat", desc: "Haftalık veya aylık düzenli teslimat planı oluşturuyoruz. Stok takibi sizin yerinize bizden." },
              { title: "Kapıda Ödeme", desc: "Nakit veya POS ile kapıda ödeme. Peşin ödeme zorunluluğu yok, kurumsal fatura imkânı." },
            ].map(({ title, desc }) => (
              <div key={title} className="space-y-1.5">
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-slate-800 text-white p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            Kurumsal Teklif Almak İçin Hemen Arayın
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            İhtiyaçlarınızı iletin, size en uygun periyodik teslimat planını hazırlayalım.
          </p>
          <a
            href={config.phoneHref}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-800 font-bold text-sm sm:text-base shadow-lg hover:bg-slate-50 transition-colors"
          >
            <PhoneCall className="w-5 h-5 text-slate-600" />
            {config.phoneFormatted}
          </a>
        </section>

        {/* Cross-link to Sinpak Su */}
        <Link
          href="/"
          className="group block rounded-2xl border border-sky-100 bg-linear-to-r from-sky-50/80 to-white p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-sky-200 transition-all"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                Su Siparişi mi Vermek İstiyorsunuz?
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-900">
                Sinpak Su &mdash; Abant Su Yetkili Bayisi
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Damacana su, pet şişe su ve içecek siparişi için <strong className="text-sky-700">Sinpak Su</strong>&apos;ya göz atın.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </Link>
      </main>
    </>
  );
}
