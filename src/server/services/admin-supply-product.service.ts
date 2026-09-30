import { prisma } from "@/server/db/client";
import { Prisma, type PrismaClient, type SupplyProduct, type SupplyCategory } from "@prisma/client";
import {
  createSupplyProductSchema,
  updateSupplyProductSchema,
  toggleSupplyProductActiveSchema,
  type CreateSupplyProductInput,
  type UpdateSupplyProductInput,
} from "@/server/validation/admin-supply.schema";
import { slugifyTurkish } from "@/server/utils/slug";
import { err, makeSafeError, ok, type Result } from "@/server/types/result";

export type SupplyProductDto = {
  id: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  name: string;
  description: string | null;
  unit: string | null;
  price: string | null;
  displayOrder: number;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaSupplyProductWithCategory = SupplyProduct & {
  category?: Pick<SupplyCategory, "id" | "name" | "slug"> | null;
};

export function mapSupplyProductToDto(
  product: PrismaSupplyProductWithCategory
): SupplyProductDto {
  return {
    id: product.id,
    slug: product.slug,
    categoryId: product.categoryId,
    categoryName: product.category?.name,
    categorySlug: product.category?.slug,
    name: product.name,
    description: product.description,
    unit: product.unit,
    price: product.price ? product.price.toString() : null,
    displayOrder: product.displayOrder ?? 0,
    isActive: product.isActive,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
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
 * Lists all supply products with optional category filtering.
 * Active products first, then ordered by displayOrder asc, then name asc.
 */
export async function listAllSupplyProducts(
  categoryId?: string,
  db: Pick<PrismaClient, "supplyProduct"> = prisma
): Promise<SupplyProductDto[]> {
  if (!db?.supplyProduct) {
    return [];
  }

  const where = categoryId ? { categoryId } : {};

  const products = await db.supplyProduct.findMany({
    where,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: [
      { isActive: "desc" },
      { displayOrder: "asc" },
      { name: "asc" },
    ],
  });

  return products.map(mapSupplyProductToDto);
}

/**
 * Lists active supply products for the public storefront.
 */
export async function listActiveSupplyProducts(
  categoryId?: string,
  db: Pick<PrismaClient, "supplyProduct"> = prisma
): Promise<SupplyProductDto[]> {
  if (!db?.supplyProduct) {
    return [];
  }

  const where: Prisma.SupplyProductWhereInput = {
    isActive: true,
    category: {
      isActive: true,
    },
    ...(categoryId ? { categoryId } : {}),
  };

  const products = await db.supplyProduct.findMany({
    where,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: [
      { displayOrder: "asc" },
      { name: "asc" },
    ],
  });

  return products.map(mapSupplyProductToDto);
}

/**
 * Retrieves a single supply product by ID.
 */
export async function getSupplyProductById(
  id: string,
  db: Pick<PrismaClient, "supplyProduct"> = prisma
): Promise<Result<SupplyProductDto>> {
  if (!id || typeof id !== "string" || id.trim() === "") {
    return err(makeSafeError("VALIDATION_ERROR", "Geçersiz ürün kimliği."));
  }

  try {
    const product = await db.supplyProduct.findUnique({
      where: { id: id.trim() },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!product) {
      return err(
        makeSafeError("PRODUCT_NOT_FOUND", `Ürün bulunamadı (${id}).`)
      );
    }

    return ok(mapSupplyProductToDto(product));
  } catch {
    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Ürün bilgisi alınırken veritabanı hatası oluştu."
      )
    );
  }
}

export interface CreateSupplyProductOptions {
  db?: Pick<PrismaClient, "supplyProduct" | "supplyCategory">;
  maxRetries?: number;
}

/**
 * Creates a new supply product with validated data and Turkish slug generation.
 */
export async function createSupplyProduct(
  input: CreateSupplyProductInput,
  options: CreateSupplyProductOptions = {}
): Promise<Result<SupplyProductDto>> {
  const db = options.db ?? prisma;
  const maxRetries = options.maxRetries ?? 10;

  const parsed = createSupplyProductSchema.safeParse(input);
  if (!parsed.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz ürün bilgileri.",
        parsed.error.format()
      )
    );
  }

  // Verify category exists
  const category = await db.supplyCategory.findUnique({
    where: { id: parsed.data.categoryId },
  });

  if (!category) {
    return err(
      makeSafeError(
        "CATEGORY_NOT_FOUND",
        "Seçilen kategori mevcut değil."
      )
    );
  }

  const baseSlug = slugifyTurkish(parsed.data.name);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;

    try {
      const created = await db.supplyProduct.create({
        data: {
          slug,
          categoryId: parsed.data.categoryId,
          name: parsed.data.name,
          description: parsed.data.description,
          unit: parsed.data.unit,
          price: parsed.data.price ? new Prisma.Decimal(parsed.data.price) : null,
          displayOrder: parsed.data.displayOrder ?? 0,
          imageUrl: parsed.data.imageUrl ?? null,
          isActive: parsed.data.isActive ?? true,
        },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      return ok(mapSupplyProductToDto(created));
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error)) {
        if (attempt < maxRetries) {
          continue;
        }
        return err(
          makeSafeError(
            "SLUG_COLLISION",
            "Ürün için benzersiz bir bağlantı oluşturulamadı. Lütfen ürün adını değiştirin."
          )
        );
      }

      return err(
        makeSafeError(
          "INTERNAL_ERROR",
          "Ürün oluşturulurken veritabanı hatası oluştu."
        )
      );
    }
  }

  return err(
    makeSafeError(
      "SLUG_COLLISION",
      "Ürün için benzersiz bir bağlantı oluşturulamadı."
    )
  );
}

export interface UpdateSupplyProductOptions {
  db?: Pick<PrismaClient, "supplyProduct" | "supplyCategory">;
}

/**
 * Updates editable fields of an existing supply product.
 */
export async function updateSupplyProduct(
  id: string,
  input: Omit<UpdateSupplyProductInput, "id"> | UpdateSupplyProductInput,
  options: UpdateSupplyProductOptions = {}
): Promise<Result<SupplyProductDto>> {
  const db = options.db ?? prisma;

  const parsed = updateSupplyProductSchema.safeParse({
    ...input,
    id,
  });

  if (!parsed.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz ürün güncelleme bilgileri.",
        parsed.error.format()
      )
    );
  }

  // Verify category exists
  const category = await db.supplyCategory.findUnique({
    where: { id: parsed.data.categoryId },
  });

  if (!category) {
    return err(
      makeSafeError(
        "CATEGORY_NOT_FOUND",
        "Seçilen kategori mevcut değil."
      )
    );
  }

  const updateData: Prisma.SupplyProductUpdateInput = {
    category: {
      connect: { id: parsed.data.categoryId },
    },
    name: parsed.data.name,
    description: parsed.data.description,
    unit: parsed.data.unit,
    price: parsed.data.price ? new Prisma.Decimal(parsed.data.price) : null,
    imageUrl: parsed.data.imageUrl ?? null,
  };

  if (typeof parsed.data.displayOrder === "number") {
    updateData.displayOrder = parsed.data.displayOrder;
  }

  if (typeof parsed.data.isActive === "boolean") {
    updateData.isActive = parsed.data.isActive;
  }

  try {
    const updated = await db.supplyProduct.update({
      where: { id: parsed.data.id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return ok(mapSupplyProductToDto(updated));
  } catch (error: unknown) {
    if (isPrismaRecordNotFoundError(error)) {
      return err(
        makeSafeError("PRODUCT_NOT_FOUND", `Ürün bulunamadı (${id}).`)
      );
    }

    return err(
      makeSafeError("INTERNAL_ERROR", "Ürün güncellenirken bir hata oluştu.")
    );
  }
}

/**
 * Toggles a supply product's active status.
 */
export async function toggleSupplyProductActive(
  id: string,
  isActive: boolean,
  db: Pick<PrismaClient, "supplyProduct"> = prisma
): Promise<Result<SupplyProductDto>> {
  const parsed = toggleSupplyProductActiveSchema.safeParse({ id, isActive });
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
    const updated = await db.supplyProduct.update({
      where: { id: parsed.data.id },
      data: {
        isActive: parsed.data.isActive,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return ok(mapSupplyProductToDto(updated));
  } catch (error: unknown) {
    if (isPrismaRecordNotFoundError(error)) {
      return err(
        makeSafeError("PRODUCT_NOT_FOUND", `Ürün bulunamadı (${id}).`)
      );
    }

    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Ürün durumu güncellenirken bir hata oluştu."
      )
    );
  }
}

/**
 * Deletes a supply product by ID.
 */
export async function deleteSupplyProduct(
  id: string,
  db: Pick<PrismaClient, "supplyProduct"> = prisma
): Promise<Result<{ success: true }>> {
  if (!id || typeof id !== "string" || id.trim() === "") {
    return err(makeSafeError("VALIDATION_ERROR", "Geçersiz ürün kimliği."));
  }

  try {
    await db.supplyProduct.delete({
      where: { id: id.trim() },
    });

    return ok({ success: true });
  } catch (error: unknown) {
    if (isPrismaRecordNotFoundError(error)) {
      return err(
        makeSafeError("PRODUCT_NOT_FOUND", `Ürün bulunamadı (${id}).`)
      );
    }

    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Ürün silinirken veritabanı hatası oluştu."
      )
    );
  }
}
