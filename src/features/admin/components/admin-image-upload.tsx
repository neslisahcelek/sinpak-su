"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { compressImage, formatFileSize } from "@/lib/image-compressor";
import { uploadProductImageAction } from "@/features/admin/actions";

interface AdminImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  error?: string;
}

export function AdminImageUpload({
  value,
  onChange,
  disabled = false,
  error,
}: AdminImageUploadProps) {
  const [isPending, startTransition] = useTransition();
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [savingsMessage, setSavingsMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasImage = Boolean(value && value.trim().length > 0);
  const isLoading = isCompressing || isPending;

  const handleFileProcessAndUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Görsel boyutu en fazla 5 MB olabilir.");
      return;
    }

    setUploadError(null);
    setSavingsMessage(null);
    setStatusMessage("Görsel optimize ediliyor...");
    setIsCompressing(true);

    try {
      // 1. Client-side compression to WebP (keeps file sizes ~50-120KB)
      const { file: compressedFile, originalSize, compressedSize } =
        await compressImage(file, {
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.82,
          targetMimeType: "image/webp",
        });

      const savingsPercent = Math.round(
        (1 - compressedSize / originalSize) * 100
      );
      if (savingsPercent > 0) {
        setSavingsMessage(
          `${formatFileSize(originalSize)} ➔ ${formatFileSize(compressedSize)} (%${savingsPercent} tasarruf)`
        );
      }

      setStatusMessage("Supabase Storage'a yükleniyor...");

      // 2. Upload via Server Action
      startTransition(async () => {
        const formData = new FormData();
        formData.append("file", compressedFile);

        const result = await uploadProductImageAction(formData);

        if (!result.success) {
          setUploadError(
            result.error.message || "Görsel yüklenirken bir sorun oluştu."
          );
          setStatusMessage(null);
          setIsCompressing(false);
          return;
        }

        onChange(result.data.url);
        setStatusMessage(null);
        setIsCompressing(false);
        setPreviewError(false);
      });
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(
        err instanceof Error
          ? err.message
          : "Görsel işlenirken beklenmeyen bir hata oluştu."
      );
      setStatusMessage(null);
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled || isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcessAndUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isLoading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileProcessAndUpload(file);
    }
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled && !isLoading) {
        fileInputRef.current?.click();
      }
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    setSavingsMessage(null);
    setUploadError(null);
    setStatusMessage(null);
    setPreviewError(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-900">
          Ürün Görseli
        </label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-1 rounded transition-colors ${
              mode === "upload"
                ? "bg-sky-100 text-sky-800 font-medium"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Dosya Yükle
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-1 rounded transition-colors ${
              mode === "url"
                ? "bg-sky-100 text-sky-800 font-medium"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Doğrudan URL Gir
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="space-y-3">
          {hasImage ? (
            /* Image Preview Card */
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                  {!previewError ? (
                    <Image
                      src={value}
                      alt="Ürün görseli"
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="64px"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 text-center px-1">
                      Önizleme Yok
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    Görsel Yüklendi
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                    {value}
                  </p>
                  {savingsMessage && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      ✓ {savingsMessage}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  disabled={disabled || isLoading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  Değiştir
                </button>
                <button
                  type="button"
                  disabled={disabled || isLoading}
                  onClick={handleRemoveImage}
                  className="px-2.5 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Kaldır
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Area */
            <div
              role="button"
              tabIndex={disabled || isLoading ? -1 : 0}
              aria-label="Ürün görseli seçmek için tıklayın veya görseli buraya sürükleyin"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onKeyDown={handleKeyDown}
              onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isDragOver
                  ? "border-sky-500 bg-sky-50/70"
                  : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
              } ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-sky-600 hover:text-sky-700">
                    Dosya seçmek için tıklayın
                  </span>{" "}
                  veya görseli buraya sürükleyip bırakın
                </div>
                <p className="text-[11px] text-slate-400">
                  Maks. 5 MB (PNG, JPG, WebP veya AVIF). Tarayıcıda otomatik WebP formatında optimize edilir.
                </p>
              </div>

              {/* Status / Loading Overlay */}
              {isLoading && statusMessage && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-xs rounded-xl flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
                    <svg
                      className="animate-spin h-4 w-4 text-sky-600"
                      xmlns="http://www.w3.org/2000/svg"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{statusMessage}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isLoading}
          />
        </div>
      ) : (
        /* Manual URL input fallback */
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setPreviewError(false);
              }}
              disabled={disabled || isLoading}
              placeholder="https://... veya /images/urun.png"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1">
              HTTP/HTTPS veya yerel statik yol (/images/...) desteklenir.
            </p>
          </div>

          {/* Preview Box */}
          <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
            {hasImage && !previewError ? (
              <Image
                src={value}
                alt="Önizleme"
                fill
                unoptimized
                className="object-cover"
                sizes="64px"
                onError={() => setPreviewError(true)}
              />
            ) : (
              <span className="text-[10px] text-slate-400 text-center px-1">
                {hasImage ? "Geçersiz" : "Görsel Yok"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error messages */}
      {(uploadError || error) && (
        <p className="text-xs text-red-600">
          {uploadError || error}
        </p>
      )}
    </div>
  );
}
