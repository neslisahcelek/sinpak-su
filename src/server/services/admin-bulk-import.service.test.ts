import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma, type PrismaClient } from "@prisma/client";
import {
  bulkImportProducts,
  bulkImportSupplyProducts,
} from "./admin-bulk-import.service";

describe("admin-bulk-import.service", () => {
  let mockDb: {
    product: {
      findFirst: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
    supplyProduct: {
      findFirst: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
    supplyCategory: {
      findMany: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(() => {
    mockDb = {
      product: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      supplyProduct: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      supplyCategory: {
        findMany: vi.fn().mockResolvedValue([]),
        findFirst: vi.fn(),
        create: vi.fn(),
      },
    };
  });

  describe("bulkImportProducts", () => {
    it("creates new product when not existing", async () => {
      mockDb.product.findFirst.mockResolvedValue(null);
      mockDb.product.create.mockResolvedValue({
        id: "prod_1",
        name: "Erikli Su",
      });

      const input = {
        products: [
          {
            name: "Erikli Su 0.5L",
            price: "120.00",
            type: "BOTTLED_WATER" as const,
            depositAmount: "0",
            description: "24'lü paket",
            imageUrl: null,
            displayOrder: 1,
          },
        ],
      };

      const result = await bulkImportProducts(
        input,
        mockDb as unknown as PrismaClient
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdCount).toBe(1);
        expect(result.data.updatedCount).toBe(0);
        expect(result.data.totalProcessed).toBe(1);
      }
      expect(mockDb.product.create).toHaveBeenCalled();
    });

    it("updates existing product when already present (upsert)", async () => {
      mockDb.product.findFirst.mockResolvedValue({
        id: "prod_1",
        name: "Erikli Su 0.5L",
        price: new Prisma.Decimal("100.00"),
        description: "Eski açıklama",
        imageUrl: null,
      });
      mockDb.product.update.mockResolvedValue({ id: "prod_1" });

      const input = {
        products: [
          {
            name: "Erikli Su 0.5L",
            price: "135.00",
            type: "BOTTLED_WATER" as const,
            depositAmount: "0",
            description: "Yeni güncel açıklama",
            imageUrl: null,
            displayOrder: 1,
          },
        ],
      };

      const result = await bulkImportProducts(
        input,
        mockDb as unknown as PrismaClient
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdCount).toBe(0);
        expect(result.data.updatedCount).toBe(1);
        expect(result.data.totalProcessed).toBe(1);
      }
      expect(mockDb.product.update).toHaveBeenCalled();
    });
  });

  describe("bulkImportSupplyProducts", () => {
    it("creates non-existing category and inserts supply product", async () => {
      mockDb.supplyCategory.findMany.mockResolvedValue([]);
      mockDb.supplyCategory.findFirst.mockResolvedValue(null);
      mockDb.supplyCategory.create.mockResolvedValue({
        id: "cat_hot_beverages",
        name: "Sıcak İçecekler",
        slug: "sicak-icecekler",
      });
      mockDb.supplyProduct.findFirst.mockResolvedValue(null);
      mockDb.supplyProduct.create.mockResolvedValue({ id: "sp_1" });

      const input = {
        fallbackCategoryId: null,
        products: [
          {
            name: "Çaykur Rize Çay 1kg",
            categoryName: "Sıcak İçecekler",
            unit: "Koli (12 Paket)",
            price: "1450.00",
            description: "Ofis tipi dökme çay",
            imageUrl: null,
            displayOrder: 0,
          },
        ],
      };

      const result = await bulkImportSupplyProducts(
        input,
        mockDb as unknown as PrismaClient
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdCount).toBe(1);
        expect(result.data.updatedCount).toBe(0);
      }
      expect(mockDb.supplyCategory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: "Sıcak İçecekler" }),
        })
      );
      expect(mockDb.supplyProduct.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: "Çaykur Rize Çay 1kg",
            categoryId: "cat_hot_beverages",
          }),
        })
      );
    });
  });
});
