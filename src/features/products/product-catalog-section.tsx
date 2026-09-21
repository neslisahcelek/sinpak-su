"use client";

import { useState, useMemo } from "react";
import type { ProductDto } from "@/server/services/product.service";
import { ProductCard } from "./product-card";

interface Props {
  products: ProductDto[];
}

type FilterKey = "ALL" | "DAMACANA_WATER" | "BOTTLED_WATER" | "BEVERAGE";

interface CategoryOption {
  key: FilterKey;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: "ALL", label: "Tüm Ürünler" },
  { key: "DAMACANA_WATER", label: "Damacana" },
  { key: "BOTTLED_WATER", label: "Pet Şişe" },
  { key: "BEVERAGE", label: "İçecekler" },
];

export function ProductCatalogSection({ products }: Props) {
  const [activeCategory, setActiveCategory] = useState<FilterKey>("ALL");

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "ALL") return products;
    return products.filter((p) => p.type === activeCategory);
  }, [products, activeCategory]);

  // Counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = {
      ALL: products.length,
      DAMACANA_WATER: 0,
      BOTTLED_WATER: 0,
      BEVERAGE: 0,
    };
    for (const p of products) {
      if (p.type in counts) {
        counts[p.type as keyof typeof counts]++;
      }
    }
    return counts;
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs (Matching Reference Design) */}
      <div className="w-full overflow-hidden">
        <nav
          aria-label="Ürün Kategorileri"
          className="flex items-stretch overflow-x-auto no-scrollbar gap-1 border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count = categoryCounts[cat.key];

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`relative flex items-center justify-center gap-1.5 px-4 sm:px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-150 min-h-[44px] rounded-lg ${
                  isActive
                    ? "text-slate-950 bg-slate-50 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-red-100 text-red-700 font-bold"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>

                {/* Active Red Highlight Bar (as in reference screenshot) */}
                {isActive && (
                  <span
                    className="absolute bottom-0 inset-x-2 h-0.5 bg-red-600 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-base font-medium text-slate-700">
            Bu kategoride henüz aktif ürün bulunmuyor.
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className="text-sm font-semibold text-sky-700 hover:underline"
          >
            Tüm Ürünleri Göster
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product) => (
            <article key={product.id} className="h-full">
              <ProductCard product={product} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
