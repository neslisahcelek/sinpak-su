import { describe, it, expect, beforeEach } from "vitest";
import {
  validateImageMagicBytes,
  uploadProductImage,
} from "./supabase-storage";

describe("Supabase Storage Utilities", () => {
  describe("validateImageMagicBytes", () => {
    it("validates PNG magic bytes correctly", () => {
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      ]);
      expect(validateImageMagicBytes(pngBuffer, "image/png")).toBe(true);
      expect(validateImageMagicBytes(pngBuffer, "image/jpeg")).toBe(false);
    });

    it("validates JPEG magic bytes correctly", () => {
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      ]);
      expect(validateImageMagicBytes(jpegBuffer, "image/jpeg")).toBe(true);
      expect(validateImageMagicBytes(jpegBuffer, "image/png")).toBe(false);
    });

    it("validates WebP magic bytes correctly", () => {
      // RIFF (4 bytes) + file size (4 bytes) + WEBP (4 bytes)
      const webpBuffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46, 0x20, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
      ]);
      expect(validateImageMagicBytes(webpBuffer, "image/webp")).toBe(true);
      expect(validateImageMagicBytes(webpBuffer, "image/jpeg")).toBe(false);
    });

    it("validates GIF magic bytes correctly", () => {
      const gifBuffer = Buffer.from("GIF89a\x01\x00\x01\x00\x80\x00", "binary");
      expect(validateImageMagicBytes(gifBuffer, "image/gif")).toBe(true);
      expect(validateImageMagicBytes(gifBuffer, "image/png")).toBe(false);
    });

    it("rejects corrupted or too short buffers", () => {
      const shortBuffer = Buffer.from([0x89, 0x50]);
      expect(validateImageMagicBytes(shortBuffer, "image/png")).toBe(false);

      const invalidBuffer = Buffer.from(new Array(16).fill(0));
      expect(validateImageMagicBytes(invalidBuffer, "image/webp")).toBe(false);
      expect(validateImageMagicBytes(invalidBuffer, "image/jpeg")).toBe(false);
    });
  });

  describe("uploadProductImage", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    });

    it("rejects unsupported MIME types before upload", async () => {
      const textBuffer = Buffer.from("Not an image");
      await expect(
        uploadProductImage(textBuffer, "application/pdf")
      ).rejects.toThrow("Desteklenmeyen dosya türü");
    });

    it("rejects mismatched magic bytes before calling Supabase", async () => {
      const fakeWebpBuffer = Buffer.from("Not really a webp file at all");
      await expect(
        uploadProductImage(fakeWebpBuffer, "image/webp")
      ).rejects.toThrow("Dosya içeriği bildirilen görsel biçimi ile uyuşmuyor");
    });
  });
});
