"use client";

import { useState, useTransition } from "react";
import {
  parseExcelBuffer,
  autoDetectProductColumns,
  autoDetectSupplyColumns,
  parseExcelPrice,
  parseExcelNumber,
  parseExcelString,
  type ParsedExcelData,
  type ProductColumnMapping,
  type SupplyColumnMapping,
} from "@/lib/excel-parser";
import {
  bulkImportProductsAction,
  bulkImportSupplyProductsAction,
} from "@/features/admin/bulk-import-actions";
import type { BulkImportSummary } from "@/server/services/admin-bulk-import.service";

export interface AdminExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "retail" | "supply";
  categories?: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function AdminExcelImportModal({
  isOpen,
  onClose,
  mode,
  categories = [],
  onSuccess,
}: AdminExcelImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [parsedData, setParsedData] = useState<ParsedExcelData | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // Column mappings
  const [productMapping, setProductMapping] = useState<ProductColumnMapping>({
    name: "",
    price: "",
  });
  const [supplyMapping, setSupplyMapping] = useState<SupplyColumnMapping>({
    name: "",
  });
  const [fallbackCategoryId, setFallbackCategoryId] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [importSummary, setImportSummary] = useState<BulkImportSummary | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const parsed = parseExcelBuffer(buffer);

      if (parsed.headers.length === 0 || parsed.rows.length === 0) {
        setErrorMessage(
          "Seçilen Excel dosyasında okunabilir veri satırı bulunamadı."
        );
        return;
      }

      setParsedData(parsed);

      if (mode === "retail") {
        setProductMapping(autoDetectProductColumns(parsed.headers));
      } else {
        setSupplyMapping(autoDetectSupplyColumns(parsed.headers));
      }

      setStep(2);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Excel dosyası işlenirken hata oluştu."
      );
    }
  };

  const handleStartImport = () => {
    if (!parsedData) return;
    setErrorMessage(null);

    // Validation
    if (mode === "retail" && (!productMapping.name || !productMapping.price)) {
      setErrorMessage("Lütfen 'Ürün Adı' ve 'Fiyat' kolonlarını eşleştiriniz.");
      return;
    }
    if (mode === "supply" && !supplyMapping.name) {
      setErrorMessage("Lütfen en az 'Ürün Adı' kolonunu eşleştiriniz.");
      return;
    }

    startTransition(async () => {
      if (mode === "retail") {
        const productsToImport = parsedData.rows
          .map((row) => {
            const name = parseExcelString(row[productMapping.name]);
            const price = parseExcelPrice(row[productMapping.price]);
            if (!name || !price) return null;

            return {
              name,
              price,
              type: "BOTTLED_WATER" as const,
              depositAmount: productMapping.depositAmount
                ? parseExcelPrice(row[productMapping.depositAmount]) || "0"
                : "0",
              description: productMapping.description
                ? parseExcelString(row[productMapping.description]) || ""
                : "",
              imageUrl: productMapping.imageUrl
                ? parseExcelString(row[productMapping.imageUrl])
                : null,
              displayOrder: productMapping.displayOrder
                ? parseExcelNumber(row[productMapping.displayOrder], 0)
                : 0,
            };
          })
          .filter((p): p is NonNullable<typeof p> => p !== null);

        if (productsToImport.length === 0) {
          setErrorMessage(
            "Eşleştirilen kolonlarda geçerli ada ve fiyata sahip ürün bulunamadı."
          );
          return;
        }

        const res = await bulkImportProductsAction({
          products: productsToImport,
        });
        if (!res.success) {
          setErrorMessage(
            res.error.message || "İçe aktarma sırasında bir hata oluştu."
          );
          return;
        }

        setImportSummary(res.data);
        setStep(3);
        onSuccess?.();
      } else {
        // Mode === "supply"
        const productsToImport = parsedData.rows
          .map((row) => {
            const name = parseExcelString(row[supplyMapping.name]);
            if (!name) return null;

            return {
              name,
              categoryName: supplyMapping.category
                ? parseExcelString(row[supplyMapping.category])
                : null,
              unit: supplyMapping.unit
                ? parseExcelString(row[supplyMapping.unit])
                : null,
              price: supplyMapping.price
                ? parseExcelPrice(row[supplyMapping.price])
                : null,
              description: supplyMapping.description
                ? parseExcelString(row[supplyMapping.description])
                : null,
              imageUrl: supplyMapping.imageUrl
                ? parseExcelString(row[supplyMapping.imageUrl])
                : null,
              displayOrder: supplyMapping.displayOrder
                ? parseExcelNumber(row[supplyMapping.displayOrder], 0)
                : 0,
            };
          })
          .filter((p): p is NonNullable<typeof p> => p !== null);

        if (productsToImport.length === 0) {
          setErrorMessage(
            "Eşleştirilen kolonlarda geçerli ada sahip ürün bulunamadı."
          );
          return;
        }

        const res = await bulkImportSupplyProductsAction({
          fallbackCategoryId: fallbackCategoryId || null,
          products: productsToImport,
        });

        if (!res.success) {
          setErrorMessage(
            res.error.message || "İçe aktarma sırasında bir hata oluştu."
          );
          return;
        }

        setImportSummary(res.data);
        setStep(3);
        onSuccess?.();
      }
    });
  };

  const resetModal = () => {
    setStep(1);
    setParsedData(null);
    setFileName("");
    setImportSummary(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === "retail"
                ? "Perakende Su Ürünleri"
                : "Kurumsal Tedarik Ürünleri"}{" "}
              — Excel ile Toplu İçe Aktar
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1 && "Adım 1/3: Excel veya CSV tablonuzu seçin"}
              {step === 2 && "Adım 2/3: Kolonları eşleştirin ve önizleyin"}
              {step === 3 && "Adım 3/3: İçe aktarma tamamlandı"}
            </p>
          </div>
          <button
            type="button"
            onClick={resetModal}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors"
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl flex items-center gap-2">
              <svg
                className="w-5 h-5 text-rose-600 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: File Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center transition-colors bg-slate-50/50">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Excel veya CSV Dosyası Yükleyin
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                  Tablonuzu değiştirmeden yükleyin (.xlsx, .xls, .csv).
                  Kolonları bir sonraki adımda dilediğiniz gibi
                  eşleştirebilirsiniz.
                </p>
                <label className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm cursor-pointer shadow-sm transition-all hover:shadow-md">
                  <span>Dosya Seç</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                <p className="font-semibold">💡 Akıllı Eşleştirme Özelliği:</p>
                <p>
                  Mevcut Excel tablonuzdaki başlıklar otomatik algılanacaktır.
                  Aynı isimli ürünler varsa fiyat ve bilgileri güncellenir, yeni
                  olanlar sisteme eklenir.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Column Mapping & Preview */}
          {step === 2 && parsedData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-100/80 p-3 rounded-xl">
                <span>
                  Yüklenen Dosya: <strong>{fileName}</strong>
                </span>
                <span>
                  Toplam Satır: <strong>{parsedData.rows.length}</strong>
                </span>
              </div>

              {/* Mapping Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mode === "retail" ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Ürün Adı <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={productMapping.name}
                        onChange={(e) =>
                          setProductMapping({
                            ...productMapping,
                            name: e.target.value,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">-- Kolon Seçiniz --</option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Fiyat (TL) <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={productMapping.price}
                        onChange={(e) =>
                          setProductMapping({
                            ...productMapping,
                            price: e.target.value,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">-- Kolon Seçiniz --</option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Depozito Tutarı (Opsiyonel)
                      </label>
                      <select
                        value={productMapping.depositAmount || ""}
                        onChange={(e) =>
                          setProductMapping({
                            ...productMapping,
                            depositAmount: e.target.value || undefined,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">-- Eşleme Yok --</option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Açıklama (Opsiyonel)
                      </label>
                      <select
                        value={productMapping.description || ""}
                        onChange={(e) =>
                          setProductMapping({
                            ...productMapping,
                            description: e.target.value || undefined,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">-- Eşleme Yok --</option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Ürün Adı <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={supplyMapping.name}
                        onChange={(e) =>
                          setSupplyMapping({
                            ...supplyMapping,
                            name: e.target.value,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">-- Kolon Seçiniz --</option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Kategori Kolonu (Opsiyonel)
                      </label>
                      <select
                        value={supplyMapping.category || ""}
                        onChange={(e) =>
                          setSupplyMapping({
                            ...supplyMapping,
                            category: e.target.value || undefined,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">
                          -- Kolondan Oku (Yoksa Alttakini Kullan) --
                        </option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    {categories.length > 0 && (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Sabit Kategori (Kolon Yoksa)
                        </label>
                        <select
                          value={fallbackCategoryId}
                          onChange={(e) =>
                            setFallbackCategoryId(e.target.value)
                          }
                          className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                        >
                          <option value="">-- Varsayılan (Genel) --</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Birim/Ambalaj (Opsiyonel)
                      </label>
                      <select
                        value={supplyMapping.unit || ""}
                        onChange={(e) =>
                          setSupplyMapping({
                            ...supplyMapping,
                            unit: e.target.value || undefined,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">-- Eşleme Yok --</option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Fiyat (Opsiyonel - Boşsa Teklif Alınız)
                      </label>
                      <select
                        value={supplyMapping.price || ""}
                        onChange={(e) =>
                          setSupplyMapping({
                            ...supplyMapping,
                            price: e.target.value || undefined,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">-- Eşleme Yok --</option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Açıklama (Opsiyonel)
                      </label>
                      <select
                        value={supplyMapping.description || ""}
                        onChange={(e) =>
                          setSupplyMapping({
                            ...supplyMapping,
                            description: e.target.value || undefined,
                          })
                        }
                        className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-white"
                      >
                        <option value="">-- Eşleme Yok --</option>
                        {parsedData.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Preview Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  İlk 5 Satır Canlı Önizleme:
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-2.5">Ürün Adı</th>
                        {mode === "retail" ? (
                          <>
                            <th className="p-2.5">Fiyat</th>
                            <th className="p-2.5">Depozito</th>
                          </>
                        ) : (
                          <>
                            <th className="p-2.5">Kategori</th>
                            <th className="p-2.5">Birim</th>
                            <th className="p-2.5">Fiyat</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.rows.slice(0, 5).map((row, idx) => {
                        const nameKey =
                          mode === "retail"
                            ? productMapping.name
                            : supplyMapping.name;
                        const priceKey =
                          mode === "retail"
                            ? productMapping.price
                            : supplyMapping.price;

                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-medium text-slate-900">
                              {nameKey && row[nameKey] ? (
                                String(row[nameKey])
                              ) : (
                                <span className="text-slate-400 italic">
                                  Eşleşmedi
                                </span>
                              )}
                            </td>
                            {mode === "retail" ? (
                              <>
                                <td className="p-2.5 text-slate-700">
                                  {priceKey && row[priceKey]
                                    ? `${parseExcelPrice(row[priceKey]) || "-"} TL`
                                    : "-"}
                                </td>
                                <td className="p-2.5 text-slate-500">
                                  {productMapping.depositAmount &&
                                  row[productMapping.depositAmount]
                                    ? `${parseExcelPrice(row[productMapping.depositAmount]) || "0"} TL`
                                    : "0 TL"}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="p-2.5 text-slate-700">
                                  {supplyMapping.category &&
                                  row[supplyMapping.category]
                                    ? String(row[supplyMapping.category])
                                    : fallbackCategoryId
                                      ? "Seçili Kategori"
                                      : "Genel"}
                                </td>
                                <td className="p-2.5 text-slate-500">
                                  {supplyMapping.unit && row[supplyMapping.unit]
                                    ? String(row[supplyMapping.unit])
                                    : "-"}
                                </td>
                                <td className="p-2.5 text-slate-700">
                                  {priceKey && row[priceKey]
                                    ? `${parseExcelPrice(row[priceKey]) || "-"} TL`
                                    : "Teklif Alınız"}
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Summary / Success */}
          {step === 3 && importSummary && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  İçe Aktarma Başarıyla Tamamlandı!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Excel tablonuzdaki ürünler veritabanına aktarıldı.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-xl font-bold text-slate-900">
                    {importSummary.totalProcessed}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Toplam İşlenen
                  </div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <div className="text-xl font-bold text-emerald-700">
                    {importSummary.createdCount}
                  </div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    Yeni Eklenen
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <div className="text-xl font-bold text-blue-700">
                    {importSummary.updatedCount}
                  </div>
                  <div className="text-xs text-blue-600 mt-0.5">
                    Güncellenen
                  </div>
                </div>
              </div>

              {importSummary.errors.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-800 space-y-1">
                  <p className="font-semibold">
                    Bazı satırlarda uyarılar oluştu:
                  </p>
                  <ul className="list-disc list-inside">
                    {importSummary.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          {step === 1 && (
            <div className="flex w-full justify-end">
              <button
                type="button"
                onClick={resetModal}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                Vazgeç
              </button>
            </div>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isPending}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50"
              >
                Geri Dön
              </button>
              <button
                type="button"
                onClick={handleStartImport}
                disabled={isPending}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    <span>İçe Aktarılıyor...</span>
                  </>
                ) : (
                  <span>Onayla ve İçe Aktar</span>
                )}
              </button>
            </>
          )}

          {step === 3 && (
            <div className="flex w-full justify-end">
              <button
                type="button"
                onClick={resetModal}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all"
              >
                Tamamla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
