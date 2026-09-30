import { z } from "zod";

const priceRegex = /^\d+(\.\d{1,2})?$/;

/**
 * Validates optional supply product price: if provided, must be strictly positive (> 0), max 2 decimal places, max 1,000,000 TL.
 * Empty string, null or undefined is mapped to null (representing "Teklif Alınız").
 */
export const optionalSupplyPriceSchema = z
  .union([z.string().trim(), z.number()])
  .optional()
  .nullable()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return null;
    return typeof val === "number" ? val.toString() : val;
  })
  .refine(
    (val) => {
      if (val === null) return true;
      return priceRegex.test(val);
    },
    {
      message:
        "Fiyat geçerli bir sayı olmalı ve en fazla 2 ondalık basamak içermelidir.",
    }
  )
  .refine(
    (val) => {
      if (val === null) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 1000000;
    },
    {
      message: "Fiyat 0'dan büyük ve en fazla 1.000.000 TL olmalıdır.",
    }
  );

/**
 * Validates optional supply product image URL.
 */
export const supplyImageUrlSchema = z
  .string()
  .trim()
  .max(2048, "Görsel URL'si en fazla 2048 karakter olabilir.")
  .optional()
  .nullable()
  .transform((val) => (val && val.length > 0 ? val : null))
  .refine(
    (val) => {
      if (val === null) return true;
      return (
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/")
      );
    },
    {
      message: "Görsel URL'si 'http://', 'https://' veya '/' ile başlamalıdır.",
    }
  );

// ==========================================
// CATEGORY SCHEMAS
// ==========================================

export const createSupplyCategorySchema = z.object({
  name: z
    .string({ error: "Kategori adı gereklidir." })
    .trim()
    .min(2, "Kategori adı en az 2 karakter olmalıdır.")
    .max(100, "Kategori adı en fazla 100 karakter olabilir."),
  description: z
    .string()
    .trim()
    .max(500, "Açıklama en fazla 500 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  displayOrder: z.coerce
    .number({ error: "Sıra numarası geçerli bir sayı olmalıdır." })
    .int("Sıra numarası bir tam sayı olmalıdır.")
    .min(0, "Sıra numarası 0 veya daha büyük olmalıdır.")
    .default(0),
  isActive: z.boolean().default(true),
});

export type CreateSupplyCategoryInput = z.input<
  typeof createSupplyCategorySchema
>;
export type ValidatedCreateSupplyCategoryInput = z.output<
  typeof createSupplyCategorySchema
>;

export const updateSupplyCategorySchema = z.object({
  id: z.string().trim().min(1, "Kategori kimliği gereklidir."),
  name: z
    .string({ error: "Kategori adı gereklidir." })
    .trim()
    .min(2, "Kategori adı en az 2 karakter olmalıdır.")
    .max(100, "Kategori adı en fazla 100 karakter olabilir."),
  description: z
    .string()
    .trim()
    .max(500, "Açıklama en fazla 500 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  displayOrder: z.coerce
    .number({ error: "Sıra numarası geçerli bir sayı olmalıdır." })
    .int("Sıra numarası bir tam sayı olmalıdır.")
    .min(0, "Sıra numarası 0 veya daha büyük olmalıdır.")
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateSupplyCategoryInput = z.input<
  typeof updateSupplyCategorySchema
>;
export type ValidatedUpdateSupplyCategoryInput = z.output<
  typeof updateSupplyCategorySchema
>;

export const toggleSupplyCategoryActiveSchema = z.object({
  id: z.string().trim().min(1, "Kategori kimliği gereklidir."),
  isActive: z.boolean({ error: "Durum bilgisi gereklidir." }),
});

export type ToggleSupplyCategoryActiveInput = z.infer<
  typeof toggleSupplyCategoryActiveSchema
>;

export const deleteSupplyCategorySchema = z.object({
  id: z.string().trim().min(1, "Kategori kimliği gereklidir."),
});

export type DeleteSupplyCategoryInput = z.infer<
  typeof deleteSupplyCategorySchema
>;

// ==========================================
// PRODUCT SCHEMAS
// ==========================================

export const createSupplyProductSchema = z.object({
  categoryId: z.string().trim().min(1, "Kategori seçimi zorunludur."),
  name: z
    .string({ error: "Ürün adı gereklidir." })
    .trim()
    .min(2, "Ürün adı en az 2 karakter olmalıdır.")
    .max(150, "Ürün adı en fazla 150 karakter olabilir."),
  description: z
    .string()
    .trim()
    .max(1000, "Ürün açıklaması en fazla 1000 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  unit: z
    .string()
    .trim()
    .max(60, "Birim/Ambalaj bilgisi en fazla 60 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  price: optionalSupplyPriceSchema,
  displayOrder: z.coerce
    .number({ error: "Sıra numarası geçerli bir sayı olmalıdır." })
    .int("Sıra numarası bir tam sayı olmalıdır.")
    .min(0, "Sıra numarası 0 veya daha büyük olmalıdır.")
    .default(0),
  imageUrl: supplyImageUrlSchema,
  isActive: z.boolean().default(true),
});

export type CreateSupplyProductInput = z.input<
  typeof createSupplyProductSchema
>;
export type ValidatedCreateSupplyProductInput = z.output<
  typeof createSupplyProductSchema
>;

export const updateSupplyProductSchema = z.object({
  id: z.string().trim().min(1, "Ürün kimliği gereklidir."),
  categoryId: z.string().trim().min(1, "Kategori seçimi zorunludur."),
  name: z
    .string({ error: "Ürün adı gereklidir." })
    .trim()
    .min(2, "Ürün adı en az 2 karakter olmalıdır.")
    .max(150, "Ürün adı en fazla 150 karakter olabilir."),
  description: z
    .string()
    .trim()
    .max(1000, "Ürün açıklaması en fazla 1000 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  unit: z
    .string()
    .trim()
    .max(60, "Birim/Ambalaj bilgisi en fazla 60 karakter olabilir.")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  price: optionalSupplyPriceSchema,
  displayOrder: z.coerce
    .number({ error: "Sıra numarası geçerli bir sayı olmalıdır." })
    .int("Sıra numarası bir tam sayı olmalıdır.")
    .min(0, "Sıra numarası 0 veya daha büyük olmalıdır.")
    .optional(),
  imageUrl: supplyImageUrlSchema,
  isActive: z.boolean().optional(),
});

export type UpdateSupplyProductInput = z.input<
  typeof updateSupplyProductSchema
>;
export type ValidatedUpdateSupplyProductInput = z.output<
  typeof updateSupplyProductSchema
>;

export const toggleSupplyProductActiveSchema = z.object({
  id: z.string().trim().min(1, "Ürün kimliği gereklidir."),
  isActive: z.boolean({ error: "Durum bilgisi gereklidir." }),
});

export type ToggleSupplyProductActiveInput = z.infer<
  typeof toggleSupplyProductActiveSchema
>;

export const deleteSupplyProductSchema = z.object({
  id: z.string().trim().min(1, "Ürün kimliği gereklidir."),
});

export type DeleteSupplyProductInput = z.infer<
  typeof deleteSupplyProductSchema
>;
