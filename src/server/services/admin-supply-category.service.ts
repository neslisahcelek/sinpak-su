import { prisma } from "@/server/db/client";
import { type PrismaClient, type SupplyCategory } from "@prisma/client";
import {
  createSupplyCategorySchema,
  updateSupplyCategorySchema,
  toggleSupplyCategoryActiveSchema,
  type CreateSupplyCategoryInput,
  type UpdateSupplyCategoryInput,
} from "@/server/validation/admin-supply.schema";
import { slugifyTurkish } from "@/server/utils/slug";
import { err, makeSafeError, ok, type Result } from "@/server/types/result";

export type SupplyCategoryDto = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
};

export function mapSupplyCategoryToDto(
  category: SupplyCategory & { _count?: { products: number } }
): SupplyCategoryDto {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    displayOrder: category.displayOrder ?? 0,
    isActive: category.isActive,
    productCount: category._count?.products ?? 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  return "code" in error && (error as { code: string }).code === "P2002";
}

function isPrismaRecordNotFoundError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  return "code" in error && (error as { code: string }).code === "P2025";
}

/**
 * Lists all supply categories for admin management.
 * Active categories first, then ordered by displayOrder asc, then name asc.
 */
export async function listAllSupplyCategories(
  db: Pick<PrismaClient, "supplyCategory"> = prisma
): Promise<SupplyCategoryDto[]> {
  if (!db?.supplyCategory) {
    return [];
  }

  const categories = await db.supplyCategory.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: [
      { isActive: "desc" },
      { displayOrder: "asc" },
      { name: "asc" },
    ],
  });

  return categories.map(mapSupplyCategoryToDto);
}

/**
 * Lists active supply categories for the public storefront.
 */
export async function listActiveSupplyCategories(
  db: Pick<PrismaClient, "supplyCategory"> = prisma
): Promise<SupplyCategoryDto[]> {
  if (!db?.supplyCategory) {
    return [];
  }

  const categories = await db.supplyCategory.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: [
      { displayOrder: "asc" },
      { name: "asc" },
    ],
  });

  return categories.map(mapSupplyCategoryToDto);
}

/**
 * Retrieves a single supply category by ID.
 */
export async function getSupplyCategoryById(
  id: string,
  db: Pick<PrismaClient, "supplyCategory"> = prisma
): Promise<Result<SupplyCategoryDto>> {
  if (!id || typeof id !== "string" || id.trim() === "") {
    return err(makeSafeError("VALIDATION_ERROR", "Geçersiz kategori kimliği."));
  }

  try {
    const category = await db.supplyCategory.findUnique({
      where: { id: id.trim() },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return err(
        makeSafeError("CATEGORY_NOT_FOUND", `Kategori bulunamadı (${id}).`)
      );
    }

    return ok(mapSupplyCategoryToDto(category));
  } catch {
    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Kategori bilgisi alınırken veritabanı hatası oluştu."
      )
    );
  }
}

export interface CreateSupplyCategoryOptions {
  db?: Pick<PrismaClient, "supplyCategory">;
  maxRetries?: number;
}

/**
 * Creates a new supply category with validated input and collision-safe Turkish slug generation.
 */
export async function createSupplyCategory(
  input: CreateSupplyCategoryInput,
  options: CreateSupplyCategoryOptions = {}
): Promise<Result<SupplyCategoryDto>> {
  const db = options.db ?? prisma;
  const maxRetries = options.maxRetries ?? 10;

  const parsed = createSupplyCategorySchema.safeParse(input);
  if (!parsed.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz kategori bilgileri.",
        parsed.error.format()
      )
    );
  }

  const baseSlug = slugifyTurkish(parsed.data.name);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;

    try {
      const created = await db.supplyCategory.create({
        data: {
          slug,
          name: parsed.data.name,
          description: parsed.data.description,
          displayOrder: parsed.data.displayOrder ?? 0,
          isActive: parsed.data.isActive ?? true,
        },
      });

      return ok(mapSupplyCategoryToDto(created));
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error)) {
        if (attempt < maxRetries) {
          continue;
        }
        return err(
          makeSafeError(
            "SLUG_COLLISION",
            "Kategori için benzersiz bir bağlantı oluşturulamadı. Lütfen kategori adını değiştirin."
          )
        );
      }

      return err(
        makeSafeError(
          "INTERNAL_ERROR",
          "Kategori oluşturulurken veritabanı hatası oluştu."
        )
      );
    }
  }

  return err(
    makeSafeError(
      "SLUG_COLLISION",
      "Kategori için benzersiz bir bağlantı oluşturulamadı."
    )
  );
}

export interface UpdateSupplyCategoryOptions {
  db?: Pick<PrismaClient, "supplyCategory">;
}

/**
 * Updates editable fields of an existing supply category.
 */
export async function updateSupplyCategory(
  id: string,
  input: Omit<UpdateSupplyCategoryInput, "id"> | UpdateSupplyCategoryInput,
  options: UpdateSupplyCategoryOptions = {}
): Promise<Result<SupplyCategoryDto>> {
  const db = options.db ?? prisma;

  const parsed = updateSupplyCategorySchema.safeParse({
    ...input,
    id,
  });

  if (!parsed.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz kategori güncelleme bilgileri.",
        parsed.error.format()
      )
    );
  }

  const updateData: {
    name: string;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
  } = {
    name: parsed.data.name,
    description: parsed.data.description,
  };

  if (typeof parsed.data.displayOrder === "number") {
    updateData.displayOrder = parsed.data.displayOrder;
  }

  if (typeof parsed.data.isActive === "boolean") {
    updateData.isActive = parsed.data.isActive;
  }

  try {
    const updated = await db.supplyCategory.update({
      where: { id: parsed.data.id },
      data: updateData,
    });

    return ok(mapSupplyCategoryToDto(updated));
  } catch (error: unknown) {
    if (isPrismaRecordNotFoundError(error)) {
      return err(
        makeSafeError("CATEGORY_NOT_FOUND", `Kategori bulunamadı (${id}).`)
      );
    }

    return err(
      makeSafeError("INTERNAL_ERROR", "Kategori güncellenirken bir hata oluştu.")
    );
  }
}

/**
 * Toggles a supply category's active status.
 */
export async function toggleSupplyCategoryActive(
  id: string,
  isActive: boolean,
  db: Pick<PrismaClient, "supplyCategory"> = prisma
): Promise<Result<SupplyCategoryDto>> {
  const parsed = toggleSupplyCategoryActiveSchema.safeParse({ id, isActive });
  if (!parsed.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz durum güncelleme bilgileri.",
        parsed.error.format()
      )
    );
  }

  try {
    const updated = await db.supplyCategory.update({
      where: { id: parsed.data.id },
      data: {
        isActive: parsed.data.isActive,
      },
    });

    return ok(mapSupplyCategoryToDto(updated));
  } catch (error: unknown) {
    if (isPrismaRecordNotFoundError(error)) {
      return err(
        makeSafeError("CATEGORY_NOT_FOUND", `Kategori bulunamadı (${id}).`)
      );
    }

    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Kategori durumu güncellenirken bir hata oluştu."
      )
    );
  }
}

/**
 * Deletes a supply category if it contains no associated products.
 */
export async function deleteSupplyCategory(
  id: string,
  db: Pick<PrismaClient, "supplyCategory"> = prisma
): Promise<Result<{ success: true }>> {
  if (!id || typeof id !== "string" || id.trim() === "") {
    return err(makeSafeError("VALIDATION_ERROR", "Geçersiz kategori kimliği."));
  }

  try {
    const category = await db.supplyCategory.findUnique({
      where: { id: id.trim() },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return err(
        makeSafeError("CATEGORY_NOT_FOUND", `Kategori bulunamadı (${id}).`)
      );
    }

    if (category._count && category._count.products > 0) {
      return err(
        makeSafeError(
          "CATEGORY_HAS_PRODUCTS",
          "Bu kategoriye bağlı ürünler bulunmaktadır. Kategoriyi silmeden önce ürünleri başka bir kategoriye taşımalı veya silmelisiniz."
        )
      );
    }

    await db.supplyCategory.delete({
      where: { id: id.trim() },
    });

    return ok({ success: true });
  } catch {
    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Kategori silinirken veritabanı hatası oluştu."
      )
    );
  }
}
