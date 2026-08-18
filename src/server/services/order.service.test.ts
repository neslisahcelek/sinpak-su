import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  Prisma,
  OrderStatus,
  type PrismaClient,
  type Product,
} from "@prisma/client";
import { createOrder } from "./order.service";

describe("Order Creation Service", () => {
  const activeDamacana: Product = {
    id: "prod_damacana_1",
    slug: "damacana-19l",
    type: "DAMACANA_WATER",
    name: "19L Damacana",
    description: "Doğal kaynak suyu",
    price: new Prisma.Decimal(50),
    depositAmount: new Prisma.Decimal(50),
    isActive: true,
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validPayload = {
    idempotencyKey: "123e4567-e89b-12d3-a456-426614174000",
    customerName: "Ayşe Kaya",
    phone: "0532 987 65 43",
    addressLine1: "Kocaeli İzmit Yahya Kaptan No:10",
    deliveryNotes: "Lütfen kapıya bırakın",
    paymentMethod: "POS" as const,
    items: [
      {
        productId: "prod_damacana_1",
        quantity: 2,
        emptyBottleQuantity: 1,
      },
    ],
  };

  // Open operating hours time: 14:00 Istanbul (11:00 UTC)
  const openTime = new Date("2026-08-18T11:00:00.000Z");
  // Closed operating hours time: 20:00 Istanbul (17:00 UTC)
  const closedTime = new Date("2026-08-18T17:00:00.000Z");

  type MockDb = {
    product: {
      findMany: ReturnType<typeof vi.fn>;
    };
    order: {
      findUnique: ReturnType<typeof vi.fn>;
    };
    $transaction: ReturnType<typeof vi.fn>;
  };

  let mockDb: MockDb;

  beforeEach(() => {
    mockDb = {
      product: {
        findMany: vi.fn().mockResolvedValue([activeDamacana]),
      },
      order: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        const tx = {
          order: {
            create: vi.fn().mockResolvedValue({ publicId: "ord_pub_12345" }),
          },
        };
        return await callback(tx);
      }),
    };
  });

  it("creates order successfully during operating hours and returns publicId", async () => {
    const result = await createOrder(validPayload, {
      currentTime: openTime,
      db: mockDb as unknown as PrismaClient,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.publicId).toBe("ord_pub_12345");
    }
  });

  it("rejects order creation outside operating hours with OUT_OF_OPERATING_HOURS", async () => {
    const result = await createOrder(validPayload, {
      currentTime: closedTime,
      db: mockDb as unknown as PrismaClient,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("OUT_OF_OPERATING_HOURS");
    }
  });

  it("returns existing publicId on idempotent retry with identical payload", async () => {
    const existingOrder = {
      id: "ord_internal_1",
      publicId: "ord_pub_existing_999",
      idempotencyKey: validPayload.idempotencyKey,
      status: OrderStatus.PENDING,
      paymentMethod: "POS",
      customerName: "Ayşe Kaya",
      phone: "+905329876543",
      addressLine1: "Kocaeli İzmit Yahya Kaptan No:10",
      deliveryNotes: "Lütfen kapıya bırakın",
      subtotal: new Prisma.Decimal(150),
      deliveryFee: new Prisma.Decimal(0),
      total: new Prisma.Decimal(150),
      items: [
        {
          productId: "prod_damacana_1",
          quantity: 2,
          emptyBottleQuantity: 1,
        },
      ],
    };

    mockDb.order.findUnique = vi.fn().mockResolvedValue(existingOrder);

    const result = await createOrder(validPayload, {
      currentTime: openTime,
      db: mockDb as unknown as PrismaClient,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.publicId).toBe("ord_pub_existing_999");
    }
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("returns IDEMPOTENCY_CONFLICT on retry with conflicting payload", async () => {
    const existingOrder = {
      id: "ord_internal_1",
      publicId: "ord_pub_existing_999",
      idempotencyKey: validPayload.idempotencyKey,
      status: OrderStatus.PENDING,
      paymentMethod: "CASH_ON_DELIVERY", // Different payment method!
      customerName: "Ayşe Kaya",
      phone: "+905329876543",
      addressLine1: "Kocaeli İzmit Yahya Kaptan No:10",
      deliveryNotes: "Lütfen kapıya bırakın",
      subtotal: new Prisma.Decimal(150),
      deliveryFee: new Prisma.Decimal(0),
      total: new Prisma.Decimal(150),
      items: [
        {
          productId: "prod_damacana_1",
          quantity: 2,
          emptyBottleQuantity: 1,
        },
      ],
    };

    mockDb.order.findUnique = vi.fn().mockResolvedValue(existingOrder);

    const result = await createOrder(validPayload, {
      currentTime: openTime,
      db: mockDb as unknown as PrismaClient,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("IDEMPOTENCY_CONFLICT");
    }
  });

  it("rejects order when a product is unavailable / inactive", async () => {
    mockDb.product.findMany = vi.fn().mockResolvedValue([]); // Returns 0 active products

    const result = await createOrder(validPayload, {
      currentTime: openTime,
      db: mockDb as unknown as PrismaClient,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("PRODUCT_UNAVAILABLE");
    }
  });
});
