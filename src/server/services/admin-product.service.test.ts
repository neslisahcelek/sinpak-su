import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  Prisma,
  ProductType,
  type PrismaClient,
  type Product,
} from "@prisma/client";
import {
  listAllAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  toggleProductActive,
  mapProductToAdminDto,
} from "./admin-product.service";

describe("Admin Product Domain Service", () => {
  const sampleActiveDamacana: Product = {
    id: "prod_damacana_1",
    slug: "19l-damacana-su",
    type: ProductType.DAMACANA_WATER,
    name: "19L Damacana Su",
    description: "19 Litre doğal kaynak damacana su.",
    price: new Prisma.Decimal("180.00"),
    depositAmount: new Prisma.Decimal("180.00"),
    displayOrder: 0,
    isActive: true,
    imageUrl: "/images/damacana.png",
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };

  const sampleInactiveBeverage: Product = {
    id: "prod_beverage_2",
    slug: "fanta-1-5l",
    type: ProductType.BEVERAGE,
    name: "1.5L Fanta",
    description: "1.5 Litre Portakallı Gazoz",
    price: new Prisma.Decimal("60.00"),
    depositAmount: new Prisma.Decimal("0.00"),
    displayOrder: 0,
    isActive: false,
    imageUrl: null,
    createdAt: new Date("2026-08-02T10:00:00.000Z"),
    updatedAt: new Date("2026-08-02T10:00:00.000Z"),
  };

  const sampleActiveBottledWater: Product = {
    id: "prod_bottled_3",
    slug: "0-5l-pet-su",
    type: ProductType.BOTTLED_WATER,
    name: "0.5L Pet Su",
    description: "0.5 Litre doğal kaynak suyu",
    price: new Prisma.Decimal("15.00"),
    depositAmount: new Prisma.Decimal("0.00"),
    displayOrder: 0,
    isActive: true,
    imageUrl: "/images/pet-05.png",
    createdAt: new Date("2026-08-03T10:00:00.000Z"),
    updatedAt: new Date("2026-08-03T10:00:00.000Z"),
  };

  type MockProductDb = {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete?: ReturnType<typeof vi.fn>;
  };

  let mockDb: { product: MockProductDb };

  beforeEach(() => {
    mockDb = {
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };
  });

  const getDb = () => mockDb as unknown as Pick<PrismaClient, "product">;

  describe("mapProductToAdminDto", () => {
    it("correctly converts Prisma Product with Decimals to string-formatted DTO", () => {
      const dto = mapProductToAdminDto(sampleActiveDamacana);
      expect(dto).toEqual({
        id: "prod_damacana_1",
        slug: "19l-damacana-su",
        type: ProductType.DAMACANA_WATER,
        name: "19L Damacana Su",
        description: "19 Litre doğal kaynak damacana su.",
        price: "180",
        depositAmount: "180",
        displayOrder: 0,
        isActive: true,
        imageUrl: "/images/damacana.png",
        createdAt: sampleActiveDamacana.createdAt,
        updatedAt: sampleActiveDamacana.updatedAt,
      });
    });
  });

  describe("listAllAdminProducts", () => {
    it("returns both active and inactive products using deterministic ordering", async () => {
      mockDb.product.findMany.mockResolvedValue([
        sampleActiveBottledWater,
        sampleActiveDamacana,
        sampleInactiveBeverage,
      ]);

      const result = await listAllAdminProducts(getDb());

      expect(mockDb.product.findMany).toHaveBeenCalledWith({
        orderBy: [
          { isActive: "desc" },
          { displayOrder: "asc" },
          { name: "asc" },
        ],
      });
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("0.5L Pet Su");
      expect(result[0].isActive).toBe(true);
      expect(result[2].name).toBe("1.5L Fanta");
      expect(result[2].isActive).toBe(false);
    });

    it("returns an empty array when no products exist", async () => {
      mockDb.product.findMany.mockResolvedValue([]);

      const result = await listAllAdminProducts(getDb());

      expect(result).toEqual([]);
    });
  });

  describe("getAdminProductById", () => {
    it("returns product DTO when found by valid ID", async () => {
      mockDb.product.findUnique.mockResolvedValue(sampleActiveDamacana);

      const result = await getAdminProductById("prod_damacana_1", getDb());

      expect(mockDb.product.findUnique).toHaveBeenCalledWith({
        where: { id: "prod_damacana_1" },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("prod_damacana_1");
        expect(result.data.name).toBe("19L Damacana Su");
        expect(result.data.price).toBe("180");
      }
    });

    it("returns PRODUCT_NOT_FOUND error when product does not exist", async () => {
      mockDb.product.findUnique.mockResolvedValue(null);

      const result = await getAdminProductById("non_existent_id", getDb());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
        expect(result.error.message).toContain("non_existent_id");
      }
    });

    it("returns VALIDATION_ERROR when ID is empty or whitespace", async () => {
      const result = await getAdminProductById("   ", getDb());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(mockDb.product.findUnique).not.toHaveBeenCalled();
    });

    it("returns INTERNAL_ERROR when database throws an exception", async () => {
      mockDb.product.findUnique.mockRejectedValue(
        new Error("Database connection lost")
      );

      const result = await getAdminProductById("prod_1", getDb());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("createProduct", () => {
    const validDamacanaInput = {
      name: "19L Damacana Su",
      description: "19 Litre doğal kaynak damacana su.",
      type: ProductType.DAMACANA_WATER,
      price: "180.00",
      depositAmount: "180.00",
      imageUrl: "/images/damacana.png",
      isActive: true,
    };

    it("creates product successfully with generated slug and Decimal precision", async () => {
      mockDb.product.create.mockResolvedValue(sampleActiveDamacana);

      const result = await createProduct(validDamacanaInput, { db: getDb() });

      expect(mockDb.product.create).toHaveBeenCalledWith({
        data: {
          slug: "19l-damacana-su",
          name: "19L Damacana Su",
          description: "19 Litre doğal kaynak damacana su.",
          type: ProductType.DAMACANA_WATER,
          price: expect.any(Prisma.Decimal),
          depositAmount: expect.any(Prisma.Decimal),
          displayOrder: 0,
          imageUrl: "/images/damacana.png",
          isActive: true,
        },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("19l-damacana-su");
        expect(result.data.name).toBe("19L Damacana Su");
      }
    });

    it("handles Turkish characters correctly in generated slug", async () => {
      const turkishInput = {
        name: "Özlem Dağ Suyu 0.5L (Cam Şişe)",
        description: "Doğal mineralli cam şişe su",
        type: ProductType.BOTTLED_WATER,
        price: "25.00",
        depositAmount: "0.00",
        imageUrl: null,
      };

      mockDb.product.create.mockImplementation(({ data }) =>
        Promise.resolve({
          ...sampleActiveBottledWater,
          ...data,
          id: "prod_turkish_1",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      const result = await createProduct(turkishInput, { db: getDb() });

      expect(result.success).toBe(true);
      expect(mockDb.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: "ozlem-dag-suyu-0-5l-cam-sise",
          name: "Özlem Dağ Suyu 0.5L (Cam Şişe)",
        }),
      });
    });

    it("handles slug collision (P2002) by retrying with deterministic suffix '-2'", async () => {
      // First attempt fails with P2002, second attempt succeeds
      const uniqueError = {
        code: "P2002",
        meta: { target: ["slug"] },
      };

      mockDb.product.create
        .mockRejectedValueOnce(uniqueError)
        .mockResolvedValueOnce({
          ...sampleActiveDamacana,
          slug: "19l-damacana-su-2",
        });

      const result = await createProduct(validDamacanaInput, { db: getDb() });

      expect(mockDb.product.create).toHaveBeenCalledTimes(2);
      expect(mockDb.product.create).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          data: expect.objectContaining({ slug: "19l-damacana-su" }),
        })
      );
      expect(mockDb.product.create).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          data: expect.objectContaining({ slug: "19l-damacana-su-2" }),
        })
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("19l-damacana-su-2");
      }
    });

    it("handles multiple sequential slug collisions (-2, -3, -4) and resolves safely", async () => {
      const uniqueError = { code: "P2002" };

      mockDb.product.create
        .mockRejectedValueOnce(uniqueError) // slug
        .mockRejectedValueOnce(uniqueError) // slug-2
        .mockRejectedValueOnce(uniqueError) // slug-3
        .mockResolvedValueOnce({
          ...sampleActiveDamacana,
          slug: "19l-damacana-su-4",
        });

      const result = await createProduct(validDamacanaInput, { db: getDb() });

      expect(mockDb.product.create).toHaveBeenCalledTimes(4);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("19l-damacana-su-4");
      }
    });

    it("returns SLUG_COLLISION error when maximum retry count is exceeded", async () => {
      const uniqueError = { code: "P2002" };
      mockDb.product.create.mockRejectedValue(uniqueError);

      const result = await createProduct(validDamacanaInput, {
        db: getDb(),
        maxRetries: 3,
      });

      expect(mockDb.product.create).toHaveBeenCalledTimes(3);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("SLUG_COLLISION");
      }
    });

    it("rejects invalid input schema (non-damacana with non-zero deposit)", async () => {
      const invalidInput = {
        name: "Coca Cola 1.5L",
        description: "Gazlı İçecek",
        type: ProductType.BEVERAGE,
        price: "50.00",
        depositAmount: "20.00", // invalid for BEVERAGE
      };

      const result = await createProduct(invalidInput, { db: getDb() });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(mockDb.product.create).not.toHaveBeenCalled();
    });

    it("rejects negative price input", async () => {
      const invalidInput = {
        name: "Su 0.5L",
        description: "Pet su",
        type: ProductType.BOTTLED_WATER,
        price: "-10.00",
        depositAmount: "0.00",
      };

      const result = await createProduct(invalidInput, { db: getDb() });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(mockDb.product.create).not.toHaveBeenCalled();
    });

    it("defaults isActive to true when omitted in input", async () => {
      const inputWithoutIsActive = {
        name: "0.5L Pet Su",
        description: "Pet su açıklaması",
        type: ProductType.BOTTLED_WATER,
        price: "15.00",
        depositAmount: "0.00",
      };

      mockDb.product.create.mockResolvedValue(sampleActiveBottledWater);

      const result = await createProduct(inputWithoutIsActive, { db: getDb() });

      expect(result.success).toBe(true);
      expect(mockDb.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isActive: true,
        }),
      });
    });

    it("returns INTERNAL_ERROR on unexpected database failures", async () => {
      mockDb.product.create.mockRejectedValue(new Error("Fatal DB Error"));

      const result = await createProduct(validDamacanaInput, { db: getDb() });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("INTERNAL_ERROR");
      }
    });
  });

  describe("updateProduct", () => {
    const updateInput = {
      name: "19L Damacana Su (Yenilendi)",
      description: "Yeni formül doğal kaynak suyu.",
      type: ProductType.DAMACANA_WATER,
      price: "195.00",
      depositAmount: "190.00",
      imageUrl: "/images/damacana-v2.png",
      isActive: true,
    };

    it("updates editable fields and keeps slug strictly unchanged / immutable", async () => {
      const updatedRecord: Product = {
        ...sampleActiveDamacana,
        name: updateInput.name,
        description: updateInput.description,
        price: new Prisma.Decimal(updateInput.price),
        depositAmount: new Prisma.Decimal(updateInput.depositAmount),
        imageUrl: updateInput.imageUrl,
        updatedAt: new Date("2026-08-10T12:00:00.000Z"),
      };

      mockDb.product.update.mockResolvedValue(updatedRecord);

      const result = await updateProduct("prod_damacana_1", updateInput, {
        db: getDb(),
      });

      expect(mockDb.product.update).toHaveBeenCalledWith({
        where: { id: "prod_damacana_1" },
        data: {
          name: "19L Damacana Su (Yenilendi)",
          description: "Yeni formül doğal kaynak suyu.",
          type: ProductType.DAMACANA_WATER,
          price: expect.any(Prisma.Decimal),
          depositAmount: expect.any(Prisma.Decimal),
          imageUrl: "/images/damacana-v2.png",
          isActive: true,
        },
      });
      // Slug MUST NOT be present in update payload
      const updateCallArgs = mockDb.product.update.mock.calls[0][0];
      expect(updateCallArgs.data).not.toHaveProperty("slug");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("19l-damacana-su");
        expect(result.data.name).toBe("19L Damacana Su (Yenilendi)");
        expect(result.data.price).toBe("195");
        expect(result.data.depositAmount).toBe("190");
      }
    });

    it("returns PRODUCT_NOT_FOUND when record to update does not exist (P2025)", async () => {
      mockDb.product.update.mockRejectedValue({
        code: "P2025",
        message: "Record to update not found.",
      });

      const result = await updateProduct("non_existent_id", updateInput, {
        db: getDb(),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
        expect(result.error.message).toContain("non_existent_id");
      }
    });

    it("returns VALIDATION_ERROR when update schema validation fails", async () => {
      const invalidUpdate = {
        name: "A", // too short (min 2)
        description: "Valid description",
        type: ProductType.DAMACANA_WATER,
        price: "100.00",
        depositAmount: "50.00",
      };

      const result = await updateProduct("prod_damacana_1", invalidUpdate, {
        db: getDb(),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(mockDb.product.update).not.toHaveBeenCalled();
    });

    it("does not mutate OrderItem or delete any records during update", async () => {
      mockDb.product.update.mockResolvedValue(sampleActiveDamacana);

      await updateProduct("prod_damacana_1", updateInput, { db: getDb() });

      // Verify no delete method was called
      expect(mockDb.product.delete).toBeUndefined();
      const updateArgs = mockDb.product.update.mock.calls[0][0];
      expect(updateArgs.data).not.toHaveProperty("orderItems");
    });
  });

  describe("toggleProductActive", () => {
    it("toggles product status from active to inactive (soft update)", async () => {
      const deactivatedProduct: Product = {
        ...sampleActiveDamacana,
        isActive: false,
      };

      mockDb.product.update.mockResolvedValue(deactivatedProduct);

      const result = await toggleProductActive("prod_damacana_1", false, {
        db: getDb(),
      });

      expect(mockDb.product.update).toHaveBeenCalledWith({
        where: { id: "prod_damacana_1" },
        data: { isActive: false },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });

    it("toggles product status from inactive to active", async () => {
      const activatedProduct: Product = {
        ...sampleInactiveBeverage,
        isActive: true,
      };

      mockDb.product.update.mockResolvedValue(activatedProduct);

      const result = await toggleProductActive("prod_beverage_2", true, {
        db: getDb(),
      });

      expect(mockDb.product.update).toHaveBeenCalledWith({
        where: { id: "prod_beverage_2" },
        data: { isActive: true },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("returns PRODUCT_NOT_FOUND when toggling non-existent product", async () => {
      mockDb.product.update.mockRejectedValue({
        code: "P2025",
        message: "Record to update not found.",
      });

      const result = await toggleProductActive("non_existent_id", false, {
        db: getDb(),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
      }
    });

    it("returns VALIDATION_ERROR for empty ID", async () => {
      const result = await toggleProductActive("", true, { db: getDb() });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(mockDb.product.update).not.toHaveBeenCalled();
    });

    it("never calls delete on the product model", async () => {
      mockDb.product.update.mockResolvedValue(sampleActiveDamacana);

      await toggleProductActive("prod_damacana_1", false, { db: getDb() });

      expect(mockDb.product.delete).toBeUndefined();
    });
  });
});
