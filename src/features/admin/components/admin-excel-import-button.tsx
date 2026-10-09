"use client";

import { useState } from "react";
import { AdminExcelImportModal } from "./admin-excel-import-modal";
import { useRouter } from "next/navigation";

export interface AdminExcelImportButtonProps {
  mode: "retail" | "supply";
  categories?: { id: string; name: string }[];
}

export function AdminExcelImportButton({
  mode,
  categories = [],
}: AdminExcelImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
        title="Excel tablosundan toplu ürün yükleyin"
      >
        <svg
          className="w-4 h-4 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Excel ile İçe Aktar</span>
      </button>

      <AdminExcelImportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
        categories={categories}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
