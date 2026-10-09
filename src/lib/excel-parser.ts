import * as XLSX from "xlsx";

export interface ParsedExcelData {
  sheetNames: string[];
  activeSheet: string;
  headers: string[];
  rows: Record<string, unknown>[];
}

export interface ProductColumnMapping {
  name: string; // Required
  price: string; // Required
  type?: string; // Optional: DAMACANA_WATER, BOTTLED_WATER, BEVERAGE
  depositAmount?: string; // Optional
  description?: string; // Optional
  imageUrl?: string; // Optional
  displayOrder?: string; // Optional
}

export interface SupplyColumnMapping {
  name: string; // Required
  category?: string; // Optional (column with category name)
  unit?: string; // Optional (e.g. "Koli 24'lü", "Paket")
  price?: string; // Optional (empty or "Teklif Alınız" is null)
  description?: string; // Optional
  imageUrl?: string; // Optional
  displayOrder?: string; // Optional
}

/**
 * Parses numeric price value from Turkish and International Excel notations.
 * Examples:
 * - 125 -> "125.00"
 * - "125,50 TL" -> "125.50"
 * - "1.250,50 ₺" -> "1250.50"
 * - "125.50" -> "125.50"
 * - "Teklif Alınız" -> null
 */
export function parseExcelPrice(val: unknown): string | null {
  if (val === undefined || val === null) {
    return null;
  }

  if (typeof val === "number") {
    if (isNaN(val) || val <= 0) return null;
    return val.toFixed(2);
  }

  const str = String(val).trim();
  if (!str) return null;

  // Clean currency symbols, letters, and extra spaces
  // Keep only digits, periods, and commas
  const cleaned = str
    .replace(/[₺$€TLtl]/gi, "")
    .replace(/\s+/g, "")
    .trim();

  if (!cleaned || /^[^\d]+$/.test(cleaned)) {
    return null;
  }

  let normalized = cleaned;

  // Turkish notation: "1.250,50" -> remove thousands dot, replace comma with dot
  if (normalized.includes(",") && normalized.includes(".")) {
    const lastComma = normalized.lastIndexOf(",");
    const lastDot = normalized.lastIndexOf(".");
    if (lastComma > lastDot) {
      // European / Turkish: 1.250,50
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else {
      // US style: 1,250.50
      normalized = normalized.replace(/,/g, "");
    }
  } else if (normalized.includes(",")) {
    // Only comma: "125,50" -> "125.50"
    normalized = normalized.replace(",", ".");
  }

  const num = parseFloat(normalized);
  if (isNaN(num) || num <= 0 || num > 1000000) {
    return null;
  }

  return num.toFixed(2);
}

/**
 * Parses integer values (e.g. display order, quantities).
 */
export function parseExcelNumber(val: unknown, fallback: number = 0): number {
  if (typeof val === "number") {
    return isNaN(val) ? fallback : Math.round(val);
  }
  if (!val) return fallback;
  const parsed = parseInt(String(val).replace(/\D/g, ""), 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Parses string text, trimming and sanitizing empty strings to null.
 */
export function parseExcelString(val: unknown): string | null {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  return str.length > 0 ? str : null;
}

/**
 * Reads an ArrayBuffer or File and returns the extracted headers and raw rows.
 */
export function parseExcelBuffer(
  buffer: ArrayBuffer,
  sheetName?: string
): ParsedExcelData {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    throw new Error("Excel dosyasında çalışma sayfası bulunamadı.");
  }

  const activeSheet =
    sheetName && sheetNames.includes(sheetName) ? sheetName : sheetNames[0];
  const worksheet = workbook.Sheets[activeSheet];

  // Convert to array of arrays first to extract clean headers from the first row
  const rawData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (!rawData || rawData.length === 0) {
    return { sheetNames, activeSheet, headers: [], rows: [] };
  }

  // Row 0 is the headers
  const headerRow = rawData[0] || [];
  const headers = headerRow
    .map((h, i) => (h ? String(h).trim() : `Kolon_${i + 1}`))
    .filter((h) => h.length > 0);

  // Subsequent rows are data
  const rows: Record<string, unknown>[] = [];
  for (let r = 1; r < rawData.length; r++) {
    const rowArray = rawData[r];
    if (!rowArray || rowArray.length === 0) continue;

    const rowObj: Record<string, unknown> = {};
    let hasContent = false;

    headers.forEach((header, colIdx) => {
      const cellVal = rowArray[colIdx];
      rowObj[header] = cellVal !== undefined ? cellVal : "";
      if (
        cellVal !== undefined &&
        cellVal !== null &&
        String(cellVal).trim() !== ""
      ) {
        hasContent = true;
      }
    });

    if (hasContent) {
      rows.push(rowObj);
    }
  }

  return {
    sheetNames,
    activeSheet,
    headers,
    rows,
  };
}

/**
 * Intelligent heuristics to auto-detect best matching column names.
 */
function findBestMatch(headers: string[], keywords: string[]): string {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  for (const header of headers) {
    const lowerHeader = header.toLowerCase();
    for (const kw of lowerKeywords) {
      if (lowerHeader.includes(kw)) {
        return header;
      }
    }
  }
  return "";
}

/**
 * Auto-detects column mappings for retail products.
 */
export function autoDetectProductColumns(
  headers: string[]
): ProductColumnMapping {
  return {
    name: findBestMatch(headers, [
      "ürün adı",
      "urun adi",
      "ürün",
      "urun",
      "ad",
      "isim",
      "name",
      "başlık",
    ]),
    price: findBestMatch(headers, [
      "fiyat",
      "ücret",
      "ucret",
      "price",
      "tutar",
      "bedel",
    ]),
    type: findBestMatch(headers, [
      "tip",
      "tür",
      "tur",
      "type",
      "çeşit",
      "cesit",
    ]),
    depositAmount: findBestMatch(headers, [
      "depozito",
      "şişe bedeli",
      "iade bedeli",
      "deposit",
    ]),
    description: findBestMatch(headers, [
      "açıklama",
      "aciklama",
      "detay",
      "özellik",
      "desc",
    ]),
    imageUrl: findBestMatch(headers, [
      "görsel",
      "gorsel",
      "resim",
      "foto",
      "image",
      "fotoğraf",
      "url",
    ]),
    displayOrder: findBestMatch(headers, [
      "sıra",
      "sira",
      "sıralama",
      "order",
      "index",
    ]),
  };
}

/**
 * Auto-detects column mappings for institutional supply products.
 */
export function autoDetectSupplyColumns(
  headers: string[]
): SupplyColumnMapping {
  return {
    name: findBestMatch(headers, [
      "ürün adı",
      "urun adi",
      "ürün",
      "urun",
      "ad",
      "isim",
      "stok adı",
      "name",
    ]),
    category: findBestMatch(headers, [
      "kategori",
      "category",
      "grup",
      "kategori adı",
      "bölüm",
    ]),
    unit: findBestMatch(headers, [
      "birim",
      "ambalaj",
      "paket",
      "koli",
      "ölçü",
      "unit",
    ]),
    price: findBestMatch(headers, [
      "fiyat",
      "ücret",
      "ucret",
      "price",
      "tutar",
    ]),
    description: findBestMatch(headers, [
      "açıklama",
      "aciklama",
      "detay",
      "özellik",
      "desc",
    ]),
    imageUrl: findBestMatch(headers, [
      "görsel",
      "gorsel",
      "resim",
      "foto",
      "image",
      "url",
    ]),
    displayOrder: findBestMatch(headers, [
      "sıra",
      "sira",
      "sıralama",
      "order",
      "index",
    ]),
  };
}
