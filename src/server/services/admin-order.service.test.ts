import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  OrderStatus,
  PaymentMethod,
  ProductType,
  Prisma,
  type PrismaClient,
} from "@prisma/client";
import {
  isValidStatusTransition,
  listOrders,
  getOrderByPublicId,
  updateOrderStatus,
  VALID_STATUS_TRANSITIONS,
} from "./admin-order.service";

describe("Admin Order Service & State Machine", () => {
  const mockNow = new Date("2026-08-23T14:00:00.000Z");

  const sampleOrderDbRecord = {
    id: "ord_internal_1",
    publicId: "ord_pub_12345",
    orderNumber: "SP-260823-1234",
    idempotencyKey: "idem_key_1",
    status: OrderStatus.PENDING,
    paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
    customerName: "Mehmet Demir",
    phone: "+905551234567",
    addressLine1: "İzmit Yahya Kaptan Mah. No: 12 D: 4",
    deliveryNotes: "Zili çalmayın lütfen",
    subtotal: new Prisma.Decimal(150),
    deliveryFee: new Prisma.Decimal(0),
    total: new Prisma.Decimal(150),
    createdAt: new Date("2026-08-23T10:00:00.000Z"),
    updatedAt: new Date("2026-08-23T10:00:00.000Z"),
    deliveredAt: null,
    cancelledAt: null,
    items: [
      {
        id: "item_1",
        orderId: "ord_internal_1",
        productId: "prod_1",
        productName: "19L Damacana Su",
        productType: ProductType.DAMACANA_WATER,
        quantity: 2,
        baseUnitPrice: new Prisma.Decimal(50),
        emptyBottleQuantity: 1,
        depositUnitAmount: new Prisma.Decimal(50),
        depositTotal: new Prisma.Decimal(50),
        lineTotal: new Prisma.Decimal(150),
        createdAt: new Date("2026-08-23T10:00:00.000Z"),
        updatedAt: new Date("2026-08-23T10:00:00.000Z"),
      },
    ],
  };

  type MockOrderDb = {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
  };

  let mockDb: { order: MockOrderDb };

  beforeEach(() => {
    mockDb = {
      order: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
    };
  });

  const getDb = () => mockDb as unknown as Pick<PrismaClient, "order">;

  describe("State Machine Transition Rules (isValidStatusTransition)", () => {
    const allStatuses = Object.values(OrderStatus);

    it("should allow valid progression transitions: PENDING -> OUT_FOR_DELIVERY -> DELIVERED", () => {
      expect(
        isValidStatusTransition(
          OrderStatus.PENDING,
          OrderStatus.OUT_FOR_DELIVERY
        )
      ).toBe(true);
      expect(
        isValidStatusTransition(
          OrderStatus.OUT_FOR_DELIVERY,
          OrderStatus.DELIVERED
        )
      ).toBe(true);
    });

    it("should allow cancellation only from PENDING state", () => {
      expect(
        isValidStatusTransition(OrderStatus.PENDING, OrderStatus.CANCELLED)
      ).toBe(true);
    });

    it("should reject cancellation once OUT_FOR_DELIVERY", () => {
      expect(
        isValidStatusTransition(
          OrderStatus.OUT_FOR_DELIVERY,
          OrderStatus.CANCELLED
        )
      ).toBe(false);
    });

    it("should treat DELIVERED and CANCELLED as terminal states with no transitions out", () => {
      expect(VALID_STATUS_TRANSITIONS[OrderStatus.DELIVERED]).toEqual([]);
      expect(VALID_STATUS_TRANSITIONS[OrderStatus.CANCELLED]).toEqual([]);

      for (const status of allStatuses) {
        expect(isValidStatusTransition(OrderStatus.DELIVERED, status)).toBe(
          false
        );
        expect(isValidStatusTransition(OrderStatus.CANCELLED, status)).toBe(
          false
        );
      }
    });

    it("should reject skipped steps and reverse transitions", () => {
      // Skipped steps
      expect(
        isValidStatusTransition(OrderStatus.PENDING, OrderStatus.DELIVERED)
      ).toBe(false);

      // Reversals
      expect(
        isValidStatusTransition(
          OrderStatus.OUT_FOR_DELIVERY,
          OrderStatus.PENDING
        )
      ).toBe(false);
    });
  });

  describe("listOrders", () => {
    it("should query orders newest first and format summary correctly", async () => {
      mockDb.order.findMany.mockResolvedValueOnce([sampleOrderDbRecord]);

      const result = await listOrders(undefined, getDb());

      expect(mockDb.order.findMany).toHaveBeenCalledWith({
        where: {},
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

      expect(result.length).toBe(1);
      expect(result[0]?.publicId).toBe("ord_pub_12345");
      expect(result[0]?.orderNumber).toBe("SP-260823-1234");
      expect(result[0]?.customerName).toBe("Mehmet Demir");
      expect(result[0]?.phone).toBe("+905551234567");
      expect(result[0]?.total).toBe("150");
      expect(result[0]?.itemsSummary).toBe("2x 19L Damacana Su");
      expect(result[0]?.totalItemsCount).toBe(2);
    });

    it("should filter orders by status when provided", async () => {
      mockDb.order.findMany.mockResolvedValueOnce([]);

      await listOrders({ status: OrderStatus.PENDING }, getDb());

      expect(mockDb.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: OrderStatus.PENDING },
          orderBy: { createdAt: "desc" },
        })
      );
    });
  });

  describe("getOrderByPublicId", () => {
    it("should retrieve full order details including customer PII by publicId", async () => {
      mockDb.order.findUnique.mockResolvedValueOnce(sampleOrderDbRecord);

      const result = await getOrderByPublicId("ord_pub_12345", getDb());

      expect(mockDb.order.findUnique).toHaveBeenCalledWith({
        where: { publicId: "ord_pub_12345" },
        include: {
          items: {
            orderBy: { productName: "asc" },
          },
        },
      });

      expect(result).not.toBeNull();
      expect(result?.publicId).toBe("ord_pub_12345");
      expect(result?.orderNumber).toBe("SP-260823-1234");
      expect(result?.customerName).toBe("Mehmet Demir");
      expect(result?.phone).toBe("+905551234567");
      expect(result?.addressLine1).toBe("İzmit Yahya Kaptan Mah. No: 12 D: 4");
      expect(result?.deliveryNotes).toBe("Zili çalmayın lütfen");
      expect(result?.items.length).toBe(1);
      expect(result?.items[0]?.depositTotal).toBe("50");
      expect(result?.items[0]?.lineTotal).toBe("150");
    });

    it("should return null if order is not found by publicId", async () => {
      mockDb.order.findUnique.mockResolvedValueOnce(null);

      const result = await getOrderByPublicId(
        "non_existent_public_id",
        getDb()
      );

      expect(result).toBeNull();
    });
  });

  describe("updateOrderStatus", () => {
    it("should successfully update order status for valid transition (PENDING -> OUT_FOR_DELIVERY)", async () => {
      mockDb.order.findUnique
        .mockResolvedValueOnce({
          status: OrderStatus.PENDING,
          deliveredAt: null,
          cancelledAt: null,
        })
        .mockResolvedValueOnce({
          publicId: "ord_pub_12345",
          orderNumber: "SP-260823-1234",
          status: OrderStatus.OUT_FOR_DELIVERY,
          deliveredAt: null,
          cancelledAt: null,
          updatedAt: mockNow,
        });

      mockDb.order.updateMany.mockResolvedValueOnce({ count: 1 });

      const result = await updateOrderStatus(
        "ord_pub_12345",
        OrderStatus.OUT_FOR_DELIVERY,
        {
          currentTime: mockNow,
          db: getDb(),
        }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(OrderStatus.OUT_FOR_DELIVERY);
        expect(result.data.deliveredAt).toBeNull();
        expect(result.data.cancelledAt).toBeNull();
      }

      expect(mockDb.order.updateMany).toHaveBeenCalledWith({
        where: {
          publicId: "ord_pub_12345",
          status: OrderStatus.PENDING,
        },
        data: { status: OrderStatus.OUT_FOR_DELIVERY },
      });
      expect(mockDb.order.findUnique).toHaveBeenCalledTimes(2);
    });

    it("should set deliveredAt timestamp when transitioning to DELIVERED", async () => {
      mockDb.order.findUnique
        .mockResolvedValueOnce({
          status: OrderStatus.OUT_FOR_DELIVERY,
          deliveredAt: null,
          cancelledAt: null,
        })
        .mockResolvedValueOnce({
          publicId: "ord_pub_12345",
          orderNumber: "SP-260823-1234",
          status: OrderStatus.DELIVERED,
          deliveredAt: mockNow,
          cancelledAt: null,
          updatedAt: mockNow,
        });

      mockDb.order.updateMany.mockResolvedValueOnce({ count: 1 });

      const result = await updateOrderStatus(
        "ord_pub_12345",
        OrderStatus.DELIVERED,
        {
          currentTime: mockNow,
          db: getDb(),
        }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(OrderStatus.DELIVERED);
        expect(result.data.deliveredAt).toEqual(mockNow);
        expect(result.data.cancelledAt).toBeNull();
      }

      expect(mockDb.order.updateMany).toHaveBeenCalledWith({
        where: {
          publicId: "ord_pub_12345",
          status: OrderStatus.OUT_FOR_DELIVERY,
        },
        data: {
          status: OrderStatus.DELIVERED,
          deliveredAt: mockNow,
        },
      });
    });

    it("should set cancelledAt timestamp when transitioning to CANCELLED", async () => {
      mockDb.order.findUnique
        .mockResolvedValueOnce({
          status: OrderStatus.PENDING,
          deliveredAt: null,
          cancelledAt: null,
        })
        .mockResolvedValueOnce({
          publicId: "ord_pub_12345",
          orderNumber: "SP-260823-1234",
          status: OrderStatus.CANCELLED,
          deliveredAt: null,
          cancelledAt: mockNow,
          updatedAt: mockNow,
        });

      mockDb.order.updateMany.mockResolvedValueOnce({ count: 1 });

      const result = await updateOrderStatus(
        "ord_pub_12345",
        OrderStatus.CANCELLED,
        {
          currentTime: mockNow,
          db: getDb(),
        }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(OrderStatus.CANCELLED);
        expect(result.data.cancelledAt).toEqual(mockNow);
        expect(result.data.deliveredAt).toBeNull();
      }

      expect(mockDb.order.updateMany).toHaveBeenCalledWith({
        where: {
          publicId: "ord_pub_12345",
          status: OrderStatus.PENDING,
        },
        data: {
          status: OrderStatus.CANCELLED,
          cancelledAt: mockNow,
        },
      });
    });

    it("should return ORDER_NOT_FOUND when updating non-existent publicId", async () => {
      mockDb.order.findUnique.mockResolvedValueOnce(null);

      const result = await updateOrderStatus(
        "missing_pub_id",
        OrderStatus.OUT_FOR_DELIVERY,
        { db: getDb() }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("ORDER_NOT_FOUND");
      }
      expect(mockDb.order.updateMany).not.toHaveBeenCalled();
    });

    it("should return INVALID_STATUS_TRANSITION when attempting transition to the same status", async () => {
      mockDb.order.findUnique.mockResolvedValueOnce({
        status: OrderStatus.OUT_FOR_DELIVERY,
        deliveredAt: null,
        cancelledAt: null,
      });

      const result = await updateOrderStatus(
        "ord_pub_12345",
        OrderStatus.OUT_FOR_DELIVERY,
        { db: getDb() }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("INVALID_STATUS_TRANSITION");
      }
      expect(mockDb.order.updateMany).not.toHaveBeenCalled();
    });

    it("should return CONCURRENT_MODIFICATION when updateMany updates 0 rows due to concurrent status change", async () => {
      mockDb.order.findUnique.mockResolvedValueOnce({
        status: OrderStatus.PENDING,
        deliveredAt: null,
        cancelledAt: null,
      });

      // Another transaction updated the status between findUnique and updateMany
      mockDb.order.updateMany.mockResolvedValueOnce({ count: 0 });

      const result = await updateOrderStatus(
        "ord_pub_12345",
        OrderStatus.OUT_FOR_DELIVERY,
        {
          currentTime: mockNow,
          db: getDb(),
        }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CONCURRENT_MODIFICATION");
      }
      expect(mockDb.order.updateMany).toHaveBeenCalledWith({
        where: {
          publicId: "ord_pub_12345",
          status: OrderStatus.PENDING,
        },
        data: { status: OrderStatus.OUT_FOR_DELIVERY },
      });
    });

    it("should return INVALID_STATUS_TRANSITION when trying to cancel an OUT_FOR_DELIVERY order", async () => {
      mockDb.order.findUnique.mockResolvedValueOnce({
        status: OrderStatus.OUT_FOR_DELIVERY,
        deliveredAt: null,
        cancelledAt: null,
      });

      const result = await updateOrderStatus(
        "ord_pub_12345",
        OrderStatus.CANCELLED,
        { db: getDb() }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("INVALID_STATUS_TRANSITION");
      }
      expect(mockDb.order.updateMany).not.toHaveBeenCalled();
    });

    it("should return INVALID_STATUS_TRANSITION when updating a DELIVERED terminal order", async () => {
      mockDb.order.findUnique.mockResolvedValueOnce({
        status: OrderStatus.DELIVERED,
        deliveredAt: new Date("2026-08-23T11:00:00.000Z"),
        cancelledAt: null,
      });

      const result = await updateOrderStatus(
        "ord_pub_12345",
        OrderStatus.CANCELLED,
        { db: getDb() }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("INVALID_STATUS_TRANSITION");
      }
      expect(mockDb.order.updateMany).not.toHaveBeenCalled();
    });

    it("should return INVALID_STATUS_TRANSITION when updating a CANCELLED terminal order", async () => {
      mockDb.order.findUnique.mockResolvedValueOnce({
        status: OrderStatus.CANCELLED,
        deliveredAt: null,
        cancelledAt: new Date("2026-08-23T11:00:00.000Z"),
      });

      const result = await updateOrderStatus(
        "ord_pub_12345",
        OrderStatus.OUT_FOR_DELIVERY,
        { db: getDb() }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("INVALID_STATUS_TRANSITION");
      }
      expect(mockDb.order.updateMany).not.toHaveBeenCalled();
    });
  });
});
