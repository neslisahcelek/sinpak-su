import { prisma } from "@/server/db/client";
import type { PrismaClient } from "@prisma/client";
import { normalizeTurkishPhone } from "@/server/validation/order.schema";

export interface OrderTrackingItemDto {
  productName: string;
  productType: string;
  quantity: number;
  lineTotal: string;
}

export interface OrderTrackingDto {
  orderNumber: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  total: string;
  items: OrderTrackingItemDto[];
}

/**
 * Looks up an order for customer-facing tracking using orderNumber + phone.
 *
 * Security model:
 * - Requires BOTH orderNumber and phone to match (two-factor lookup).
 * - Phone is normalized before comparison so formatting differences are handled.
 * - Returns only non-PII status and order summary — no address or delivery notes.
 * - Returns null for any non-match (no distinguishing between wrong number vs wrong phone).
 *
 * This deliberately avoids phone-number-only lookup which would allow
 * iterating through phone numbers to discover order history.
 */
export async function lookupOrderTracking(
  orderNumber: string,
  phoneInput: string,
  db: Pick<PrismaClient, "order"> = prisma
): Promise<OrderTrackingDto | null> {
  if (!orderNumber || !phoneInput) {
    return null;
  }

  const normalizedPhone = normalizeTurkishPhone(phoneInput.trim());
  if (!normalizedPhone) {
    return null;
  }

  const order = await db.order.findFirst({
    where: {
      orderNumber: orderNumber.trim().toUpperCase(),
      phone: normalizedPhone,
    },
    include: {
      items: {
        orderBy: { productName: "asc" },
        select: {
          productName: true,
          productType: true,
          quantity: true,
          lineTotal: true,
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    deliveredAt: order.deliveredAt,
    cancelledAt: order.cancelledAt,
    total: order.total.toString(),
    items: order.items.map((item) => ({
      productName: item.productName,
      productType: item.productType,
      quantity: item.quantity,
      lineTotal: item.lineTotal.toString(),
    })),
  };
}
