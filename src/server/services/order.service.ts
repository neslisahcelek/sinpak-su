import { prisma } from "@/server/db/client";
import {
  Prisma,
  OrderStatus,
  type PrismaClient,
  type Product,
} from "@prisma/client";
import {
  createOrderInputSchema,
  type CreateOrderInput,
  type ValidatedCreateOrderInput,
} from "@/server/validation/order.schema";
import { isWithinOperatingHours } from "@/server/services/operating-hours.service";
import { err, makeSafeError, ok, type Result } from "@/server/types/result";

export interface ConsolidatedItem {
  productId: string;
  quantity: number;
  emptyBottleQuantity: number;
}

export interface CalculatedOrderItem {
  productId: string;
  productName: string;
  productType: Product["type"];
  quantity: number;
  baseUnitPrice: Prisma.Decimal;
  emptyBottleQuantity: number;
  depositUnitAmount: Prisma.Decimal;
  depositTotal: Prisma.Decimal;
  lineTotal: Prisma.Decimal;
}

export interface CalculatedOrder {
  items: CalculatedOrderItem[];
  subtotal: Prisma.Decimal;
  deliveryFee: Prisma.Decimal;
  total: Prisma.Decimal;
}

/**
 * Consolidates duplicate product items in the order input by aggregating quantities.
 */
export function consolidateOrderItems(
  items: Array<{
    productId: string;
    quantity: number;
    emptyBottleQuantity?: number;
  }>
): ConsolidatedItem[] {
  const map = new Map<string, ConsolidatedItem>();

  for (const item of items) {
    const existing = map.get(item.productId);
    const emptyQty = item.emptyBottleQuantity ?? 0;

    if (existing) {
      existing.quantity += item.quantity;
      existing.emptyBottleQuantity += emptyQty;
    } else {
      map.set(item.productId, {
        productId: item.productId,
        quantity: item.quantity,
        emptyBottleQuantity: emptyQty,
      });
    }
  }

  return Array.from(map.values());
}

/**
 * Pure domain calculation of order pricing, deposits, and line totals from active product state.
 */
export function calculateOrderPricing(
  consolidatedItems: ConsolidatedItem[],
  productsMap: Map<string, Product>
): Result<CalculatedOrder> {
  const calculatedItems: CalculatedOrderItem[] = [];
  let subtotal = new Prisma.Decimal(0);

  for (const item of consolidatedItems) {
    const product = productsMap.get(item.productId);
    if (!product || !product.isActive) {
      return err(
        makeSafeError(
          "PRODUCT_UNAVAILABLE",
          `Product ${item.productId} is not available.`
        )
      );
    }

    if (item.quantity <= 0) {
      return err(
        makeSafeError(
          "VALIDATION_ERROR",
          "Item quantity must be greater than zero."
        )
      );
    }

    if (product.type !== "DAMACANA_WATER") {
      if (item.emptyBottleQuantity > 0) {
        return err(
          makeSafeError(
            "INVALID_EMPTY_BOTTLE_QUANTITY",
            `Empty bottle return is not applicable for ${product.name}.`
          )
        );
      }

      const baseUnitPrice = new Prisma.Decimal(product.price);
      const depositUnitAmount = new Prisma.Decimal(0);
      const depositTotal = new Prisma.Decimal(0);
      const lineTotal = baseUnitPrice.mul(item.quantity);

      subtotal = subtotal.add(lineTotal);

      calculatedItems.push({
        productId: product.id,
        productName: product.name,
        productType: product.type,
        quantity: item.quantity,
        baseUnitPrice,
        emptyBottleQuantity: 0,
        depositUnitAmount,
        depositTotal,
        lineTotal,
      });
    } else {
      // DAMACANA_WATER
      if (
        item.emptyBottleQuantity < 0 ||
        item.emptyBottleQuantity > item.quantity
      ) {
        return err(
          makeSafeError(
            "INVALID_EMPTY_BOTTLE_QUANTITY",
            `Empty bottle quantity for ${product.name} must be between 0 and ${item.quantity}.`
          )
        );
      }

      const baseUnitPrice = new Prisma.Decimal(product.price);
      const depositUnitAmount = new Prisma.Decimal(product.depositAmount);
      const missingEmptyQuantity = item.quantity - item.emptyBottleQuantity;
      const depositTotal = depositUnitAmount.mul(missingEmptyQuantity);
      const lineTotal = baseUnitPrice.mul(item.quantity).add(depositTotal);

      subtotal = subtotal.add(lineTotal);

      calculatedItems.push({
        productId: product.id,
        productName: product.name,
        productType: product.type,
        quantity: item.quantity,
        baseUnitPrice,
        emptyBottleQuantity: item.emptyBottleQuantity,
        depositUnitAmount,
        depositTotal,
        lineTotal,
      });
    }
  }

  const deliveryFee = new Prisma.Decimal(0); // 0 TL for MVP
  const total = subtotal.add(deliveryFee);

  return ok({
    items: calculatedItems,
    subtotal,
    deliveryFee,
    total,
  });
}

/**
 * Checks whether an existing order matches the incoming order request payload.
 */
function isEquivalentOrder(
  existingOrder: Prisma.OrderGetPayload<{ include: { items: true } }>,
  input: ValidatedCreateOrderInput,
  consolidatedItems: ConsolidatedItem[]
): boolean {
  if (
    existingOrder.customerName !== input.customerName ||
    existingOrder.phone !== input.phone ||
    existingOrder.addressLine1 !== input.addressLine1 ||
    existingOrder.paymentMethod !== input.paymentMethod ||
    (existingOrder.deliveryNotes ?? null) !== (input.deliveryNotes ?? null)
  ) {
    return false;
  }

  if (existingOrder.items.length !== consolidatedItems.length) {
    return false;
  }

  for (const item of consolidatedItems) {
    const matched = existingOrder.items.find(
      (oi) =>
        oi.productId === item.productId &&
        oi.quantity === item.quantity &&
        oi.emptyBottleQuantity === item.emptyBottleQuantity
    );
    if (!matched) {
      return false;
    }
  }

  return true;
}

export interface CreateOrderResult {
  publicId: string;
}

export interface CreateOrderOptions {
  currentTime?: Date;
  db?: PrismaClient;
}

/**
 * Creates a customer order with server-authoritative calculations, operating hours enforcement,
 * and idempotency conflict handling in an atomic database transaction.
 */
export async function createOrder(
  rawInput: CreateOrderInput,
  options: CreateOrderOptions = {}
): Promise<Result<CreateOrderResult>> {
  const db = options.db ?? prisma;

  // 1. Input Validation
  const validationResult = createOrderInputSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Invalid order input details.",
        validationResult.error.flatten()
      )
    );
  }
  const input = validationResult.data;

  // 2. Operating Hours Enforcement (09:00 inclusive to 19:00 exclusive in Europe/Istanbul)
  const orderTime = options.currentTime ?? new Date();
  if (!isWithinOperatingHours(orderTime)) {
    return err(
      makeSafeError(
        "OUT_OF_OPERATING_HOURS",
        "Orders are accepted only between 09:00 and 19:00."
      )
    );
  }

  // 3. Duplicate items consolidation
  const consolidatedItems = consolidateOrderItems(input.items);

  // 4. Load active products
  const productIds = consolidatedItems.map((i) => i.productId);
  let activeProducts: Product[];
  try {
    activeProducts = await db.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });
  } catch {
    return err(
      makeSafeError(
        "ORDER_CREATION_FAILED",
        "Failed to retrieve product details."
      )
    );
  }

  if (activeProducts.length !== productIds.length) {
    return err(
      makeSafeError(
        "PRODUCT_UNAVAILABLE",
        "One or more selected products are unavailable."
      )
    );
  }

  const productsMap = new Map<string, Product>();
  for (const product of activeProducts) {
    productsMap.set(product.id, product);
  }

  // 5. Calculate authoritative pricing
  const pricingResult = calculateOrderPricing(consolidatedItems, productsMap);
  if (!pricingResult.success) {
    return pricingResult;
  }
  const calculated = pricingResult.data;

  // 6. Idempotency pre-check
  try {
    const existingOrder = await db.order.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      include: { items: true },
    });

    if (existingOrder) {
      if (isEquivalentOrder(existingOrder, input, consolidatedItems)) {
        return ok({ publicId: existingOrder.publicId });
      }
      return err(
        makeSafeError(
          "IDEMPOTENCY_CONFLICT",
          "An order with this idempotency key already exists with different details."
        )
      );
    }
  } catch {
    return err(
      makeSafeError(
        "ORDER_CREATION_FAILED",
        "Failed to verify idempotency state."
      )
    );
  }

  // 7. Atomic transaction for order and item creation
  try {
    const createdOrder = await db.$transaction(async (tx) => {
      // Create Order with nested items
      return await tx.order.create({
        data: {
          idempotencyKey: input.idempotencyKey,
          status: OrderStatus.PENDING,
          paymentMethod: input.paymentMethod,
          customerName: input.customerName,
          phone: input.phone,
          addressLine1: input.addressLine1,
          deliveryNotes: input.deliveryNotes,
          subtotal: calculated.subtotal,
          deliveryFee: calculated.deliveryFee,
          total: calculated.total,
          items: {
            create: calculated.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productType: item.productType,
              quantity: item.quantity,
              baseUnitPrice: item.baseUnitPrice,
              emptyBottleQuantity: item.emptyBottleQuantity,
              depositUnitAmount: item.depositUnitAmount,
              depositTotal: item.depositTotal,
              lineTotal: item.lineTotal,
            })),
          },
        },
        select: {
          publicId: true,
        },
      });
    });

    return ok({ publicId: createdOrder.publicId });
  } catch (error) {
    // Handle concurrent duplicate idempotencyKey insertion race condition
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      try {
        const raceOrder = await db.order.findUnique({
          where: { idempotencyKey: input.idempotencyKey },
          include: { items: true },
        });
        if (raceOrder) {
          if (isEquivalentOrder(raceOrder, input, consolidatedItems)) {
            return ok({ publicId: raceOrder.publicId });
          }
          return err(
            makeSafeError(
              "IDEMPOTENCY_CONFLICT",
              "An order with this idempotency key already exists with different details."
            )
          );
        }
      } catch {
        // Fall through to generic error
      }
    }

    return err(
      makeSafeError(
        "ORDER_CREATION_FAILED",
        "Failed to create order. Please try again."
      )
    );
  }
}
