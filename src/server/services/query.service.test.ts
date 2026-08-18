import { describe, it, expect, vi } from "vitest";
import { Prisma, OrderStatus, type Product } from "@prisma/client";
import { listActiveProducts, getActiveProductBySlug } from "./product.service";
import { getOrderConfirmation } from "./order-confirmation.service";

describe("Product Query Service", () => {
  const activeProducts: Product[] = [
    {
      id: "p1",
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
    },
    {
      id: "p2",
      slug: "pet-5l",
      type: "BOTTLED_WATER",
      name: "5L Pet Su",
      description: "Pet su",
      price: new Prisma.Decimal(25),
      depositAmount: new Prisma.Decimal(0),
      isActive: true,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("lists active products mapped to DTOs", async () => {
    const mockDb = {
      product: {
        findMany: vi.fn().mockResolvedValue(activeProducts),
      },
    };

    const result = await listActiveProducts(
      mockDb as unknown as Pick<
        import("@prisma/client").PrismaClient,
        "product"
      >
    );
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("19L Damacana");
    expect(result[0].price).toBe("50");
    expect(result[0].depositAmount).toBe("50");
    expect(result[1].price).toBe("25");
  });

  it("retrieves active product by slug", async () => {
    const mockDb = {
      product: {
        findFirst: vi.fn().mockResolvedValue(activeProducts[0]),
      },
    };

    const result = await getActiveProductBySlug(
      "damacana-19l",
      mockDb as unknown as Pick<
        import("@prisma/client").PrismaClient,
        "product"
      >
    );
    expect(result).not.toBeNull();
    expect(result?.slug).toBe("damacana-19l");
    expect(result?.price).toBe("50");
  });

  it("returns null when product is not found or inactive", async () => {
    const mockDb = {
      product: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    };

    const result = await getActiveProductBySlug(
      "non-existent",
      mockDb as unknown as Pick<
        import("@prisma/client").PrismaClient,
        "product"
      >
    );
    expect(result).toBeNull();
  });
});

describe("Order Confirmation Query Service (Non-PII Privacy)", () => {
  const orderWithItems = {
    id: "ord_internal_1",
    publicId: "ord_pub_abc123",
    idempotencyKey: "idem_123",
    status: OrderStatus.PENDING,
    paymentMethod: "CASH_ON_DELIVERY",
    customerName: "Gizli Müşteri Adı",
    phone: "+905321112233",
    addressLine1: "Gizli Adres Bilgisi No:123",
    deliveryNotes: "Gizli Notlar",
    subtotal: new Prisma.Decimal(200),
    deliveryFee: new Prisma.Decimal(0),
    total: new Prisma.Decimal(200),
    createdAt: new Date("2026-08-18T10:00:00.000Z"),
    updatedAt: new Date("2026-08-18T10:00:00.000Z"),
    cancelledAt: null,
    deliveredAt: null,
    items: [
      {
        id: "item_1",
        orderId: "ord_internal_1",
        productId: "p1",
        productName: "19L Damacana",
        productType: "DAMACANA_WATER",
        quantity: 3,
        baseUnitPrice: new Prisma.Decimal(50),
        emptyBottleQuantity: 2,
        depositUnitAmount: new Prisma.Decimal(50),
        depositTotal: new Prisma.Decimal(50),
        lineTotal: new Prisma.Decimal(200),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  it("returns minimal non-PII order confirmation details by publicId", async () => {
    const mockDb = {
      order: {
        findUnique: vi.fn().mockResolvedValue(orderWithItems),
      },
    };

    const confirmation = await getOrderConfirmation(
      "ord_pub_abc123",
      mockDb as unknown as Pick<import("@prisma/client").PrismaClient, "order">
    );
    expect(confirmation).not.toBeNull();
    if (confirmation) {
      expect(confirmation.publicId).toBe("ord_pub_abc123");
      expect(confirmation.status).toBe(OrderStatus.PENDING);
      expect(confirmation.paymentMethod).toBe("CASH_ON_DELIVERY");
      expect(confirmation.subtotal).toBe("200");
      expect(confirmation.deliveryFee).toBe("0");
      expect(confirmation.total).toBe("200");
      expect(confirmation.items).toHaveLength(1);
      expect(confirmation.items[0].productName).toBe("19L Damacana");
      expect(confirmation.items[0].emptyBottleQuantity).toBe(2);
      expect(confirmation.items[0].lineTotal).toBe("200");

      // Verify strict PII exclusion
      expect("customerName" in confirmation).toBe(false);
      expect("phone" in confirmation).toBe(false);
      expect("addressLine1" in confirmation).toBe(false);
      expect("deliveryNotes" in confirmation).toBe(false);
    }
  });

  it("returns null if publicId is not found", async () => {
    const mockDb = {
      order: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };

    const result = await getOrderConfirmation(
      "non-existent-public-id",
      mockDb as unknown as Pick<import("@prisma/client").PrismaClient, "order">
    );
    expect(result).toBeNull();
  });
});
