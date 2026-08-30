import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderStatus, Prisma, type PrismaClient } from "@prisma/client";
import { lookupOrderTracking } from "./order-tracking.service";

describe("lookupOrderTracking", () => {
  const sampleOrder = {
    id: "ord_1",
    publicId: "pub_1",
    orderNumber: "SP-260830-4F3A",
    phone: "+905321234567",
    status: OrderStatus.OUT_FOR_DELIVERY,
    createdAt: new Date("2026-08-30T10:00:00.000Z"),
    updatedAt: new Date("2026-08-30T11:00:00.000Z"),
    deliveredAt: null,
    cancelledAt: null,
    total: new Prisma.Decimal(100),
    items: [
      {
        productName: "19L Damacana Su",
        productType: "DAMACANA_WATER",
        quantity: 2,
        lineTotal: new Prisma.Decimal(100),
      },
    ],
  };

  let mockDb: {
    order: {
      findFirst: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(() => {
    mockDb = {
      order: {
        findFirst: vi.fn(),
      },
    };
  });

  const getDb = () => mockDb as unknown as Pick<PrismaClient, "order">;

  it("returns tracking dto when both orderNumber and phone match", async () => {
    mockDb.order.findFirst.mockResolvedValueOnce(sampleOrder);

    const result = await lookupOrderTracking(
      "SP-260830-4F3A",
      "0532 123 45 67",
      getDb()
    );

    expect(result).not.toBeNull();
    expect(result?.orderNumber).toBe("SP-260830-4F3A");
    expect(result?.status).toBe("OUT_FOR_DELIVERY");
    expect(result?.items.length).toBe(1);

    expect(mockDb.order.findFirst).toHaveBeenCalledWith({
      where: {
        orderNumber: "SP-260830-4F3A",
        phone: "+905321234567",
      },
      include: expect.any(Object),
    });
  });

  it("returns null when orderNumber is invalid or empty", async () => {
    const result = await lookupOrderTracking("", "0532 123 45 67", getDb());
    expect(result).toBeNull();
    expect(mockDb.order.findFirst).not.toHaveBeenCalled();
  });

  it("returns null when phone format is invalid", async () => {
    const result = await lookupOrderTracking(
      "SP-260830-4F3A",
      "invalid-phone",
      getDb()
    );
    expect(result).toBeNull();
    expect(mockDb.order.findFirst).not.toHaveBeenCalled();
  });

  it("returns null when db lookup fails to find a matching pair", async () => {
    mockDb.order.findFirst.mockResolvedValueOnce(null);

    const result = await lookupOrderTracking(
      "SP-260830-9999",
      "0532 123 45 67",
      getDb()
    );

    expect(result).toBeNull();
  });
});
