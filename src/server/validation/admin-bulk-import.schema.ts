import { z } from "zod";
import {
  optionalSupplyPriceSchema,
  supplyImageUrlSchema,
} from "./admin-supply.schema";

const priceRegex = /^\d+(\.\d{1,2})?$/;

// ==========================================
// RETAIL WATER PRODUCTS SCHEMAS
// ==========================================

export const bulkImportProductItemSchema = z.object({
  name: z
    .string({ error: "Ürün adı gereklidir." })
    .trim()
    .min(2, "Ürün adı en az 2 karakter olmalıdır.")
    .max(100, "Ürün adı en fazla 100 karakter olabilir."),
  price: z
    .string({ error: "Geçerli bir fiyat gereklidir." })
    .trim()
    .refine((val) => priceRegex.test(val) && parseFloat(val) > 0, {
      message: "Fiyat 0'dan büyük geçerli bir sayı olmalıdır.",
    }),
  type: z
    .enum(["DAMACANA_WATER", "BOTTLED_WATER", "BEVERAGE"])
    .default("BOTTLED_WATER"),
  depositAmount: z
    .string()
    .trim()
    .refine((val) => priceRegex.test(val) && parseFloat(val) >= 0, {
      message: "Depozito bedeli 0 veya pozitif bir sayı olmalıdır.",
    })
    .default("0"),
  description: z
    .string()
    .trim()
    .max(1000, "Açıklama en fazla 1000 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : "")),
  imageUrl: z
    .string()
    .trim()
    .max(2048, "Görsel URL'si en fazla 2048 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  displayOrder: z.number().int().min(0).default(0),
});

export const bulkImportProductsInputSchema = z.object({
  products: z
    .array(bulkImportProductItemSchema)
    .min(1, "En az bir ürün yüklenmelidir.")
    .max(1000, "Tek seferde en fazla 1000 ürün yüklenebilir."),
});

export type BulkImportProductItem = z.infer<typeof bulkImportProductItemSchema>;
export type BulkImportProductsInput = z.infer<
  typeof bulkImportProductsInputSchema
>;

// ==========================================
// INSTITUTIONAL SUPPLY PRODUCTS SCHEMAS
// ==========================================

export const bulkImportSupplyItemSchema = z.object({
  name: z
    .string({ error: "Ürün adı gereklidir." })
    .trim()
    .min(2, "Ürün adı en az 2 karakter olmalıdır.")
    .max(150, "Ürün adı en fazla 150 karakter olabilir."),
  categoryName: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  unit: z
    .string()
    .trim()
    .max(60, "Birim en fazla 60 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  price: optionalSupplyPriceSchema,
  description: z
    .string()
    .trim()
    .max(1000, "Açıklama en fazla 1000 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  imageUrl: supplyImageUrlSchema,
  displayOrder: z.number().int().min(0).default(0),
});

export const bulkImportSupplyProductsInputSchema = z.object({
  fallbackCategoryId: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null))
    .default(null),
  products: z
    .array(bulkImportSupplyItemSchema)
    .min(1, "En az bir ürün yüklenmelidir.")
    .max(1000, "Tek seferde en fazla 1000 ürün yüklenebilir."),
});

export type BulkImportSupplyItem = z.infer<typeof bulkImportSupplyItemSchema>;
export type BulkImportSupplyProductsInput = z.input<
  typeof bulkImportSupplyProductsInputSchema
>;
export type ValidatedBulkImportSupplyProductsInput = z.output<
  typeof bulkImportSupplyProductsInputSchema
>;
