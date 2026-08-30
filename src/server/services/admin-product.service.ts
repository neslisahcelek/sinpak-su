import { prisma } from "@/server/db/client";
import {
  Prisma,
  type PrismaClient,
  type Product,
  type ProductType,
} from "@prisma/client";
import {
  createProductSchema,
  updateProductSchema,
  toggleProductActiveSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/server/validation/admin-product.schema";
import { slugifyTurkish } from "@/server/utils/slug";
import { err, makeSafeError, ok, type Result } from "@/server/types/result";

export type AdminProductDto = {
  id: string;
  slug: string;
  type: ProductType;
  name: string;
  description: string;
  price: string;
  depositAmount: string;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Maps a Prisma Product database record to an AdminProductDto.
 */
export function mapProductToAdminDto(product: Product): AdminProductDto {
  return {
    id: product.id,
    slug: product.slug,
    type: product.type,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    depositAmount: product.depositAmount.toString(),
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
 * Lists all products (both active and inactive) with deterministic ordering:
 * Active products first (isActive desc), then ordered by name ascending.
 */
export async function listAllAdminProducts(
  db: Pick<PrismaClient, "product"> = prisma
): Promise<AdminProductDto[]> {
  const products = await db.product.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });

  return products.map(mapProductToAdminDto);
}

/**
 * Retrieves a single product by ID for admin viewing/editing.
 * Returns a Result with PRODUCT_NOT_FOUND if the product does not exist.
 */
export async function getAdminProductById(
  id: string,
  db: Pick<PrismaClient, "product"> = prisma
): Promise<Result<AdminProductDto>> {
  if (!id || typeof id !== "string" || id.trim() === "") {
    return err(makeSafeError("VALIDATION_ERROR", "Geçersiz ürün kimliği."));
  }

  try {
    const product = await db.product.findUnique({
      where: { id: id.trim() },
    });

    if (!product) {
      return err(
        makeSafeError("PRODUCT_NOT_FOUND", `Ürün bulunamadı (${id}).`)
      );
    }

    return ok(mapProductToAdminDto(product));
  } catch {
    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Ürün bilgisi alınırken veritabanı hatası oluştu."
      )
    );
  }
}

export interface CreateProductOptions {
  db?: Pick<PrismaClient, "product">;
  maxRetries?: number;
}

/**
 * Creates a new product with validated data and Turkish-aware unique slug generation.
 * Handles slug collisions safely using authoritative database unique constraints and deterministic suffixes.
 */
export async function createProduct(
  input: CreateProductInput,
  options: CreateProductOptions = {}
): Promise<Result<AdminProductDto>> {
  const db = options.db ?? prisma;
  const maxRetries = options.maxRetries ?? 10;

  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz ürün bilgileri.",
        parsed.error.format()
      )
    );
  }

  const baseSlug = slugifyTurkish(parsed.data.name);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;

    try {
      const created = await db.product.create({
        data: {
          slug,
          name: parsed.data.name,
          description: parsed.data.description,
          type: parsed.data.type,
          price: new Prisma.Decimal(parsed.data.price),
          depositAmount: new Prisma.Decimal(parsed.data.depositAmount),
          imageUrl: parsed.data.imageUrl ?? null,
          isActive: parsed.data.isActive ?? true,
        },
      });

      return ok(mapProductToAdminDto(created));
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error)) {
        if (attempt < maxRetries) {
          continue;
        }
        return err(
          makeSafeError(
            "SLUG_COLLISION",
            "Ürün için benzersiz bir bağlantı (slug) oluşturulamadı. Lütfen ürün adını değiştirin."
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
      "Ürün için benzersiz bir bağlantı (slug) oluşturulamadı."
    )
  );
}

export interface UpdateProductOptions {
  db?: Pick<PrismaClient, "product">;
}

/**
 * Updates editable fields of an existing product.
 * - Product slug remains strictly immutable.
 * - Historical OrderItem snapshots remain completely untouched.
 * - No hard deletion.
 */
export async function updateProduct(
  id: string,
  input: Omit<UpdateProductInput, "id"> | UpdateProductInput,
  options: UpdateProductOptions = {}
): Promise<Result<AdminProductDto>> {
  const db = options.db ?? prisma;

  const parsed = updateProductSchema.safeParse({
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

  const updateData: Prisma.ProductUpdateInput = {
    name: parsed.data.name,
    description: parsed.data.description,
    type: parsed.data.type,
    price: new Prisma.Decimal(parsed.data.price),
    depositAmount: new Prisma.Decimal(parsed.data.depositAmount),
    imageUrl: parsed.data.imageUrl ?? null,
  };

  if (typeof parsed.data.isActive === "boolean") {
    updateData.isActive = parsed.data.isActive;
  }

  try {
    const updated = await db.product.update({
      where: { id: parsed.data.id },
      data: updateData,
    });

    return ok(mapProductToAdminDto(updated));
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

export interface ToggleProductActiveOptions {
  db?: Pick<PrismaClient, "product">;
}

/**
 * Toggles a product's active status (soft state change).
 * Never performs hard deletion.
 */
export async function toggleProductActive(
  id: string,
  isActive: boolean,
  options: ToggleProductActiveOptions = {}
): Promise<Result<AdminProductDto>> {
  const db = options.db ?? prisma;

  const parsed = toggleProductActiveSchema.safeParse({ id, isActive });
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
    const updated = await db.product.update({
      where: { id: parsed.data.id },
      data: {
        isActive: parsed.data.isActive,
      },
    });

    return ok(mapProductToAdminDto(updated));
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
