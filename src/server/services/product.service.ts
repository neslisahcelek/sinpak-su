import { prisma } from "@/server/db/client";
import type { PrismaClient, Product } from "@prisma/client";

export type ProductDto = {
  id: string;
  slug: string;
  type: string;
  name: string;
  description: string;
  price: string;
  depositAmount: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapProductToDto(product: Product): ProductDto {
  return {
    id: product.id,
    slug: product.slug,
    type: product.type,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    depositAmount: product.depositAmount.toString(),
    displayOrder: product.displayOrder ?? 0,
    isActive: product.isActive,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

/**
 * Lists all active products ordered by displayOrder ascending, then name ascending.
 */
export async function listActiveProducts(
  db: Pick<PrismaClient, "product"> = prisma
): Promise<ProductDto[]> {
  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: [
      { displayOrder: "asc" },
      { name: "asc" },
    ],
  });

  return products.map(mapProductToDto);
}

/**
 * Retrieves a single active product by its unique slug.
 */
export async function getActiveProductBySlug(
  slug: string,
  db: Pick<PrismaClient, "product"> = prisma
): Promise<ProductDto | null> {
  const product = await db.product.findFirst({
    where: { slug, isActive: true },
  });

  if (!product) return null;
  return mapProductToDto(product);
}
