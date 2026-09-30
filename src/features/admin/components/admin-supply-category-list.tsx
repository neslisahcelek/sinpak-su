"use client";

import { useState, useTransition } from "react";
import { type SupplyCategoryDto } from "@/server/services/admin-supply-category.service";
import {
  toggleSupplyCategoryActiveAction,
  deleteSupplyCategoryAction,
} from "@/features/admin/supply-actions";
import { AdminSupplyCategoryModal } from "./admin-supply-category-modal";

interface AdminSupplyCategoryListProps {
  categories: SupplyCategoryDto[];
}

export function AdminSupplyCategoryList({
  categories,
}: AdminSupplyCategoryListProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<SupplyCategoryDto | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (category: SupplyCategoryDto) => {
    setSelectedCategory(category);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await toggleSupplyCategoryActiveAction({
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

  const handleDelete = (category: SupplyCategoryDto) => {
    if (category.productCount && category.productCount > 0) {
      setErrorMessage(
        `"${category.name}" kategorisinde ${category.productCount} ürün bulunmaktadır. Kategoriyi silmek için önce bu ürünleri silmeli veya başka kategoriye taşımalısınız.`
      );
      return;
    }

    if (
      !confirm(
        `"${category.name}" kategorisini silmek istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      const result = await deleteSupplyCategoryAction({ id: category.id });
      if (!result.success) {
        setErrorMessage(
          result.error.message || "Kategori silinirken bir hata oluştu."
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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Tedarik Kategorileri
          </h2>
          <p className="text-xs text-slate-500">
            Kurumsal tedarik ürünlerinin sınıflandırıldığı kategoriler
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors"
        >
          <span>+ Yeni Kategori Ekle</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-xl">
            🏷️
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Henüz eklenmiş bir tedarik kategorisi bulunmuyor.
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ürün eklemeden önce Kağıt & Hijyen, Temizlik Kimyasalları gibi kategoriler oluşturun.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            İlk Kategoriyi Ekle
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Kategori Adı</th>
                  <th className="py-3 px-4">Açıklama</th>
                  <th className="py-3 px-4 text-center">Ürün Sayısı</th>
                  <th className="py-3 px-4 text-center">Sıra</th>
                  <th className="py-3 px-4 text-center">Durum</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      !cat.isActive ? "opacity-60 bg-slate-50/40" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>
                        <span>{cat.name}</span>
                        <div className="text-[11px] font-normal text-slate-400 font-mono">
                          /{cat.slug}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {cat.productCount ?? 0} ürün
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {cat.displayOrder}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(cat.id, cat.isActive)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cat.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{cat.isActive ? "Aktif" : "Pasif"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="px-2.5 py-1 text-xs font-semibold text-sky-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
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

      <AdminSupplyCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
