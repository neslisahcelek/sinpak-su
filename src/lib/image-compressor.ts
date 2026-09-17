export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetMimeType?: "image/webp" | "image/jpeg";
}

/**
 * Compresses and resizes an image in the browser using the HTML5 Canvas API.
 * Converts images to WebP to achieve 80-95% file size reduction, keeping
 * storage and bandwidth well within free tier limits.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<{ file: File; originalSize: number; compressedSize: number }> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.82,
    targetMimeType = "image/webp",
  } = options;

  // Verify file is an image
  if (!file.type.startsWith("image/")) {
    throw new Error("Lütfen geçerli bir görsel dosyası seçin.");
  }

  // Load image object
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () =>
        reject(new Error("Görsel yüklenirken bir hata oluştu."));
      image.src = objectUrl;
    });

    // Calculate dimensions maintaining aspect ratio
    let { width, height } = img;
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Görsel işleme bağlamı (canvas) oluşturulamadı.");
    }

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to target mime type
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), targetMimeType, quality);
    });

    if (!blob) {
      throw new Error("Görsel sıkıştırma başarısız oldu.");
    }

    // Determine output extension and name
    const extension = targetMimeType === "image/webp" ? "webp" : "jpg";
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const compressedFileName = `${baseName}.${extension}`;

    const compressedFile = new File([blob], compressedFileName, {
      type: targetMimeType,
      lastModified: Date.now(),
    });

    return {
      file: compressedFile,
      originalSize: file.size,
      compressedSize: compressedFile.size,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Human-readable file size formatter.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
