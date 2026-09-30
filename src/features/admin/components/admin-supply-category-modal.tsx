"use client";

import { useState, useTransition } from "react";
import { type SupplyCategoryDto } from "@/server/services/admin-supply-category.service";
import {
  createSupplyCategoryAction,
  updateSupplyCategoryAction,
} from "@/features/admin/supply-actions";

interface AdminSupplyCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: SupplyCategoryDto | null;
}

interface FormInnerProps {
  category?: SupplyCategoryDto | null;
  onClose: () => void;
}

function CategoryFormInner({ category, onClose }: FormInnerProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    category?.displayOrder !== undefined ? String(category.displayOrder) : "0"
  );
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedOrder = parseInt(displayOrder, 10);
    const safeOrder = isNaN(parsedOrder) || parsedOrder < 0 ? 0 : parsedOrder;

    startTransition(async () => {
      if (isEditing && category) {
        const result = await updateSupplyCategoryAction({
          id: category.id,
          name: name.trim(),
          description: description.trim() || null,
          displayOrder: safeOrder,
          isActive,
        });

        if (!result.success) {
          setError(
            result.error.message || "Kategori güncellenirken bir hata oluştu."
          );
          return;
        }
      } else {
        const result = await createSupplyCategoryAction({
          name: name.trim(),
          description: description.trim() || null,
          displayOrder: safeOrder,
          isActive,
        });

        if (!result.success) {
          setError(
            result.error.message || "Kategori oluşturulurken bir hata oluştu."
          );
          return;
        }
      }

      onClose();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Kategori Adı <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Kağıt & Hijyen, Temizlik Kimyasalları"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Açıklama (İsteğe Bağlı)
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kategori hakkında kısa açıklama..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Görüntüleme Sırası
          </label>
          <input
            type="number"
            min="0"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Küçük sayılar önce listelenir.
          </p>
        </div>

        <div className="flex flex-col justify-center pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span className="text-xs font-semibold text-slate-800">
              Aktif (Yayında)
            </span>
          </label>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isPending || !name.trim()}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isPending && (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>{isEditing ? "Güncelle" : "Kaydet"}</span>
        </button>
      </div>
    </form>
  );
}

export function AdminSupplyCategoryModal({
  isOpen,
  onClose,
  category,
}: AdminSupplyCategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">
            {category ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <CategoryFormInner
          key={category?.id ?? "new"}
          category={category}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
