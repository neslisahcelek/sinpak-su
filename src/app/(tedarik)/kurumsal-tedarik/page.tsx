import type { Metadata } from "next";
import Link from "next/link";
import { PhoneCall, Building2, Factory, GraduationCap, Coffee, CheckCircle2, ArrowRight } from "lucide-react";
import { brandConfig, siteConfig } from "@/lib/site-config";

const config = brandConfig.tedarik;

export const metadata: Metadata = {
  title: "Kurumsal Tedarik | İzmit Ofis, Fabrika & İşletme Sarf Malzeme",
  description:
    "İzmit ve Kocaeli genelinde kurumsal su, temizlik ürünleri ve sarf malzeme tedariki. Ofis, fabrika, okul, kafe ve oteller için periyodik teslimat. Toplu sipariş için hemen arayın.",
  keywords: [
    "kurumsal temizlik tedariki İzmit",
    "ofis sarf malzeme Kocaeli",
    "fabrika temizlik ürünleri İzmit",
    "toptan rulo havlu İzmit",
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
    telephone: "05454543477",
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
    "Rulo Havlu & Peçete Tedariki",
    "Temizlik Kimyasalı Tedariki",
    "Ambalaj & Çöp Torbası Tedariki",
  ],
};

const CUSTOMER_TYPES = [
  {
    icon: Building2,
    title: "Ofisler",
    desc: "Şirket ve kurum ofislerine düzenli rulo havlu, sıvı sabun ve temizlik ürünleri.",
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

const PRODUCTS = [
  {
    category: "Kağıt & Hijyen",
    items: ["Rulo Havlu (Çarşaf / Masura)", "Z Katlama Peçete", "Tuvalet Kağıdı", "Dispenser Sistemleri"],
  },
  {
    category: "Temizlik Kimyasalları",
    items: ["Sıvı El Sabunu", "Yüzey & Genel Temizleyici", "Çamaşır Suyu & Dezenfektan", "Bulaşık Deterjanı"],
  },
  {
    category: "Ambalaj & Çöp",
    items: ["Çöp Torbası (Küçük / Orta / Büyük)", "Naylon Torba", "Ambalaj Malzemeleri"],
  },
];

export default function KurumsalTedarikPage() {
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

        {/* Hero */}
        <section className="rounded-3xl bg-linear-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-10 relative overflow-hidden">
          <div
            className="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              İzmit & Kocaeli Geneli
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Kurumsal & Toptan Sarf Malzeme Tedariki
            </h1>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Ofisiniz, fabrikanız, okulunuz veya işletmeniz için rulo havlu,
              temizlik kimyasalı ve tüm sarf malzemelerinizi
              periyodik olarak kapınıza getiriyoruz. Tek tedarikçi, tam
              güvenilirlik.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={config.phoneHref}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Teklif İçin Hemen Arayın: {config.phoneFormatted}
              </a>
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
                className={`rounded-2xl border p-5 bg-white shadow-xs hover:shadow-md transition-shadow ${
                  color === "sky"
                    ? "border-sky-100"
                    : color === "violet"
                      ? "border-violet-100"
                      : color === "emerald"
                        ? "border-emerald-100"
                        : "border-amber-100"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                    color === "sky"
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
        <section aria-labelledby="urun-gruplari-heading">
          <h2
            id="urun-gruplari-heading"
            className="text-xl sm:text-2xl font-bold text-slate-900 mb-5"
          >
            Tedarik Ettiğimiz Ürün Grupları
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRODUCTS.map(({ category, items }) => (
              <div
                key={category}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <p className="font-bold text-sky-700 text-sm uppercase tracking-wide mb-3">
                  {category}
                </p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

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
