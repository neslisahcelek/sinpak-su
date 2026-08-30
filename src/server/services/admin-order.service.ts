import { prisma } from "@/server/db/client";
import {
  OrderStatus,
  type PaymentMethod,
  type ProductType,
  type PrismaClient,
  type Prisma,
  type OrderItem,
} from "@prisma/client";
import { err, makeSafeError, ok, type Result } from "@/server/types/result";

/**
 * Valid state transitions for the simplified order lifecycle:
 * PENDING -> OUT_FOR_DELIVERY -> DELIVERED
 * PENDING -> CANCELLED
 *
 * OUT_FOR_DELIVERY cannot be cancelled (already dispatched).
 * DELIVERED and CANCELLED are terminal states.
 */
export const VALID_STATUS_TRANSITIONS: Record<
  OrderStatus,
  readonly OrderStatus[]
> = {
  [OrderStatus.PENDING]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
  [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
} as const;

/**
 * Checks whether a transition between two order statuses is legally permitted.
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean {
  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
  return allowedTransitions ? allowedTransitions.includes(nextStatus) : false;
}

export interface AdminOrderListItemDto {
  publicId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  addressLine1: string;
  deliveryNotes: string | null;
  subtotal: string;
  deliveryFee: string;
  total: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  itemsSummary: string;
  totalItemsCount: number;
}

export interface AdminOrderItemDto {
  id: string;
  productId: string;
  productName: string;
  productType: ProductType;
  quantity: number;
  baseUnitPrice: string;
  emptyBottleQuantity: number;
  depositUnitAmount: string;
  depositTotal: string;
  lineTotal: string;
}

export interface AdminOrderDetailDto {
  publicId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  addressLine1: string;
  deliveryNotes: string | null;
  subtotal: string;
  deliveryFee: string;
  total: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  items: AdminOrderItemDto[];
}

export interface UpdateOrderStatusResult {
  publicId: string;
  status: OrderStatus;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  updatedAt: Date;
}

export interface ListOrdersFilter {
  status?: OrderStatus;
}

/**
 * Lists orders sorted newest first (createdAt desc), optionally filtered by status.
 * Accessible only to authenticated admin workflows.
 */
export async function listOrders(
  filters?: ListOrdersFilter,
  db: Pick<PrismaClient, "order"> = prisma
): Promise<AdminOrderListItemDto[]> {
  const whereClause: Prisma.OrderWhereInput = {};
  if (filters?.status) {
    whereClause.status = filters.status;
  }

  const orders = await db.order.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: {
          productName: true,
          quantity: true,
        },
      },
    },
  });

  return orders.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${item.quantity}x ${item.productName}`)
      .join(", ");
    const totalItemsCount = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return {
      publicId: order.publicId,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      customerName: order.customerName,
      phone: order.phone,
      addressLine1: order.addressLine1,
      deliveryNotes: order.deliveryNotes,
      subtotal: order.subtotal.toString(),
      deliveryFee: order.deliveryFee.toString(),
      total: order.total.toString(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      itemsSummary,
      totalItemsCount,
    };
  });
}

/**
 * Retrieves full order details including customer PII by publicId.
 * Returns null if the order does not exist.
 */
export async function getOrderByPublicId(
  publicId: string,
  db: Pick<PrismaClient, "order"> = prisma
): Promise<AdminOrderDetailDto | null> {
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
    orderNumber: order.orderNumber,
    status: order.status,
    paymentMethod: order.paymentMethod,
    customerName: order.customerName,
    phone: order.phone,
    addressLine1: order.addressLine1,
    deliveryNotes: order.deliveryNotes,
    subtotal: order.subtotal.toString(),
    deliveryFee: order.deliveryFee.toString(),
    total: order.total.toString(),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    deliveredAt: order.deliveredAt,
    cancelledAt: order.cancelledAt,
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

export interface UpdateOrderStatusOptions {
  currentTime?: Date;
  db?: Pick<PrismaClient, "order">;
}

/**
 * Updates an order status following the strict state machine rules.
 * Automatically updates deliveredAt or cancelledAt when appropriate.
 */
export async function updateOrderStatus(
  publicId: string,
  nextStatus: OrderStatus,
  options: UpdateOrderStatusOptions = {}
): Promise<Result<UpdateOrderStatusResult>> {
  const db = options.db ?? prisma;

  let existingOrder: {
    status: OrderStatus;
    deliveredAt: Date | null;
    cancelledAt: Date | null;
  } | null = null;

  try {
    existingOrder = await db.order.findUnique({
      where: { publicId },
      select: {
        status: true,
        deliveredAt: true,
        cancelledAt: true,
      },
    });
  } catch {
    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Sipariş durumu kontrol edilirken veritabanı hatası oluştu."
      )
    );
  }

  if (!existingOrder) {
    return err(
      makeSafeError("ORDER_NOT_FOUND", `Sipariş bulunamadı (${publicId}).`)
    );
  }

  if (!isValidStatusTransition(existingOrder.status, nextStatus)) {
    return err(
      makeSafeError(
        "INVALID_STATUS_TRANSITION",
        `Sipariş durumu "${existingOrder.status}" iken "${nextStatus}" durumuna geçirilemez.`
      )
    );
  }

  const now = options.currentTime ?? new Date();
  const updateData: Prisma.OrderUpdateInput = {
    status: nextStatus,
  };

  if (nextStatus === OrderStatus.DELIVERED) {
    updateData.deliveredAt = now;
  } else if (nextStatus === OrderStatus.CANCELLED) {
    updateData.cancelledAt = now;
  }

  try {
    const updateResult = await db.order.updateMany({
      where: {
        publicId,
        status: existingOrder.status,
      },
      data: updateData,
    });

    if (updateResult.count === 0) {
      return err(
        makeSafeError(
          "CONCURRENT_MODIFICATION",
          "Sipariş durumu başka bir işlem tarafından güncellendi. Lütfen sayfayı yenileyip tekrar deneyin."
        )
      );
    }

    const updated = await db.order.findUnique({
      where: { publicId },
      select: {
        publicId: true,
        status: true,
        deliveredAt: true,
        cancelledAt: true,
        updatedAt: true,
      },
    });

    if (!updated) {
      return err(
        makeSafeError("ORDER_NOT_FOUND", `Sipariş bulunamadı (${publicId}).`)
      );
    }

    return ok(updated);
  } catch {
    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Sipariş durumu güncellenirken bir hata oluştu."
      )
    );
  }
}
