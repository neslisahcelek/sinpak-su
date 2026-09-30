import { describe, it, expect, vi, beforeEach } from "vitest";
import { revalidatePath } from "next/cache";
import * as adminSupplyCategoryService from "@/server/services/admin-supply-category.service";
import * as adminSupplyProductService from "@/server/services/admin-supply-product.service";
import * as sessionModule from "@/server/auth/session";
import {
  createSupplyCategoryAction,
  updateSupplyCategoryAction,
  toggleSupplyCategoryActiveAction,
  deleteSupplyCategoryAction,
  createSupplyProductAction,
  updateSupplyProductAction,
  toggleSupplyProductActiveAction,
  deleteSupplyProductAction,
} from "./supply-actions";
import { ok, err, makeSafeError } from "@/server/types/result";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Admin Supply Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(sessionModule, "getAdminSession").mockResolvedValue({
      username: "admin",
      role: "ADMIN",
      createdAt: Date.now(),
      expiresAt: Date.now() + 100000,
    });
  });

  describe("Category Actions", () => {
    const mockCategoryDto: adminSupplyCategoryService.SupplyCategoryDto = {
      id: "cat_1",
      slug: "kagit-hijyen",
      name: "Kağıt & Hijyen",
      description: "Kağıt havlular",
      displayOrder: 1,
      isActive: true,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("requires authenticated admin session", async () => {
      vi.spyOn(sessionModule, "getAdminSession").mockResolvedValue(null);

      const result = await createSupplyCategoryAction({ name: "Test" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("UNAUTHORIZED");
      }
    });

    it("creates category and revalidates paths on success", async () => {
      vi.spyOn(
        adminSupplyCategoryService,
        "createSupplyCategory"
      ).mockResolvedValue(ok(mockCategoryDto));

      const result = await createSupplyCategoryAction({
        name: "Kağıt & Hijyen",
        description: "Kağıt havlular",
        displayOrder: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith(
        "/admin/tedarik/categories"
      );
      expect(revalidatePath).toHaveBeenCalledWith("/kurumsal-tedarik");
      expect(revalidatePath).toHaveBeenCalledWith("/kurumsal-tedarik/urunler");
    });

    it("updates category and revalidates paths on success", async () => {
      vi.spyOn(
        adminSupplyCategoryService,
        "updateSupplyCategory"
      ).mockResolvedValue(ok(mockCategoryDto));

      const result = await updateSupplyCategoryAction({
        id: "cat_1",
        name: "Kağıt & Hijyen Güncel",
      });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith(
        "/admin/tedarik/categories"
      );
    });

    it("toggles category status and revalidates paths", async () => {
      vi.spyOn(
        adminSupplyCategoryService,
        "toggleSupplyCategoryActive"
      ).mockResolvedValue(ok(mockCategoryDto));

      const result = await toggleSupplyCategoryActiveAction({
        id: "cat_1",
        isActive: false,
      });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith(
        "/admin/tedarik/categories"
      );
    });

    it("deletes category when empty and revalidates paths", async () => {
      vi.spyOn(
        adminSupplyCategoryService,
        "deleteSupplyCategory"
      ).mockResolvedValue(ok({ success: true }));

      const result = await deleteSupplyCategoryAction({ id: "cat_1" });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith(
        "/admin/tedarik/categories"
      );
    });

    it("handles deletion rejection when category has products", async () => {
      vi.spyOn(
        adminSupplyCategoryService,
        "deleteSupplyCategory"
      ).mockResolvedValue(
        err(
          makeSafeError(
            "CATEGORY_HAS_PRODUCTS",
            "Bu kategoriye bağlı ürünler bulunmaktadır."
          )
        )
      );

      const result = await deleteSupplyCategoryAction({ id: "cat_1" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CATEGORY_HAS_PRODUCTS");
      }
    });
  });

  describe("Product Actions", () => {
    const mockProductDto: adminSupplyProductService.SupplyProductDto = {
      id: "prod_1",
      slug: "z-katlama-havlu",
      categoryId: "cat_1",
      name: "Z Katlama Havlu",
      description: "Açıklama",
      unit: "12'li Koli",
      price: "350.00",
      displayOrder: 1,
      isActive: true,
      imageUrl: "/images/havlu.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("creates product and revalidates paths on success", async () => {
      vi.spyOn(
        adminSupplyProductService,
        "createSupplyProduct"
      ).mockResolvedValue(ok(mockProductDto));

      const result = await createSupplyProductAction({
        categoryId: "cat_1",
        name: "Z Katlama Havlu",
        unit: "12'li Koli",
        price: "350.00",
      });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/admin/tedarik/products");
      expect(revalidatePath).toHaveBeenCalledWith("/kurumsal-tedarik");
      expect(revalidatePath).toHaveBeenCalledWith("/kurumsal-tedarik/urunler");
    });

    it("updates product and revalidates paths on success", async () => {
      vi.spyOn(
        adminSupplyProductService,
        "updateSupplyProduct"
      ).mockResolvedValue(ok(mockProductDto));

      const result = await updateSupplyProductAction({
        id: "prod_1",
        categoryId: "cat_1",
        name: "Z Katlama Havlu Güncel",
      });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/admin/tedarik/products");
    });

    it("toggles product active status", async () => {
      vi.spyOn(
        adminSupplyProductService,
        "toggleSupplyProductActive"
      ).mockResolvedValue(ok(mockProductDto));

      const result = await toggleSupplyProductActiveAction({
        id: "prod_1",
        isActive: false,
      });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/admin/tedarik/products");
    });

    it("deletes product and revalidates paths", async () => {
      vi.spyOn(
        adminSupplyProductService,
        "deleteSupplyProduct"
      ).mockResolvedValue(ok({ success: true }));

      const result = await deleteSupplyProductAction({ id: "prod_1" });

      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith("/admin/tedarik/products");
    });
  });
});
