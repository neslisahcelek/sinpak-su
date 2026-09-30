import { describe, it, expect } from "vitest";
import {
  createSupplyCategorySchema,
  updateSupplyCategorySchema,
  toggleSupplyCategoryActiveSchema,
  deleteSupplyCategorySchema,
  createSupplyProductSchema,
  updateSupplyProductSchema,
  toggleSupplyProductActiveSchema,
  deleteSupplyProductSchema,
} from "./admin-supply.schema";

describe("Admin Supply Validation Schemas", () => {
  describe("Category Schemas", () => {
    const validCategory = {
      name: "Kağıt & Hijyen",
      description: "Ofis ve işletmeler için kağıt havlu ve peçete ürünleri.",
      displayOrder: 1,
      isActive: true,
    };

    it("accepts valid category input", () => {
      const result = createSupplyCategorySchema.safeParse(validCategory);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Kağıt & Hijyen");
        expect(result.data.displayOrder).toBe(1);
        expect(result.data.isActive).toBe(true);
      }
    });

    it("defaults displayOrder to 0 and isActive to true", () => {
      const result = createSupplyCategorySchema.safeParse({
        name: "Temizlik Kimyasalları",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.displayOrder).toBe(0);
        expect(result.data.isActive).toBe(true);
        expect(result.data.description).toBeNull();
      }
    });

    it("rejects short or empty category name", () => {
      expect(
        createSupplyCategorySchema.safeParse({ name: "A" }).success
      ).toBe(false);
      expect(
        createSupplyCategorySchema.safeParse({ name: "" }).success
      ).toBe(false);
    });

    it("validates updateSupplyCategorySchema requires id", () => {
      const result = updateSupplyCategorySchema.safeParse({
        id: "cat_123",
        name: "Ambalaj & Çöp Torbası",
      });
      expect(result.success).toBe(true);

      const missingId = updateSupplyCategorySchema.safeParse({
        name: "Ambalaj & Çöp Torbası",
      });
      expect(missingId.success).toBe(false);
    });

    it("validates toggle and delete category schemas", () => {
      expect(
        toggleSupplyCategoryActiveSchema.safeParse({
          id: "cat_1",
          isActive: false,
        }).success
      ).toBe(true);
      expect(
        deleteSupplyCategorySchema.safeParse({ id: "cat_1" }).success
      ).toBe(true);
      expect(
        deleteSupplyCategorySchema.safeParse({ id: "" }).success
      ).toBe(false);
    });
  });

  describe("Product Schemas", () => {
    const validProduct = {
      categoryId: "cat_123",
      name: "Z Katlama Dispenser Havlu",
      description: "200 yaprak çift katlı Z katlama kağıt havlu.",
      unit: "12'li Koli",
      price: "350.00",
      displayOrder: 2,
      imageUrl: "/images/havlu.jpg",
      isActive: true,
    };

    it("accepts valid supply product with price", () => {
      const result = createSupplyProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Z Katlama Dispenser Havlu");
        expect(result.data.unit).toBe("12'li Koli");
        expect(result.data.price).toBe("350.00");
        expect(result.data.displayOrder).toBe(2);
      }
    });

    it("accepts supply product without price (null / quote based)", () => {
      const result = createSupplyProductSchema.safeParse({
        categoryId: "cat_123",
        name: "Endüstriyel Köpük Sabun 5L",
        price: "",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBeNull();
        expect(result.data.unit).toBeNull();
      }
    });

    it("rejects invalid price formats", () => {
      expect(
        createSupplyProductSchema.safeParse({
          ...validProduct,
          price: "-50.00",
        }).success
      ).toBe(false);
      expect(
        createSupplyProductSchema.safeParse({
          ...validProduct,
          price: "0",
        }).success
      ).toBe(false);
      expect(
        createSupplyProductSchema.safeParse({
          ...validProduct,
          price: "12.345",
        }).success
      ).toBe(false);
    });

    it("requires categoryId and valid name", () => {
      expect(
        createSupplyProductSchema.safeParse({
          ...validProduct,
          categoryId: "",
        }).success
      ).toBe(false);
      expect(
        createSupplyProductSchema.safeParse({
          ...validProduct,
          name: "A",
        }).success
      ).toBe(false);
    });

    it("validates updateSupplyProductSchema", () => {
      const result = updateSupplyProductSchema.safeParse({
        id: "prod_1",
        ...validProduct,
      });
      expect(result.success).toBe(true);

      const missingId = updateSupplyProductSchema.safeParse(validProduct);
      expect(missingId.success).toBe(false);
    });

    it("validates toggle and delete supply product schemas", () => {
      expect(
        toggleSupplyProductActiveSchema.safeParse({
          id: "prod_1",
          isActive: true,
        }).success
      ).toBe(true);
      expect(
        deleteSupplyProductSchema.safeParse({ id: "prod_1" }).success
      ).toBe(true);
      expect(
        deleteSupplyProductSchema.safeParse({ id: "" }).success
      ).toBe(false);
    });
  });
});
