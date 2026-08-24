"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProductType } from "@prisma/client";
import { type AdminProductDto } from "@/server/services/admin-product.service";
import {
  createProductAction,
  updateProductAction,
} from "@/features/admin/actions";
import { PRODUCT_TYPE_LABELS } from "@/features/admin/constants";

interface AdminProductFormProps {
  mode: "create" | "edit";
  initialData?: AdminProductDto;
}

export function AdminProductForm({ mode, initialData }: AdminProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form fields
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [type, setType] = useState<ProductType>(
    initialData?.type ?? ProductType.DAMACANA_WATER
  );
  const [price, setPrice] = useState(initialData?.price ?? "");
  const [depositAmount, setDepositAmount] = useState(
    initialData?.depositAmount ?? "0.00"
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  // Preview state for imageUrl
  const [previewError, setPreviewError] = useState(false);

  const isDamacana = type === ProductType.DAMACANA_WATER;

  const handleTypeChange = (newType: ProductType) => {
    setType(newType);
    if (newType !== ProductType.DAMACANA_WATER) {
      setDepositAmount("0.00");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    startTransition(async () => {
      if (mode === "create") {
        const payload = {
          name: name.trim(),
          description: description.trim(),
          type,
          price: price.trim(),
          depositAmount: isDamacana ? depositAmount.trim() : "0.00",
          imageUrl: imageUrl.trim() || null,
          isActive,
        };

        const result = await createProductAction(payload);

        if (!result.success) {
          if (result.error.code === "VALIDATION_ERROR" && result.error.details) {
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
          setRootError(result.error.message || "Ürün oluşturulurken bir hata oluştu.");
          return;
        }

        router.push("/admin/products");
        router.refresh();
      } else {
        if (!initialData?.id) {
          setRootError("Ürün kimliği bulunamadı.");
          return;
        }

        const payload = {
          id: initialData.id,
          name: name.trim(),
          description: description.trim(),
          type,
          price: price.trim(),
          depositAmount: isDamacana ? depositAmount.trim() : "0.00",
          imageUrl: imageUrl.trim() || null,
          isActive,
        };

        const result = await updateProductAction(payload);

        if (!result.success) {
          if (result.error.code === "VALIDATION_ERROR" && result.error.details) {
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
          setRootError(result.error.message || "Ürün güncellenirken bir hata oluştu.");
          return;
        }

        router.push("/admin/products");
        router.refresh();
      }
    });
  };

  const hasValidPreview =
    imageUrl.trim().length > 0 &&
    (imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("/")) &&
    !previewError;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
    >
      {rootError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          <p className="font-medium">{rootError}</p>
        </div>
      )}

      {/* Mode-specific read-only info (Slug on Edit) */}
      {mode === "edit" && initialData && (
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-700 block">Kalıcı Bağlantı (Slug):</span>
            <span className="font-mono text-slate-900 mt-0.5 block">
              /urunler/{initialData.slug}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded self-start sm:self-auto">
            Değiştirilemez
          </span>
        </div>
      )}

      {/* Grid: Name & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="product-name"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Ürün Adı <span className="text-red-500">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            placeholder="Örn: 19L Doğal Kaynak Damacana Su"
            className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
              fieldErrors.name ? "border-red-400 focus:ring-red-500" : "border-slate-300"
            }`}
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="product-type"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Ürün Türü <span className="text-red-500">*</span>
          </label>
          <select
            id="product-type"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as ProductType)}
            disabled={isPending}
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
          >
            {Object.values(ProductType).map((t) => (
              <option key={t} value={t}>
                {PRODUCT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          {fieldErrors.type && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.type}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="product-description"
          className="block text-sm font-semibold text-slate-900 mb-1.5"
        >
          Açıklama <span className="text-red-500">*</span>
        </label>
        <textarea
          id="product-description"
          required
          rows={3}
          minLength={2}
          maxLength={1000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
          placeholder="Ürünün özelliklerini, içeriğini ve kullanım detaylarını belirtiniz..."
          className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
            fieldErrors.description
              ? "border-red-400 focus:ring-red-500"
              : "border-slate-300"
          }`}
        />
        {fieldErrors.description && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>
        )}
      </div>

      {/* Grid: Price & Deposit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="product-price"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Birim Fiyat (TL) <span className="text-red-500">*</span>
          </label>
          <input
            id="product-price"
            type="text"
            required
            pattern="^\d+(\.\d{1,2})?$"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isPending}
            placeholder="180.00"
            className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
              fieldErrors.price ? "border-red-400 focus:ring-red-500" : "border-slate-300"
            }`}
          />
          {fieldErrors.price && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.price}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Örn: 180 veya 180.50 (nokta ile)
          </p>
        </div>

        <div>
          <label
            htmlFor="product-deposit"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Depozito Tutarı (TL)
          </label>
          <input
            id="product-deposit"
            type="text"
            disabled={!isDamacana || isPending}
            pattern="^\d+(\.\d{1,2})?$"
            value={isDamacana ? depositAmount : "0.00"}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.00"
            className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
              fieldErrors.depositAmount
                ? "border-red-400 focus:ring-red-500"
                : "border-slate-300"
            }`}
          />
          {fieldErrors.depositAmount && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.depositAmount}
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {isDamacana
              ? "Damacana iadesi yapılmayan birimler için depozito bedeli."
              : "Yalnızca Damacana Su türü için depozito belirlenebilir."}
          </p>
        </div>
      </div>

      {/* Image URL & Live Preview */}
      <div>
        <label
          htmlFor="product-image-url"
          className="block text-sm font-semibold text-slate-900 mb-1.5"
        >
          Görsel URL (İsteğe Bağlı)
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <input
              id="product-image-url"
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewError(false);
              }}
              disabled={isPending}
              placeholder="https://... veya /images/urun.png"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                fieldErrors.imageUrl
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-300"
              }`}
            />
            {fieldErrors.imageUrl && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.imageUrl}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              HTTP/HTTPS veya yerel statik yol (/images/...) desteklenir.
            </p>
          </div>

          {/* Preview Box */}
          <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
            {hasValidPreview ? (
              <Image
                src={imageUrl}
                alt="Önizleme"
                fill
                className="object-cover"
                sizes="80px"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <span className="text-[11px] text-slate-400 text-center px-1">
                {imageUrl ? "Geçersiz Görsel" : "Görsel Yok"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Active Checkbox */}
      <div className="pt-2">
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={isPending}
            className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
          />
          <div>
            <span className="text-sm font-semibold text-slate-900 block">
              Ürün Satışa Açık (Aktif)
            </span>
            <span className="text-xs text-slate-500 block">
              Pasife alınan ürünler müşterilere gösterilmez ve sipariş verilemez.
            </span>
          </div>
        </label>
      </div>

      {/* Actions: Submit & Cancel */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Link
          href="/admin/products"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none"
        >
          İptal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {isPending
            ? mode === "create"
              ? "Ekleniyor..."
              : "Kaydediliyor..."
            : mode === "create"
            ? "Ürünü Oluştur"
            : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
