import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma, type SupplyProduct, type SupplyCategory } from "@prisma/client";
import {
  listAllSupplyProducts,
  listActiveSupplyProducts,
  getSupplyProductById,
  createSupplyProduct,
  updateSupplyProduct,
  toggleSupplyProductActive,
  deleteSupplyProduct,
} from "./admin-supply-product.service";

describe("Admin Supply Product Domain Service", () => {
  const sampleCategory: SupplyCategory = {
    id: "cat_1",
    slug: "kagit-hijyen",
    name: "Kağıt & Hijyen",
    description: "Kağıt grubu",
    displayOrder: 1,
    isActive: true,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };

  const sampleProduct1: SupplyProduct & {
    category: Pick<SupplyCategory, "id" | "name" | "slug">;
  } = {
    id: "prod_1",
    slug: "z-katlama-havlu",
    categoryId: "cat_1",
    category: {
      id: "cat_1",
      name: "Kağıt & Hijyen",
      slug: "kagit-hijyen",
    },
    name: "Z Katlama Havlu 200'lü",
    description: "Dispenser uyumlu havlu",
    unit: "12'li Koli",
    price: new Prisma.Decimal("320.00"),
    displayOrder: 1,
    isActive: true,
    imageUrl: "/images/havlu.jpg",
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };

  const sampleProduct2: SupplyProduct & {
    category: Pick<SupplyCategory, "id" | "name" | "slug">;
  } = {
    id: "prod_2",
    slug: "endustriyel-sivi-sabun-5l",
    categoryId: "cat_1",
    category: {
      id: "cat_1",
      name: "Kağıt & Hijyen",
      slug: "kagit-hijyen",
    },
    name: "Endüstriyel Sıvı Sabun 5L",
    description: null,
    unit: "5L Bidon",
    price: null,
    displayOrder: 2,
    isActive: false,
    imageUrl: null,
    createdAt: new Date("2026-08-02T10:00:00.000Z"),
    updatedAt: new Date("2026-08-02T10:00:00.000Z"),
  };

  type MockDb = {
    supplyProduct: {
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
    supplyCategory: {
      findUnique: ReturnType<typeof vi.fn>;
    };
  };

  let mockDb: MockDb;

  beforeEach(() => {
    mockDb = {
      supplyProduct: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      supplyCategory: {
        findUnique: vi.fn(),
      },
    };
  });

  describe("listAllSupplyProducts", () => {
    it("lists all products mapped to DTOs", async () => {
      mockDb.supplyProduct.findMany.mockResolvedValue([
        sampleProduct1,
        sampleProduct2,
      ]);

      const result = await listAllSupplyProducts(undefined, mockDb as never);

      expect(mockDb.supplyProduct.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: [
          { isActive: "desc" },
          { displayOrder: "asc" },
          { name: "asc" },
        ],
      });
      expect(result).toHaveLength(2);
      expect(result[0].price).toBe("320");
      expect(result[1].price).toBeNull();
    });

    it("filters by categoryId when provided", async () => {
      mockDb.supplyProduct.findMany.mockResolvedValue([sampleProduct1]);

      const result = await listAllSupplyProducts("cat_1", mockDb as never);

      expect(mockDb.supplyProduct.findMany).toHaveBeenCalledWith({
        where: { categoryId: "cat_1" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: [
          { isActive: "desc" },
          { displayOrder: "asc" },
          { name: "asc" },
        ],
      });
      expect(result).toHaveLength(1);
    });
  });

  describe("listActiveSupplyProducts", () => {
    it("queries active products with active categories", async () => {
      mockDb.supplyProduct.findMany.mockResolvedValue([sampleProduct1]);

      const result = await listActiveSupplyProducts(undefined, mockDb as never);

      expect(mockDb.supplyProduct.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          category: { isActive: true },
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      });
      expect(result).toHaveLength(1);
    });
  });

  describe("getSupplyProductById", () => {
    it("returns product DTO when found", async () => {
      mockDb.supplyProduct.findUnique.mockResolvedValue(sampleProduct1);

      const result = await getSupplyProductById("prod_1", mockDb as never);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("prod_1");
        expect(result.data.name).toBe("Z Katlama Havlu 200'lü");
      }
    });

    it("returns PRODUCT_NOT_FOUND when missing", async () => {
      mockDb.supplyProduct.findUnique.mockResolvedValue(null);

      const result = await getSupplyProductById("prod_999", mockDb as never);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
      }
    });
  });

  describe("createSupplyProduct", () => {
    it("validates category existence and creates product", async () => {
      mockDb.supplyCategory.findUnique.mockResolvedValue(sampleCategory);
      mockDb.supplyProduct.create.mockResolvedValue(sampleProduct1);

      const result = await createSupplyProduct(
        {
          categoryId: "cat_1",
          name: "Z Katlama Havlu 200'lü",
          description: "Dispenser uyumlu havlu",
          unit: "12'li Koli",
          price: "320.00",
          displayOrder: 1,
          imageUrl: "/images/havlu.jpg",
          isActive: true,
        },
        { db: mockDb as never }
      );

      expect(result.success).toBe(true);
      expect(mockDb.supplyProduct.create).toHaveBeenCalled();
    });

    it("returns CATEGORY_NOT_FOUND if category does not exist", async () => {
      mockDb.supplyCategory.findUnique.mockResolvedValue(null);

      const result = await createSupplyProduct(
        {
          categoryId: "cat_missing",
          name: "Yeni Ürün",
          unit: "Koli",
        },
        { db: mockDb as never }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CATEGORY_NOT_FOUND");
      }
      expect(mockDb.supplyProduct.create).not.toHaveBeenCalled();
    });
  });

  describe("updateSupplyProduct", () => {
    it("updates product with validated category and fields", async () => {
      mockDb.supplyCategory.findUnique.mockResolvedValue(sampleCategory);
      mockDb.supplyProduct.update.mockResolvedValue(sampleProduct1);

      const result = await updateSupplyProduct(
        "prod_1",
        {
          categoryId: "cat_1",
          name: "Z Katlama Havlu 200'lü (Güncel)",
          unit: "16'lı Koli",
          price: "400.00",
        },
        { db: mockDb as never }
      );

      expect(result.success).toBe(true);
      expect(mockDb.supplyProduct.update).toHaveBeenCalled();
    });
  });

  describe("toggleSupplyProductActive", () => {
    it("toggles product active status", async () => {
      mockDb.supplyProduct.update.mockResolvedValue({
        ...sampleProduct1,
        isActive: false,
      });

      const result = await toggleSupplyProductActive("prod_1", false, mockDb as never);

      expect(result.success).toBe(true);
      expect(mockDb.supplyProduct.update).toHaveBeenCalledWith({
        where: { id: "prod_1" },
        data: { isActive: false },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      });
    });
  });

  describe("deleteSupplyProduct", () => {
    it("deletes product successfully", async () => {
      mockDb.supplyProduct.delete.mockResolvedValue(sampleProduct1);

      const result = await deleteSupplyProduct("prod_1", mockDb as never);

      expect(result.success).toBe(true);
      expect(mockDb.supplyProduct.delete).toHaveBeenCalledWith({
        where: { id: "prod_1" },
      });
    });
  });
});
