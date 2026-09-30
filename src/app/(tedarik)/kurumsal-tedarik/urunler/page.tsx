import type { Metadata } from "next";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { brandConfig } from "@/lib/site-config";
import { listActiveSupplyCategories } from "@/server/services/admin-supply-category.service";
import { listActiveSupplyProducts } from "@/server/services/admin-supply-product.service";
import { SupplyCatalogView } from "@/features/supply/components/supply-catalog-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const config = brandConfig.tedarik;

export const metadata: Metadata = {
  title: "Kurumsal Ürün Kataloğu | Sinpak Tedarik İzmit",
  description:
    "İşletmeniz, ofisiniz ve fabrikanız için kağıt ürünleri, temizlik kimyasalları ve ambalaj sarf malzemeleri toptan ürün kataloğu.",
  alternates: {
    canonical: "/kurumsal-tedarik/urunler",
  },
};

interface Props {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function KurumsalUrunlerPage({ searchParams }: Props) {
  const { kategori } = await searchParams;

  const [categories, products] = await Promise.all([
    listActiveSupplyCategories(),
    listActiveSupplyProducts(),
  ]);

  return (
    <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-xs text-slate-500 flex items-center gap-1.5"
      >
        <Link href="/" className="hover:text-sky-700 transition-colors">
          Ana Sayfa
        </Link>
        <span>/</span>
        <Link
          href="/kurumsal-tedarik"
          className="hover:text-emerald-700 transition-colors"
        >
          Kurumsal Tedarik
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">Tüm Ürünler</span>
      </nav>

      {/* Hero / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-sm border border-slate-800">
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
            Kurumsal Ürün Kataloğu
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Toptan Sarf & Temizlik Malzemeleri
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Ofis ve tesisleriniz için koli bazlı toptan alımlarda en uygun fiyat teklifini sunuyoruz.
          </p>
        </div>

        <a
          href={config.phoneHref}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 self-start sm:self-auto"
        >
          <PhoneCall className="w-4 h-4 text-emerald-200" />
          <span>Hemen Arayın: {config.phoneFormatted}</span>
        </a>
      </div>

      {/* Interactive Catalog */}
      <SupplyCatalogView
        categories={categories}
        products={products}
        initialCategorySlug={kategori}
      />
    </main>
  );
}
