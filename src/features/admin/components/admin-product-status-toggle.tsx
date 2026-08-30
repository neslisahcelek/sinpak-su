"use client";

import { useState, useTransition } from "react";
import { toggleProductActiveAction } from "@/features/admin/actions";

interface AdminProductStatusToggleProps {
  productId: string;
  currentIsActive: boolean;
  productName: string;
}

export function AdminProductStatusToggle({
  productId,
  currentIsActive,
  productName,
}: AdminProductStatusToggleProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggle = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const nextState = !currentIsActive;
      const result = await toggleProductActiveAction({
        id: productId,
        isActive: nextState,
      });

      if (!result.success) {
        setErrorMessage(
          result.error.message || "Durum güncellenirken bir hata oluştu."
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        title={
          currentIsActive
            ? `${productName} ürününü pasife al`
            : `${productName} ürününü aktife al`
        }
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border disabled:opacity-60 disabled:cursor-not-allowed ${
          currentIsActive
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            currentIsActive ? "bg-emerald-500" : "bg-slate-400"
          }`}
          aria-hidden="true"
        />
        <span>
          {isPending ? "Güncelleniyor..." : currentIsActive ? "Aktif" : "Pasif"}
        </span>
      </button>

      {errorMessage && (
        <span className="text-[11px] text-red-600 max-w-[140px] leading-tight">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
