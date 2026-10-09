import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import {
  parseExcelPrice,
  parseExcelNumber,
  parseExcelString,
  autoDetectProductColumns,
  autoDetectSupplyColumns,
  parseExcelBuffer,
} from "./excel-parser";

describe("excel-parser", () => {
  describe("parseExcelPrice", () => {
    it("parses numbers correctly", () => {
      expect(parseExcelPrice(150)).toBe("150.00");
      expect(parseExcelPrice(150.5)).toBe("150.50");
      expect(parseExcelPrice(0)).toBeNull();
      expect(parseExcelPrice(-10)).toBeNull();
    });

    it("parses Turkish currency strings correctly", () => {
      expect(parseExcelPrice("150,50 TL")).toBe("150.50");
      expect(parseExcelPrice("1.250,00 ₺")).toBe("1250.00");
      expect(parseExcelPrice("75,00 tl")).toBe("75.00");
      expect(parseExcelPrice("45,50")).toBe("45.50");
      expect(parseExcelPrice("  250 TL  ")).toBe("250.00");
    });

    it("parses US style decimal strings correctly", () => {
      expect(parseExcelPrice("125.75")).toBe("125.75");
      expect(parseExcelPrice("1,250.50")).toBe("1250.50");
    });

    it("returns null for non-price or empty values", () => {
      expect(parseExcelPrice("Teklif Alınız")).toBeNull();
      expect(parseExcelPrice("")).toBeNull();
      expect(parseExcelPrice(null)).toBeNull();
      expect(parseExcelPrice(undefined)).toBeNull();
      expect(parseExcelPrice("ABC")).toBeNull();
    });
  });

  describe("parseExcelNumber & parseExcelString", () => {
    it("parses numbers and integers safely", () => {
      expect(parseExcelNumber(5)).toBe(5);
      expect(parseExcelNumber("12")).toBe(12);
      expect(parseExcelNumber("sıra 3")).toBe(3);
      expect(parseExcelNumber("", 0)).toBe(0);
    });

    it("parses and trims strings", () => {
      expect(parseExcelString("  Damacana Su  ")).toBe("Damacana Su");
      expect(parseExcelString("   ")).toBeNull();
      expect(parseExcelString(null)).toBeNull();
    });
  });

  describe("autoDetectColumns", () => {
    it("detects product column mappings from Turkish headers", () => {
      const headers = [
        "Ürün Adı",
        "KDV Dahil Fiyat",
        "Ürün Türü",
        "Depozito",
        "Açıklama",
      ];
      const mapping = autoDetectProductColumns(headers);

      expect(mapping.name).toBe("Ürün Adı");
      expect(mapping.price).toBe("KDV Dahil Fiyat");
      expect(mapping.type).toBe("Ürün Türü");
      expect(mapping.depositAmount).toBe("Depozito");
      expect(mapping.description).toBe("Açıklama");
    });

    it("detects supply column mappings from Turkish headers", () => {
      const headers = [
        "Stok Adı",
        "Kategori Adı",
        "Birim/Ambalaj",
        "Fiyatı",
        "Detay",
      ];
      const mapping = autoDetectSupplyColumns(headers);

      expect(mapping.name).toBe("Stok Adı");
      expect(mapping.category).toBe("Kategori Adı");
      expect(mapping.unit).toBe("Birim/Ambalaj");
      expect(mapping.price).toBe("Fiyatı");
      expect(mapping.description).toBe("Detay");
    });
  });

  describe("parseExcelBuffer", () => {
    it("parses an XLSX workbook buffer accurately", () => {
      // Create a test workbook with SheetJS
      const wb = XLSX.utils.book_new();
      const wsData = [
        ["Ürün İsmi", "Birim Fiyat", "Koli İçi Adet"],
        ["Erikli 0.5L Su", 120, "24 Adet"],
        ["Sırma Soda 200ml", "150,50 TL", "24 Adet"],
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "Ürünler");

      const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const parsed = parseExcelBuffer(buffer);

      expect(parsed.sheetNames).toEqual(["Ürünler"]);
      expect(parsed.activeSheet).toBe("Ürünler");
      expect(parsed.headers).toEqual([
        "Ürün İsmi",
        "Birim Fiyat",
        "Koli İçi Adet",
      ]);
      expect(parsed.rows.length).toBe(2);
      expect(parsed.rows[0]["Ürün İsmi"]).toBe("Erikli 0.5L Su");
      expect(parsed.rows[0]["Birim Fiyat"]).toBe(120);
      expect(parsed.rows[1]["Birim Fiyat"]).toBe("150,50 TL");
    });
  });
});
