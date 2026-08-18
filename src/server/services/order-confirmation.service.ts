import { prisma } from "@/server/db/client";
import type { PrismaClient, OrderItem } from "@prisma/client";

export interface OrderConfirmationItemDto {
  id: string;
  productId: string;
  productName: string;
  productType: string;
  quantity: number;
  baseUnitPrice: string;
  emptyBottleQuantity: number;
  depositUnitAmount: string;
  depositTotal: string;
  lineTotal: string;
}

export interface OrderConfirmationDto {
  publicId: string;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  subtotal: string;
  deliveryFee: string;
  total: string;
  items: OrderConfirmationItemDto[];
}

/**
 * Retrieves minimal, non-PII order confirmation details by publicId.
 * Never exposes customerName, phone, addressLine1, or deliveryNotes.
 */
export async function getOrderConfirmation(
  publicId: string,
  db: Pick<PrismaClient, "order"> = prisma
): Promise<OrderConfirmationDto | null> {
  const order = await db.order.findUnique({
    where: { publicId },
    include: {
      items: {
        orderBy: { productName: "asc" },
      },
    },
  });

  if (!order) {
    return null;
  }

  return {
    publicId: order.publicId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    subtotal: order.subtotal.toString(),
    deliveryFee: order.deliveryFee.toString(),
    total: order.total.toString(),
    items: order.items.map((item: OrderItem) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productType: item.productType,
      quantity: item.quantity,
      baseUnitPrice: item.baseUnitPrice.toString(),
      emptyBottleQuantity: item.emptyBottleQuantity,
      depositUnitAmount: item.depositUnitAmount.toString(),
      depositTotal: item.depositTotal.toString(),
      lineTotal: item.lineTotal.toString(),
    })),
  };
}
