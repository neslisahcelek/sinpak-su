import type { Metadata } from "next";
import Link from "next/link";
import {
  PhoneCall,
  ShieldCheck,
  CreditCard,
  Droplets,
  Truck,
  Building2,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  Package,
  Layers,
} from "lucide-react";
import { brandConfig, siteConfig } from "@/lib/site-config";
import {
  listActiveProducts,
  type ProductDto,
} from "@/server/services/product.service";
import { ProductCatalogSection } from "@/features/products/product-catalog-section";

export const metadata: Metadata = {
  title: "Sinpak Grup | İzmit Su Siparişi & Kurumsal Tedarik Çözümleri",
  description:
    "İzmit ve Kocaeli genelinde Sinpak Su (Abant Su yetkili bayii damacana su) ve Sinpak Tedarik (ofis & fabrika temizlik, kağıt ve sarf malzeme) hizmetleri tek adreste.",
  keywords: [
    "İzmit su siparişi",
    "damacana su İzmit",
    "Abant Su yetkili bayii",
    "Sinpak Su",
    "Sinpak Tedarik",
    "kurumsal temizlik İzmit",
    "toptan kağıt havlu Kocaeli",
    "ofis sarf malzeme tedarik",
    "fabrika temizlik kimyasalı",
  ],
  openGraph: {
    title: "Sinpak Grup | İzmit Su & Kurumsal Sarf Tedariki",
    description:
      "Evlere ve iş yerlerine aynı gün Abant damacana su; fabrikalara ve ofislere toptan sarf ve temizlik malzemesi tedariki.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinpak Grup | İzmit Su & Kurumsal Sarf Tedariki",
    description:
      "Evlere ve iş yerlerine aynı gün Abant damacana su; fabrikalara ve ofislere toptan sarf ve temizlik malzemesi tedariki.",
  },
  alternates: {
    canonical: "/",
  },
};

const dualBrandSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://sinpaktedarik.com/#sinpak-su",
      name: "Sinpak Su",
      alternateName: "Sinpak Su - Abant Su Yetkili Bayii",
      description:
        "İzmit genelinde Abant Su yetkili bayisi olarak damacana doğal kaynak suyu, pet şişe su ve soğuk içecek teslimatı.",
      url: "https://sinpaktedarik.com",
      telephone: brandConfig.su.phone,
      priceRange: "₺",
      image: "https://sinpaktedarik.com/opengraph-image",
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
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://sinpaktedarik.com/#sinpak-tedarik",
      name: "Sinpak Tedarik",
      description:
        "İzmit ve Kocaeli genelinde fabrika, ofis, okul ve kafelere toptan temizlik kimyasalı, kağıt ve sarf malzeme tedariki.",
      url: "https://sinpaktedarik.com/kurumsal-tedarik",
      telephone: brandConfig.tedarik.phone,
      priceRange: "₺₺",
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
    },
  ],
};

const TEDARIK_CATEGORIES = [
  {
    title: "Kağıt Grubu & Dispenser",
    desc: "Z-katlama havlu, içten çekmeli rulo havlu, mini jumbo tuvalet kağıdı ve muayene masa örtüleri.",
    icon: Layers,
    badge: "Yüksek Tüketim",
  },
  {
    title: "Temizlik & Hijyen Kimyasalları",
    desc: "Endüstriyel sıvı sabun, zemin otomat kimyasalı, kireç çözücü, çamaşır suyu ve bulaşık deterjanı.",
    icon: Sparkles,
    badge: "Ofis & Fabrika",
  },
  {
    title: "Çöp Torbası & Ambalaj Grubu",
    desc: "Hantal boy, battal boy, jumbo ağır hizmet çöp poşetleri, koli bantları ve streç filmler.",
    icon: Package,
    badge: "Toptan Koli",
  },
];

export default async function HomePage() {
  let products: ProductDto[] = [];
  let fetchError = false;

  try {
    products = await listActiveProducts();
  } catch {
    fetchError = true;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dualBrandSchema) }}
      />
      <main className="px-4 lg:px-6 py-6 lg:py-8 max-w-6xl mx-auto space-y-12">
        {/* ================================================================= */}
        {/* DUAL BRAND PORTAL / HUB HERO SECTION                              */}
        {/* ================================================================= */}
        <section className="space-y-6">
          {/* Top Intro Tagline */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>İzmit & Kocaeli Bölge Dağıtım & Tedarik Merkezi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
              Sinpak ile İhtiyacınıza{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-700 via-sky-600 to-emerald-700">
                Doğrudan Çözüm
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Lütfen işlem yapmak istediğiniz hizmet kanalını seçin. Su siparişinizi
              hızlıca verin veya işletmeniz için kurumsal sarf malzeme teklifi alın.
            </p>
          </div>

          {/* Dual Brand Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* BRAND 1: SİNPAK SU */}
            <div
              id="sinpak-su"
              className="relative overflow-hidden rounded-3xl bg-linear-to-b from-sky-50/90 via-white to-sky-50/40 border-2 border-sky-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className="absolute -right-12 -top-12 w-48 h-48 bg-sky-200/50 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                      <Droplets className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                        Marka 01
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                        Sinpak Su
                      </h2>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold">
                    Abant Su Bayii
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ev ve ofisler için 19L damacana doğal kaynak suyu, pet şişe sular ve
                  soğuk içecekler. İzmit geneline aynı gün hızlı teslimat.
                </p>

                {/* Su Features */}
                <div className="space-y-2 py-1 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>09:00 - 19:00 Aynı Gün Hızlı Servis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Orijinal Bolu Abant Doğal Kaynak Suyu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Kapıda Nakit veya Temassız Kredi Kartı (POS)</span>
                  </div>
                </div>
              </div>

              {/* Su Actions */}
              <div className="relative z-10 pt-6 mt-4 border-t border-sky-100 space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="#su-katalog"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all"
                  >
                    <span>Su Siparişi Ver ↓</span>
                  </a>
                  <a
                    href={brandConfig.su.phoneHref}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 font-semibold text-sm transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-sky-600" />
                    <span>{brandConfig.su.phoneFormatted}</span>
                  </a>
                </div>
                <p className="text-[11px] text-center text-slate-500">
                  Su siparişleriniz için özel hat: {brandConfig.su.phoneFormatted}
                </p>
              </div>
            </div>

            {/* BRAND 2: SİNPAK TEDARİK */}
            <div
              id="sinpak-tedarik"
              className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 via-slate-850 to-slate-900 border-2 border-slate-700 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-white group"
            >
              <div
                className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Marka 02
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        Sinpak Tedarik
                      </h2>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-xs font-bold">
                    Kurumsal & Toptan
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Fabrika, ofis, okul, otel ve kafelere toptan rulo havlu, peçete,
                  endüstriyel temizlik kimyasalları ve ambalaj tedariki.
                </p>

                {/* Tedarik Features */}
                <div className="space-y-2 py-1 text-xs sm:text-sm text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kağıt Grubu, Kimyasal & Çöp Torbası Çeşitleri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kurumsal Fatura & Aylık Düzenli Sevkiyat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>İşletmelere Özel Toptan Koli / Palet Fiyatları</span>
                  </div>
                </div>
              </div>

              {/* Tedarik Actions */}
              <div className="relative z-10 pt-6 mt-4 border-t border-slate-800 space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/kurumsal-tedarik"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all"
                  >
                    <span>Kurumsal Kataloğu Gör →</span>
                  </Link>
                  <a
                    href={brandConfig.tedarik.phoneHref}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-semibold text-sm transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>{brandConfig.tedarik.phoneFormatted}</span>
                  </a>
                </div>
                <p className="text-[11px] text-center text-slate-400">
                  Kurumsal tedarik ve teklif hattı: {brandConfig.tedarik.phoneFormatted}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SİNPAK SU BÖLÜMÜ / PRODUCT CATALOG SECTION                        */}
        {/* ================================================================= */}
        <section
          id="su-katalog"
          aria-labelledby="su-catalog-heading"
          className="scroll-mt-24 space-y-6 pt-6 border-t border-slate-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold mb-2">
                <Droplets className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                <span>Sinpak Su Sipariş Hattı</span>
              </div>
              <h2
                id="su-catalog-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950"
              >
                Damacana & Şişe Su Ürünlerimiz
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                İhtiyacınız olan ürünleri inceleyip doğrudan telefonla arayarak hemen
                sipariş verebilirsiniz.
              </p>
            </div>

            <a
              href={brandConfig.su.phoneHref}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm shrink-0 transition-colors shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-sky-200" />
              <span>Su Siparişi: {brandConfig.su.phoneFormatted}</span>
            </a>
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
        {/* SİNPAK TEDARİK BÖLÜMÜ / KURUMSAL SARF TANITIMI                    */}
        {/* ================================================================= */}
        <section
          id="tedarik-bolumu"
          aria-labelledby="tedarik-heading"
          className="scroll-mt-24 rounded-3xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-6 sm:p-8 lg:p-10 space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sinpak Tedarik Kurumsal Çözümler</span>
              </div>
              <h2
                id="tedarik-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950"
              >
                İşletmenizin Sarf & Temizlik İhtiyaçları
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                İzmit ve çevre ilçelerdeki ofis, fabrika, okul ve işletmeler için toptan
                fiyat avantajı, cari hesap ve düzenli adrese teslimat.
              </p>
            </div>

            <Link
              href="/kurumsal-tedarik"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shrink-0 transition-colors shadow-xs"
            >
              <span>Kurumsal Sayfaya Git</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>

          {/* 3 Categories Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TEDARIK_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{cat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Callout */}
          <div className="rounded-2xl bg-emerald-950 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-sm font-bold text-emerald-400">
                Toplu Alım ve Özel Fiyat Teklifi İçin
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                Ürün listenizi iletin, işletmenize özel toptan teklifimizi hazırlayalım.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={brandConfig.tedarik.phoneHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Teklif Hattı: {brandConfig.tedarik.phoneFormatted}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SIKÇA SORULAN SORULAR (FAQ)                                       */}
        {/* ================================================================= */}
        <section
          aria-labelledby="faq-heading"
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 space-y-6 shadow-xs"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Merak Edilenler
            </span>
            <h2
              id="faq-heading"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1"
            >
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Su siparişi ile temizlik malzemesi sipariş hatları neden ayrı?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Su siparişleri gün içi hızlı dağıtım ve ev/ofis teslimatı gerektirir
                ({brandConfig.su.phoneFormatted}). Kurumsal temizlik ve sarf malzeme
                siparişleri ise işletmelere özel toptan fiyatlandırma, koli/palet sevkiyatı
                ve faturalandırma sürecine tabidir ({brandConfig.tedarik.phoneFormatted}).
                Size en hızlı desteği vermek için ekiplerimizi ayrıştırdık.
              </p>
            </div>

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

        {/* ================================================================= */}
        {/* İLETİŞİM & ADRES BİLGİLERİ                                        */}
        {/* ================================================================= */}
        <section
          aria-labelledby="contact-info-heading"
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Resmi Dağıtım & Tedarik Merkezi
                </span>
              </div>
              <h2
                id="contact-info-heading"
                className="text-lg sm:text-xl font-bold text-slate-900 mt-1"
              >
                {siteConfig.companyName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Kocaeli / İzmit Yetkili Dağıtım Noktası
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={brandConfig.su.phoneHref}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
              >
                <Droplets className="w-4 h-4" />
                <span>Su: {brandConfig.su.phoneFormatted}</span>
              </a>
              <a
                href={brandConfig.tedarik.phoneHref}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
              >
                <Building2 className="w-4 h-4" />
                <span>Tedarik: {brandConfig.tedarik.phoneFormatted}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
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
                <p className="font-semibold text-slate-900">Merkez Adresimiz</p>
                <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                  {siteConfig.address.full}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
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
                  Pazartesi – Pazar: 09:00 – 19:00
                </p>
                <p className="text-slate-400 text-xs mt-0.5">Haftanın 7 günü servis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Yetkili Dağıtım</p>
                <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                  Abant Su Yetkili Bayii & Kurumsal Tedarikçi
                </p>
                <p className="text-slate-400 text-xs mt-0.5">Faturalı & Orijinal Ürün</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
