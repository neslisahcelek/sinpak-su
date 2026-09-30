"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { type SupplyProductDto } from "@/server/services/admin-supply-product.service";
import { type SupplyCategoryDto } from "@/server/services/admin-supply-category.service";
import {
  toggleSupplyProductActiveAction,
  deleteSupplyProductAction,
} from "@/features/admin/supply-actions";

interface AdminSupplyProductListProps {
  products: SupplyProductDto[];
  categories: SupplyCategoryDto[];
}

export function AdminSupplyProductList({
  products,
  categories,
}: AdminSupplyProductListProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategoryId === "ALL" || p.categoryId === selectedCategoryId;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.unit && p.unit.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleToggle = (id: string, currentStatus: boolean) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await toggleSupplyProductActiveAction({
        id,
        isActive: !currentStatus,
      });

      if (!result.success) {
        setErrorMessage(
          result.error.message || "Durum güncellenirken bir hata oluştu."
        );
      }
    });
  };

  const handleDelete = (product: SupplyProductDto) => {
    if (
      !confirm(
        `"${product.name}" ürününü silmek istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      const result = await deleteSupplyProductAction({ id: product.id });
      if (!result.success) {
        setErrorMessage(
          result.error.message || "Ürün silinirken bir hata oluştu."
        );
      }
    });
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills / Dropdown */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategoryId === "ALL"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            Tümü ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategoryId === cat.id
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat.name} ({cat.productCount ?? 0})
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün adı veya ambalaj ara..."
            className="w-full px-3.5 py-1.5 text-xs rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-xl">
            📦
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {products.length === 0
              ? "Henüz kurumsal tedarik ürünü eklenmemiş."
              : "Arama veya filtre kriterinize uygun ürün bulunamadı."}
          </p>
          {products.length === 0 && (
            <Link
              href="/admin/tedarik/products/new"
              className="inline-block px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              İlk Ürünü Ekle
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4 w-16 text-center">Görsel</th>
                  <th className="py-3 px-4">Ürün Adı & Kategori</th>
                  <th className="py-3 px-4">Birim / Ambalaj</th>
                  <th className="py-3 px-4">Fiyat</th>
                  <th className="py-3 px-4 text-center">Sıra</th>
                  <th className="py-3 px-4 text-center">Durum</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      !prod.isActive ? "opacity-60 bg-slate-50/40" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <div className="w-11 h-11 rounded-lg border border-slate-200 bg-slate-100 relative overflow-hidden mx-auto flex items-center justify-center">
                        <Image
                          src={prod.imageUrl || "/images/sinpak-pamukkale-logo.jpg"}
                          alt={prod.name}
                          fill
                          sizes="44px"
                          className={prod.imageUrl ? "object-cover" : "object-contain p-1 opacity-70"}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{prod.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {prod.categoryName || "Kategorisiz"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          /{prod.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {prod.unit || "—"}
                    </td>
                    <td className="py-3 px-4">
                      {prod.price ? (
                        <span className="font-bold text-slate-900 font-mono">
                          ₺{Number(prod.price).toFixed(2)}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
                          Teklif Alınız
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600">
                      {prod.displayOrder}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(prod.id, prod.isActive)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          prod.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            prod.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{prod.isActive ? "Aktif" : "Pasif"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/tedarik/products/${prod.id}/edit`}
                        className="inline-block px-2.5 py-1 text-xs font-semibold text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                      >
                        Düzenle
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod)}
                        disabled={isPending}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
