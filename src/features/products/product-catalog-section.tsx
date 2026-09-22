"use client";

import { useState, useMemo } from "react";
import { Chip } from "@heroui/react";
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
      {/* Category Filter Tabs (Modern Segmented Bar with HeroUI Chip) */}
      <div className="w-full overflow-hidden">
        <nav
          aria-label="Ürün Kategorileri"
          className="flex items-center overflow-x-auto no-scrollbar gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count = categoryCounts[cat.key];

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-sm whitespace-nowrap transition-all duration-200 min-h-[44px] rounded-xl select-none ${
                  isActive
                    ? "bg-white text-sky-950 font-bold shadow-sm shadow-slate-200/50 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-950 hover:bg-white/60 font-medium"
                }`}
              >
                <span>{cat.label}</span>
                <Chip
                  size="sm"
                  variant="soft"
                  color={isActive ? "accent" : "default"}
                  className={`text-xs font-bold px-2 py-0.5 border-none transition-colors ${
                    isActive
                      ? "bg-sky-100 text-sky-900"
                      : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {count}
                </Chip>
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
