import { prisma } from "@/server/db/client";
import { Prisma, type PrismaClient } from "@prisma/client";
import { slugifyTurkish } from "@/server/utils/slug";
import type {
  BulkImportProductsInput,
  ValidatedBulkImportSupplyProductsInput,
} from "@/server/validation/admin-bulk-import.schema";
import { ok, type Result } from "@/server/types/result";

export interface BulkImportSummary {
  totalProcessed: number;
  createdCount: number;
  updatedCount: number;
  errors: string[];
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  return "code" in error && (error as { code: string }).code === "P2002";
}

/**
 * Bulk imports retail water products from Excel data.
 * Upsert strategy: If a product with the same name or slug exists, its details are updated; otherwise a new product is created.
 */
export async function bulkImportProducts(
  input: BulkImportProductsInput,
  db: PrismaClient = prisma
): Promise<Result<BulkImportSummary>> {
  const summary: BulkImportSummary = {
    totalProcessed: 0,
    createdCount: 0,
    updatedCount: 0,
    errors: [],
  };

  for (const item of input.products) {
    summary.totalProcessed += 1;
    const baseSlug = slugifyTurkish(item.name);

    try {
      // Check if product already exists by exact name or base slug
      const existing = await db.product.findFirst({
        where: {
          OR: [
            { name: { equals: item.name, mode: "insensitive" } },
            { slug: baseSlug },
          ],
        },
      });

      if (existing) {
        // Update existing product
        await db.product.update({
          where: { id: existing.id },
          data: {
            name: item.name,
            price: new Prisma.Decimal(item.price),
            type: item.type,
            depositAmount: new Prisma.Decimal(item.depositAmount),
            description: item.description || existing.description,
            imageUrl: item.imageUrl || existing.imageUrl,
            displayOrder: item.displayOrder,
          },
        });
        summary.updatedCount += 1;
      } else {
        // Create new product with slug retry
        let created = false;
        for (let attempt = 1; attempt <= 10; attempt++) {
          const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;
          try {
            await db.product.create({
              data: {
                slug,
                name: item.name,
                price: new Prisma.Decimal(item.price),
                type: item.type,
                depositAmount: new Prisma.Decimal(item.depositAmount),
                description: item.description || "",
                imageUrl: item.imageUrl || null,
                displayOrder: item.displayOrder,
                isActive: true,
              },
            });
            created = true;
            summary.createdCount += 1;
            break;
          } catch (error: unknown) {
            if (isPrismaUniqueConstraintError(error) && attempt < 10) {
              continue;
            }
            throw error;
          }
        }

        if (!created) {
          summary.errors.push(
            `'${item.name}' için benzersiz slug oluşturulamadı.`
          );
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Bilinmeyen hata";
      summary.errors.push(`'${item.name}' işlenirken hata: ${msg}`);
    }
  }

  return ok(summary);
}

/**
 * Bulk imports institutional supply products from Excel data.
 * Resolves or creates categories on the fly, and updates existing products or inserts new ones.
 */
export async function bulkImportSupplyProducts(
  input: ValidatedBulkImportSupplyProductsInput,
  db: PrismaClient = prisma
): Promise<Result<BulkImportSummary>> {
  const summary: BulkImportSummary = {
    totalProcessed: 0,
    createdCount: 0,
    updatedCount: 0,
    errors: [],
  };

  // Cache categories in memory for quick lookup: Map<normalizedName, categoryId>
  const categoryCache = new Map<string, string>();
  const allExistingCategories = await db.supplyCategory.findMany();
  for (const cat of allExistingCategories) {
    categoryCache.set(cat.name.trim().toLowerCase(), cat.id);
    categoryCache.set(cat.slug, cat.id);
  }

  // Helper to resolve or create category
  async function resolveCategoryId(
    rawCategoryName?: string | null
  ): Promise<string> {
    const trimmed = rawCategoryName?.trim();

    if (trimmed) {
      const normalizedKey = trimmed.toLowerCase();
      if (categoryCache.has(normalizedKey)) {
        return categoryCache.get(normalizedKey)!;
      }

      // Check DB in case created concurrently
      const foundInDb = await db.supplyCategory.findFirst({
        where: {
          OR: [
            { name: { equals: trimmed, mode: "insensitive" } },
            { slug: slugifyTurkish(trimmed) },
          ],
        },
      });

      if (foundInDb) {
        categoryCache.set(normalizedKey, foundInDb.id);
        return foundInDb.id;
      }

      // Create new category
      const catBaseSlug = slugifyTurkish(trimmed);
      let newCat = null;
      for (let attempt = 1; attempt <= 10; attempt++) {
        const catSlug =
          attempt === 1 ? catBaseSlug : `${catBaseSlug}-${attempt}`;
        try {
          newCat = await db.supplyCategory.create({
            data: {
              name: trimmed,
              slug: catSlug,
              isActive: true,
            },
          });
          break;
        } catch (error: unknown) {
          if (isPrismaUniqueConstraintError(error) && attempt < 10) continue;
          throw error;
        }
      }

      if (newCat) {
        categoryCache.set(normalizedKey, newCat.id);
        categoryCache.set(newCat.slug, newCat.id);
        return newCat.id;
      }
    }

    // Fallback category ID if provided
    if (input.fallbackCategoryId) {
      return input.fallbackCategoryId;
    }

    // Default "Genel" category fallback
    const defaultCatKey = "genel";
    if (categoryCache.has(defaultCatKey)) {
      return categoryCache.get(defaultCatKey)!;
    }

    let defaultCat = await db.supplyCategory.findFirst({
      where: { slug: "genel" },
    });
    if (!defaultCat) {
      defaultCat = await db.supplyCategory.create({
        data: {
          name: "Genel",
          slug: "genel",
          isActive: true,
        },
      });
    }
    categoryCache.set(defaultCatKey, defaultCat.id);
    return defaultCat.id;
  }

  for (const item of input.products) {
    summary.totalProcessed += 1;
    const baseSlug = slugifyTurkish(item.name);

    try {
      const categoryId = await resolveCategoryId(item.categoryName);

      const existing = await db.supplyProduct.findFirst({
        where: {
          OR: [
            { name: { equals: item.name, mode: "insensitive" } },
            { slug: baseSlug },
          ],
        },
      });

      const decimalPrice = item.price ? new Prisma.Decimal(item.price) : null;

      if (existing) {
        await db.supplyProduct.update({
          where: { id: existing.id },
          data: {
            name: item.name,
            categoryId,
            price: decimalPrice !== null ? decimalPrice : existing.price,
            unit: item.unit || existing.unit,
            description: item.description || existing.description,
            imageUrl: item.imageUrl || existing.imageUrl,
            displayOrder: item.displayOrder,
          },
        });
        summary.updatedCount += 1;
      } else {
        let created = false;
        for (let attempt = 1; attempt <= 10; attempt++) {
          const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;
          try {
            await db.supplyProduct.create({
              data: {
                slug,
                name: item.name,
                categoryId,
                price: decimalPrice,
                unit: item.unit || null,
                description: item.description || null,
                imageUrl: item.imageUrl || null,
                displayOrder: item.displayOrder,
                isActive: true,
              },
            });
            created = true;
            summary.createdCount += 1;
            break;
          } catch (error: unknown) {
            if (isPrismaUniqueConstraintError(error) && attempt < 10) continue;
            throw error;
          }
        }

        if (!created) {
          summary.errors.push(
            `'${item.name}' için benzersiz slug oluşturulamadı.`
          );
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Bilinmeyen hata";
      summary.errors.push(`'${item.name}' işlenirken hata: ${msg}`);
    }
  }

  return ok(summary);
}
