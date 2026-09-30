"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowRight, Search, PhoneCall } from "lucide-react";
import { type SupplyCategoryDto } from "@/server/services/admin-supply-category.service";
import { type SupplyProductDto } from "@/server/services/admin-supply-product.service";
import { brandConfig } from "@/lib/site-config";

interface SupplyCatalogViewProps {
  categories: SupplyCategoryDto[];
  products: SupplyProductDto[];
  initialCategorySlug?: string;
}

export function SupplyCatalogView({
  categories,
  products,
  initialCategorySlug,
}: SupplyCatalogViewProps) {
  const config = brandConfig.tedarik;

  // Find initial category ID from slug if provided
  const initialCatId = useMemo(() => {
    if (!initialCategorySlug) return "ALL";
    const found = categories.find((c) => c.slug === initialCategorySlug);
    return found ? found.id : "ALL";
  }, [categories, initialCategorySlug]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCatId);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategoryId === "ALL" || p.categoryId === selectedCategoryId;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.unit && p.unit.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün adı, ambalaj veya kategori ara (örn: Havlu, Sıvı Sabun, Koli)..."
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === "ALL"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            Tüm Ürünler ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategoryId === cat.id
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-2xl">
            📦
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              Tedarik Kataloğumuz Güncelleniyor
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Kurumsal sarf ve temizlik malzemeleri ürün kataloğumuz hazırlanmaktadır. Fiyat listesi ve toptan sipariş talepleriniz için lütfen bizimle iletişime geçiniz.
            </p>
          </div>
          <div className="pt-2">
            <a
              href={config.phoneHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{config.phoneFormatted}</span>
            </a>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-2xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Aradığınız kriterlere uygun ürün bulunamadı
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Farklı bir arama kelimesi deneyebilir veya kategoriyi değiştirebilirsiniz.
            </p>
          </div>
          {(selectedCategoryId !== "ALL" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryId("ALL");
                setSearchQuery("");
              }}
              className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => {
            const whatsappHref = `https://wa.me/90${config.phone.replace(
              /^0/,
              ""
            )}?text=${encodeURIComponent(
              `Merhaba Sinpak Tedarik, "${prod.name}"${prod.unit ? ` (${prod.unit})` : ""} için kurumsal fiyat teklifi almak istiyorum.`
            )}`;

            return (
              <div
                key={prod.id}
                className="group rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-full h-44 rounded-xl bg-slate-50 relative overflow-hidden border border-slate-100 mb-3">
                    <Image
                      src={prod.imageUrl || "/images/sinpak-pamukkale-logo.jpg"}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-3 group-hover:scale-102 transition-transform duration-200"
                    />
                  </div>

                  <div>
                    {prod.categoryName && (
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1.5">
                        {prod.categoryName}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-950 text-base leading-snug">
                      {prod.name}
                    </h3>
                    {prod.unit && (
                      <p className="text-xs font-semibold text-emerald-800 mt-1">
                        Ambalaj: {prod.unit}
                      </p>
                    )}
                    {prod.description && (
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                        {prod.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  {prod.price ? (
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Birim / Koli
                      </span>
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg font-mono">
                        ₺{Number(prod.price).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Teklif Alınız
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <a
                      href={config.phoneHref}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Telefonla Ara"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-2xs"
                    >
                      <span>Teklif İste</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
