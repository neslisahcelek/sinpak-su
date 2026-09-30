"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type SupplyProductDto } from "@/server/services/admin-supply-product.service";
import { type SupplyCategoryDto } from "@/server/services/admin-supply-category.service";
import {
  createSupplyProductAction,
  updateSupplyProductAction,
} from "@/features/admin/supply-actions";
import { AdminImageUpload } from "./admin-image-upload";

interface AdminSupplyProductFormProps {
  mode: "create" | "edit";
  categories: SupplyCategoryDto[];
  initialData?: SupplyProductDto;
}

export function AdminSupplyProductForm({
  mode,
  categories,
  initialData,
}: AdminSupplyProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? (categories[0]?.id || "")
  );
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [unit, setUnit] = useState(initialData?.unit ?? "");
  const [price, setPrice] = useState(initialData?.price ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    initialData?.displayOrder !== undefined
      ? String(initialData.displayOrder)
      : "0"
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const parsedOrder = parseInt(displayOrder, 10);
    const safeOrder = isNaN(parsedOrder) || parsedOrder < 0 ? 0 : parsedOrder;

    startTransition(async () => {
      if (mode === "create") {
        const payload = {
          categoryId,
          name: name.trim(),
          description: description.trim() || null,
          unit: unit.trim() || null,
          price: price.trim() || null,
          displayOrder: safeOrder,
          imageUrl: imageUrl.trim() || null,
          isActive,
        };

        const result = await createSupplyProductAction(payload);

        if (!result.success) {
          if (
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details
          ) {
            const details = result.error.details as {
              fieldErrors?: Record<string, string[]>;
            };
            if (details.fieldErrors) {
              const flatErrors: Record<string, string> = {};
              for (const [key, msgs] of Object.entries(details.fieldErrors)) {
                if (msgs && msgs.length > 0) {
                  flatErrors[key] = msgs[0];
                }
              }
              setFieldErrors(flatErrors);
            }
          }
          setRootError(
            result.error.message || "Ürün oluşturulurken bir hata oluştu."
          );
          return;
        }

        router.push("/admin/tedarik/products");
      } else {
        if (!initialData) return;

        const payload = {
          id: initialData.id,
          categoryId,
          name: name.trim(),
          description: description.trim() || null,
          unit: unit.trim() || null,
          price: price.trim() || null,
          displayOrder: safeOrder,
          imageUrl: imageUrl.trim() || null,
          isActive,
        };

        const result = await updateSupplyProductAction(payload);

        if (!result.success) {
          if (
            result.error.code === "VALIDATION_ERROR" &&
            result.error.details
          ) {
            const details = result.error.details as {
              fieldErrors?: Record<string, string[]>;
            };
            if (details.fieldErrors) {
              const flatErrors: Record<string, string> = {};
              for (const [key, msgs] of Object.entries(details.fieldErrors)) {
                if (msgs && msgs.length > 0) {
                  flatErrors[key] = msgs[0];
                }
              }
              setFieldErrors(flatErrors);
            }
          }
          setRootError(
            result.error.message || "Ürün güncellenirken bir hata oluştu."
          );
          return;
        }

        router.push("/admin/tedarik/products");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {rootError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-start justify-between">
          <span>{rootError}</span>
          <button
            type="button"
            onClick={() => setRootError(null)}
            className="text-rose-500 hover:text-rose-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {categories.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl flex items-center justify-between">
          <span>
            Ürün eklemek için önce en az bir tedarik kategorisi oluşturmalısınız.
          </span>
          <Link
            href="/admin/tedarik/categories"
            className="px-3 py-1.5 bg-amber-600 text-white font-semibold text-xs rounded-xl hover:bg-amber-700 transition-colors"
          >
            Kategorilere Git →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left / Main Details (2 Cols) */}
        <div className="md:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Ürün Bilgileri
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={categories.length === 0}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {!cat.isActive ? "(Pasif)" : ""}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId && (
              <p className="text-xs text-rose-600 mt-1">{fieldErrors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ürün Adı <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: 21cm Hareketli Rulo Havlu, Endüstriyel Sıvı Sabun 5L"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            {fieldErrors.name && (
              <p className="text-xs text-rose-600 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Birim / Ambalaj
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Örn: 12'li Koli, 5 Litre Bidon, 200 Yaprak"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Koli veya paket içi adedini belirtin.
              </p>
              {fieldErrors.unit && (
                <p className="text-xs text-rose-600 mt-1">{fieldErrors.unit}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Fiyat (₺) <span className="text-slate-400 font-normal">(İsteğe Bağlı)</span>
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Örn: 350.00 (Boşsa teklif usulü)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Boş bırakılırsa &quot;Fiyat Teklifi Alınız&quot; görünür.
              </p>
              {fieldErrors.price && (
                <p className="text-xs text-rose-600 mt-1">{fieldErrors.price}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Açıklama / Özellikler
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ürünün teknik özellikleri, kullanım alanları, dispenser uyumu..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            {fieldErrors.description && (
              <p className="text-xs text-rose-600 mt-1">{fieldErrors.description}</p>
            )}
          </div>
        </div>

        {/* Right / Side Meta & Image (1 Col) */}
        <div className="space-y-5">
          {/* Image Upload Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Ürün Görseli
            </h2>
            <AdminImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              disabled={isPending}
              error={fieldErrors.imageUrl}
            />
          </div>

          {/* Visibility & Display Order Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Yayın & Sıralama
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sıralama Önceliği
              </label>
              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Küçük sayılar önce listelenir.</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Ürünü Yayına Al (Aktif)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Link
          href="/admin/tedarik/products"
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
        >
          ← Vazgeç ve Listeye Dön
        </Link>

        <button
          type="submit"
          disabled={isPending || categories.length === 0 || !name.trim()}
          className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isPending && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>{mode === "create" ? "Ürünü Kaydet" : "Değişiklikleri Güncelle"}</span>
        </button>
      </div>
    </form>
  );
}
