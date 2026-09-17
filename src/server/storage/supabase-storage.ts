import crypto from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_BUCKET = "product-images";

const ALLOWED_MIME_TYPES = new Set([
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/avif",
  "image/gif",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
  "image/gif": "gif",
};

/**
 * Verifies that the file buffer matches the declared image MIME type by inspecting magic bytes.
 */
export function validateImageMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) {
    return false;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // WebP: RIFF at 0..3 and WEBP at 8..11
  if (mimeType === "image/webp") {
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  // GIF: GIF87a or GIF89a
  if (mimeType === "image/gif") {
    const header = buffer.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }

  // AVIF: ftyp at 4..7 and avif/avis/mif1 at 8..11
  if (mimeType === "image/avif") {
    const ftyp = buffer.subarray(4, 8).toString("ascii");
    const brand = buffer.subarray(8, 12).toString("ascii");
    return (
      ftyp === "ftyp" &&
      (brand === "avif" || brand === "avis" || brand === "mif1")
    );
  }

  return false;
}

/**
 * Returns a server-side Supabase client initialized with the secret service role key.
 * Never uses the public anon key for administrative storage operations.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (() => {
      const dbUrl = process.env.DATABASE_URL || "";
      const match = dbUrl.match(/postgres\.([^:]+):/);
      if (match && match[1]) {
        return `https://${match[1]}.supabase.co`;
      }
      return "";
    })();

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ortam değişkeni tanımlanmamış."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ortam değişkeni eksik. Depolama işlemleri için service role yetkisi gereklidir."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export interface UploadImageResult {
  url: string;
  path: string;
  size: number;
}

/**
 * Uploads a product image buffer directly to Supabase Storage with maximum CDN caching
 * after strictly validating its magic bytes.
 */
export async function uploadProductImage(
  buffer: Buffer,
  mimeType: string,
  preferredFileName?: string
): Promise<UploadImageResult> {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(
      `Desteklenmeyen dosya türü: ${mimeType}. Sadece WebP, JPEG, PNG, GIF veya AVIF kabul edilir.`
    );
  }

  if (!validateImageMagicBytes(buffer, mimeType)) {
    throw new Error(
      "Dosya içeriği bildirilen görsel biçimi ile uyuşmuyor (geçersiz dosya imzası)."
    );
  }

  const supabase = getSupabaseAdminClient();
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;

  const ext = MIME_TO_EXT[mimeType] || "webp";
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const sanitizedName = preferredFileName
    ? preferredFileName
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .slice(0, 30)
    : "product";
  const filePath = `products/${sanitizedName}-${Date.now()}-${uniqueId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType: mimeType,
      cacheControl: "31536000, public, immutable",
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase Storage Upload Error:", uploadError);
    throw new Error(
      `Görsel Supabase Storage'a yüklenemedi: ${uploadError.message}`
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Görselin genel URL'i (public URL) alınamadı.");
  }

  return {
    url: publicUrlData.publicUrl,
    path: filePath,
    size: buffer.length,
  };
}
