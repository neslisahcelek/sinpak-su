import { describe, it, expect } from "vitest";
import { ProductType } from "@prisma/client";
import {
  createProductSchema,
  updateProductSchema,
  toggleProductActiveSchema,
} from "./admin-product.schema";

describe("Admin Product Validation Schemas", () => {
  describe("createProductSchema", () => {
    const validDamacana = {
      name: "19L Damacana Su",
      description: "Doğal kaynak suyu damacana.",
      type: ProductType.DAMACANA_WATER,
      price: "180.00",
      depositAmount: "180.00",
      imageUrl: "/images/damacana.png",
      isActive: true,
    };

    const validBeverage = {
      name: "1.5L Coca-Cola",
      description: "1.5 Litre soğuk içecek.",
      type: ProductType.BEVERAGE,
      price: 60,
      depositAmount: 0,
      imageUrl: "https://example.com/coke.png",
    };

    it("accepts valid damacana product with positive deposit", () => {
      const result = createProductSchema.safeParse(validDamacana);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("19L Damacana Su");
        expect(result.data.price).toBe("180.00");
        expect(result.data.depositAmount).toBe("180.00");
        expect(result.data.imageUrl).toBe("/images/damacana.png");
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts valid beverage product and defaults isActive to true", () => {
      const result = createProductSchema.safeParse(validBeverage);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.depositAmount).toBe("0");
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts damacana with 0 deposit", () => {
      const payload = { ...validDamacana, depositAmount: "0.00" };
      const result = createProductSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("rejects non-zero deposit for BOTTLED_WATER and BEVERAGE", () => {
      const invalidBottled = {
        name: "5L Pet Su",
        description: "5L kaynak suyu",
        type: ProductType.BOTTLED_WATER,
        price: "25.00",
        depositAmount: "10.00", // Not allowed
      };
      const result = createProductSchema.safeParse(invalidBottled);
      expect(result.success).toBe(false);

      const invalidBeverage = {
        ...validBeverage,
        depositAmount: "5.00", // Not allowed
      };
      const result2 = createProductSchema.safeParse(invalidBeverage);
      expect(result2.success).toBe(false);
    });

    it("rejects zero or negative price", () => {
      expect(
        createProductSchema.safeParse({ ...validDamacana, price: "0" }).success
      ).toBe(false);
      expect(
        createProductSchema.safeParse({ ...validDamacana, price: "-10.00" })
          .success
      ).toBe(false);
      expect(
        createProductSchema.safeParse({ ...validDamacana, price: 0 }).success
      ).toBe(false);
    });

    it("rejects prices exceeding 100,000 TL", () => {
      expect(
        createProductSchema.safeParse({ ...validDamacana, price: "100000.01" })
          .success
      ).toBe(false);
    });

    it("rejects prices with more than 2 decimal places", () => {
      expect(
        createProductSchema.safeParse({ ...validDamacana, price: "50.123" })
          .success
      ).toBe(false);
    });

    it("rejects name shorter than 2 or longer than 100 characters", () => {
      expect(
        createProductSchema.safeParse({ ...validDamacana, name: "A" }).success
      ).toBe(false);
      expect(
        createProductSchema.safeParse({
          ...validDamacana,
          name: "A".repeat(101),
        }).success
      ).toBe(false);
    });

    it("rejects description shorter than 2 or longer than 1000 characters", () => {
      expect(
        createProductSchema.safeParse({ ...validDamacana, description: "A" })
          .success
      ).toBe(false);
      expect(
        createProductSchema.safeParse({
          ...validDamacana,
          description: "A".repeat(1001),
        }).success
      ).toBe(false);
    });

    it("handles image URLs properly (http, https, relative path, or null)", () => {
      expect(
        createProductSchema.safeParse({
          ...validDamacana,
          imageUrl: "http://example.com/img.jpg",
        }).success
      ).toBe(true);
      expect(
        createProductSchema.safeParse({
          ...validDamacana,
          imageUrl: "https://example.com/img.jpg",
        }).success
      ).toBe(true);
      expect(
        createProductSchema.safeParse({
          ...validDamacana,
          imageUrl: "/images/water.jpg",
        }).success
      ).toBe(true);
      expect(
        createProductSchema.safeParse({ ...validDamacana, imageUrl: "" }).data
          ?.imageUrl
      ).toBeNull();
      expect(
        createProductSchema.safeParse({ ...validDamacana, imageUrl: null }).data
          ?.imageUrl
      ).toBeNull();

      // Invalid schemes
      expect(
        createProductSchema.safeParse({
          ...validDamacana,
          imageUrl: "ftp://example.com/img.jpg",
        }).success
      ).toBe(false);
      expect(
        createProductSchema.safeParse({
          ...validDamacana,
          imageUrl: "javascript:alert(1)",
        }).success
      ).toBe(false);
    });
  });

  describe("updateProductSchema", () => {
    it("requires product id", () => {
      const payload = {
        id: "prod_123",
        name: "Güncel Ürün",
        description: "Güncel açıklama",
        type: ProductType.BEVERAGE,
        price: "45.00",
        depositAmount: "0.00",
        isActive: false,
      };

      const result = updateProductSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("prod_123");
        expect(result.data.isActive).toBe(false);
      }

      const missingId = { ...payload, id: "" };
      expect(updateProductSchema.safeParse(missingId).success).toBe(false);
    });
  });

  describe("toggleProductActiveSchema", () => {
    it("validates id and boolean isActive", () => {
      expect(
        toggleProductActiveSchema.safeParse({ id: "p1", isActive: false })
          .success
      ).toBe(true);
      expect(
        toggleProductActiveSchema.safeParse({ id: "p1", isActive: true })
          .success
      ).toBe(true);
      expect(
        toggleProductActiveSchema.safeParse({ id: "", isActive: true }).success
      ).toBe(false);
      expect(toggleProductActiveSchema.safeParse({ id: "p1" }).success).toBe(
        false
      );
    });
  });
});
