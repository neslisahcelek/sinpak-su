import { describe, it, expect, vi, beforeEach } from "vitest";
import { type SupplyCategory } from "@prisma/client";
import {
  listAllSupplyCategories,
  listActiveSupplyCategories,
  getSupplyCategoryById,
  createSupplyCategory,
  updateSupplyCategory,
  toggleSupplyCategoryActive,
  deleteSupplyCategory,
} from "./admin-supply-category.service";

describe("Admin Supply Category Domain Service", () => {
  const sampleCategory1: SupplyCategory & { _count: { products: number } } = {
    id: "cat_1",
    slug: "kagit-hijyen",
    name: "Kağıt & Hijyen",
    description: "Kağıt havlu ve peçeteler",
    displayOrder: 1,
    isActive: true,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
    _count: { products: 3 },
  };

  const sampleCategory2: SupplyCategory & { _count: { products: number } } = {
    id: "cat_2",
    slug: "temizlik-kimyasallari",
    name: "Temizlik Kimyasalları",
    description: null,
    displayOrder: 2,
    isActive: false,
    createdAt: new Date("2026-08-02T10:00:00.000Z"),
    updatedAt: new Date("2026-08-02T10:00:00.000Z"),
    _count: { products: 0 },
  };

  type MockSupplyCategoryDb = {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  let mockDb: { supplyCategory: MockSupplyCategoryDb };

  beforeEach(() => {
    mockDb = {
      supplyCategory: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };
  });

  describe("listAllSupplyCategories", () => {
    it("returns categories mapped to DTOs", async () => {
      mockDb.supplyCategory.findMany.mockResolvedValue([
        sampleCategory1,
        sampleCategory2,
      ]);

      const result = await listAllSupplyCategories(mockDb as never);

      expect(mockDb.supplyCategory.findMany).toHaveBeenCalledWith({
        include: { _count: { select: { products: true } } },
        orderBy: [
          { isActive: "desc" },
          { displayOrder: "asc" },
          { name: "asc" },
        ],
      });
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Kağıt & Hijyen");
      expect(result[0].productCount).toBe(3);
      expect(result[1].productCount).toBe(0);
    });
  });

  describe("listActiveSupplyCategories", () => {
    it("queries active categories only", async () => {
      mockDb.supplyCategory.findMany.mockResolvedValue([sampleCategory1]);

      const result = await listActiveSupplyCategories(mockDb as never);

      expect(mockDb.supplyCategory.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: { _count: { select: { products: true } } },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      });
      expect(result).toHaveLength(1);
    });
  });

  describe("getSupplyCategoryById", () => {
    it("returns category DTO when found", async () => {
      mockDb.supplyCategory.findUnique.mockResolvedValue(sampleCategory1);

      const result = await getSupplyCategoryById("cat_1", mockDb as never);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("cat_1");
        expect(result.data.name).toBe("Kağıt & Hijyen");
      }
    });

    it("returns CATEGORY_NOT_FOUND when not found", async () => {
      mockDb.supplyCategory.findUnique.mockResolvedValue(null);

      const result = await getSupplyCategoryById("nonexistent", mockDb as never);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CATEGORY_NOT_FOUND");
      }
    });

    it("returns VALIDATION_ERROR for empty ID", async () => {
      const result = await getSupplyCategoryById("  ", mockDb as never);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });
  });

  describe("createSupplyCategory", () => {
    it("creates a new category with generated Turkish slug", async () => {
      mockDb.supplyCategory.create.mockResolvedValue({
        ...sampleCategory1,
        slug: "kagit-ve-hijyen-urunleri",
        name: "Kağıt ve Hijyen Ürünleri",
      });

      const result = await createSupplyCategory(
        {
          name: "Kağıt ve Hijyen Ürünleri",
          description: "Açıklama",
          displayOrder: 1,
          isActive: true,
        },
        { db: mockDb as never }
      );

      expect(result.success).toBe(true);
      expect(mockDb.supplyCategory.create).toHaveBeenCalledWith({
        data: {
          slug: "kagit-ve-hijyen-urunleri",
          name: "Kağıt ve Hijyen Ürünleri",
          description: "Açıklama",
          displayOrder: 1,
          isActive: true,
        },
      });
    });

    it("returns VALIDATION_ERROR for invalid name", async () => {
      const result = await createSupplyCategory(
        { name: "A" },
        { db: mockDb as never }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });
  });

  describe("updateSupplyCategory", () => {
    it("updates category fields", async () => {
      mockDb.supplyCategory.update.mockResolvedValue({
        ...sampleCategory1,
        name: "Kağıt & Hijyen Güncel",
      });

      const result = await updateSupplyCategory(
        "cat_1",
        {
          name: "Kağıt & Hijyen Güncel",
          description: "Yeni açıklama",
          displayOrder: 5,
        },
        { db: mockDb as never }
      );

      expect(result.success).toBe(true);
      expect(mockDb.supplyCategory.update).toHaveBeenCalledWith({
        where: { id: "cat_1" },
        data: {
          name: "Kağıt & Hijyen Güncel",
          description: "Yeni açıklama",
          displayOrder: 5,
        },
      });
    });
  });

  describe("toggleSupplyCategoryActive", () => {
    it("toggles active status", async () => {
      mockDb.supplyCategory.update.mockResolvedValue({
        ...sampleCategory1,
        isActive: false,
      });

      const result = await toggleSupplyCategoryActive("cat_1", false, mockDb as never);

      expect(result.success).toBe(true);
      expect(mockDb.supplyCategory.update).toHaveBeenCalledWith({
        where: { id: "cat_1" },
        data: { isActive: false },
      });
    });
  });

  describe("deleteSupplyCategory", () => {
    it("deletes category when productCount is 0", async () => {
      mockDb.supplyCategory.findUnique.mockResolvedValue(sampleCategory2);
      mockDb.supplyCategory.delete.mockResolvedValue(sampleCategory2);

      const result = await deleteSupplyCategory("cat_2", mockDb as never);

      expect(result.success).toBe(true);
      expect(mockDb.supplyCategory.delete).toHaveBeenCalledWith({
        where: { id: "cat_2" },
      });
    });

    it("prevents deletion and returns CATEGORY_HAS_PRODUCTS when category has products", async () => {
      mockDb.supplyCategory.findUnique.mockResolvedValue(sampleCategory1);

      const result = await deleteSupplyCategory("cat_1", mockDb as never);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CATEGORY_HAS_PRODUCTS");
      }
      expect(mockDb.supplyCategory.delete).not.toHaveBeenCalled();
    });
  });
});
