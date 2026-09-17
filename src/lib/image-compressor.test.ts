import { describe, it, expect } from "vitest";
import { formatFileSize, compressImage } from "./image-compressor";

describe("Image Compressor Helpers", () => {
  it("formats file sizes correctly in bytes, KB, and MB", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(150 * 1024)).toBe("150.0 KB");
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });

  it("rejects non-image files with a user-friendly error", async () => {
    const textFile = new File(["not an image"], "document.pdf", {
      type: "application/pdf",
    });

    await expect(compressImage(textFile)).rejects.toThrow(
      "Lütfen geçerli bir görsel dosyası seçin."
    );
  });
});
