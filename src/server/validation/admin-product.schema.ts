import { z } from "zod";
import { ProductType } from "@prisma/client";

const priceRegex = /^\d+(\.\d{1,2})?$/;

/**
 * Validates base product price: strictly positive (> 0), max 2 decimal places, max 100,000 TL.
 */
export const productPriceSchema = z
  .union([z.string().trim(), z.number()])
  .transform((val) => (typeof val === "number" ? val.toString() : val))
  .refine((val) => priceRegex.test(val), {
    message:
      "Fiyat geçerli bir sayı olmalı ve en fazla 2 ondalık basamak içermelidir.",
  })
  .refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 && num <= 100000;
    },
    {
      message: "Fiyat 0'dan büyük ve en fazla 100.000 TL olmalıdır.",
    }
  );

/**
 * Validates product deposit amount: non-negative (>= 0), max 2 decimal places, max 100,000 TL.
 */
export const productDepositSchema = z
  .union([z.string().trim(), z.number()])
  .optional()
  .nullable()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return "0.00";
    return typeof val === "number" ? val.toString() : val;
  })
  .refine((val) => priceRegex.test(val), {
    message:
      "Depozito tutarı geçerli bir sayı olmalı ve en fazla 2 ondalık basamak içermelidir.",
  })
  .refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100000;
    },
    {
      message:
        "Depozito tutarı 0 veya daha büyük ve en fazla 100.000 TL olmalıdır.",
    }
  );

/**
 * Validates optional product image URL.
 */
export const productImageUrlSchema = z
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

/**
 * Schema for creating a new product.
 */
export const createProductSchema = z
  .object({
    name: z
      .string({ error: "Ürün adı gereklidir." })
      .trim()
      .min(2, "Ürün adı en az 2 karakter olmalıdır.")
      .max(100, "Ürün adı en fazla 100 karakter olabilir."),
    description: z
      .string({ error: "Ürün açıklaması gereklidir." })
      .trim()
      .min(2, "Ürün açıklaması en az 2 karakter olmalıdır.")
      .max(1000, "Ürün açıklaması en fazla 1000 karakter olabilir."),
    type: z.nativeEnum(ProductType, {
      error: "Geçerli bir ürün tipi seçiniz.",
    }),
    price: productPriceSchema,
    depositAmount: productDepositSchema,
    imageUrl: productImageUrlSchema,
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const depositNum = parseFloat(data.depositAmount);
    if (data.type === ProductType.DAMACANA_WATER) {
      if (isNaN(depositNum) || depositNum < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["depositAmount"],
          message:
            "Damacana su için depozito tutarı 0 veya daha büyük olmalıdır.",
        });
      }
    } else {
      if (isNaN(depositNum) || depositNum !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["depositAmount"],
          message:
            "Depozito yalnızca damacana su ürünleri için belirlenebilir. Şişe su ve meşrubat için depozito 0 olmalıdır.",
        });
      }
    }
  });

export type CreateProductInput = z.input<typeof createProductSchema>;
export type ValidatedCreateProductInput = z.output<typeof createProductSchema>;

/**
 * Schema for updating an existing product.
 */
export const updateProductSchema = z
  .object({
    id: z.string().trim().min(1, "Ürün kimliği gereklidir."),
    name: z
      .string({ error: "Ürün adı gereklidir." })
      .trim()
      .min(2, "Ürün adı en az 2 karakter olmalıdır.")
      .max(100, "Ürün adı en fazla 100 karakter olabilir."),
    description: z
      .string({ error: "Ürün açıklaması gereklidir." })
      .trim()
      .min(2, "Ürün açıklaması en az 2 karakter olmalıdır.")
      .max(1000, "Ürün açıklaması en fazla 1000 karakter olabilir."),
    type: z.nativeEnum(ProductType, {
      error: "Geçerli bir ürün tipi seçiniz.",
    }),
    price: productPriceSchema,
    depositAmount: productDepositSchema,
    imageUrl: productImageUrlSchema,
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const depositNum = parseFloat(data.depositAmount);
    if (data.type === ProductType.DAMACANA_WATER) {
      if (isNaN(depositNum) || depositNum < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["depositAmount"],
          message:
            "Damacana su için depozito tutarı 0 veya daha büyük olmalıdır.",
        });
      }
    } else {
      if (isNaN(depositNum) || depositNum !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["depositAmount"],
          message:
            "Depozito yalnızca damacana su ürünleri için belirlenebilir. Şişe su ve meşrubat için depozito 0 olmalıdır.",
        });
      }
    }
  });

export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type ValidatedUpdateProductInput = z.output<typeof updateProductSchema>;

/**
 * Schema for toggling a product's active/inactive status.
 */
export const toggleProductActiveSchema = z.object({
  id: z.string().trim().min(1, "Ürün kimliği gereklidir."),
  isActive: z.boolean({ error: "Durum bilgisi gereklidir." }),
});

export type ToggleProductActiveInput = z.infer<
  typeof toggleProductActiveSchema
>;
