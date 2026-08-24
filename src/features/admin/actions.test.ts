import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderStatus, ProductType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import * as adminOrderService from "@/server/services/admin-order.service";
import * as adminProductService from "@/server/services/admin-product.service";
import {
  loginAdminAction,
  logoutAdminAction,
  getAdminSessionAction,
  updateOrderStatusAction,
  createProductAction,
  updateProductAction,
  toggleProductActiveAction,
} from "./actions";

// Mock next/headers cookies
const mockCookieMap = new Map<string, { value: string; options?: unknown }>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => {
      const entry = mockCookieMap.get(name);
      return entry ? { value: entry.value } : undefined;
    },
    set: (name: string, value: string, options?: unknown) => {
      mockCookieMap.set(name, { value, options });
    },
    delete: (name: string) => {
      mockCookieMap.delete(name);
    },
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Admin Authentication Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookieMap.clear();
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "testpassword123";
    process.env.AUTH_SECRET = "test-secret-key-1234567890123456";
  });

  it("should successfully log in with valid credentials and establish session cookie", async () => {
    const result = await loginAdminAction({
      username: "admin",
      password: "testpassword123",
    });

    expect(result.success).toBe(true);
    expect(mockCookieMap.has("sinpak_admin_session")).toBe(true);

    const sessionCheck = await getAdminSessionAction();
    expect(sessionCheck.success).toBe(true);
    if (sessionCheck.success) {
      expect(sessionCheck.data.authenticated).toBe(true);
      expect(sessionCheck.data.username).toBe("admin");
    }
  });

  it("should reject login with invalid password", async () => {
    const result = await loginAdminAction({
      username: "admin",
      password: "wrongpassword",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("INVALID_CREDENTIALS");
    }
    expect(mockCookieMap.has("sinpak_admin_session")).toBe(false);
  });

  it("should reject login with empty input schema", async () => {
    const result = await loginAdminAction({
      username: "",
      password: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
    }
  });

  it("should log out and remove session cookie", async () => {
    // First log in
    await loginAdminAction({
      username: "admin",
      password: "testpassword123",
    });
    expect(mockCookieMap.has("sinpak_admin_session")).toBe(true);

    // Then log out
    const logoutResult = await logoutAdminAction();
    expect(logoutResult.success).toBe(true);
    expect(mockCookieMap.has("sinpak_admin_session")).toBe(false);

    const sessionCheck = await getAdminSessionAction();
    expect(sessionCheck.success).toBe(true);
    if (sessionCheck.success) {
      expect(sessionCheck.data.authenticated).toBe(false);
    }
  });

  describe("updateOrderStatusAction", () => {
    it("should reject update when user is unauthenticated", async () => {
      // No login session established
      const result = await updateOrderStatusAction({
        publicId: "ord_pub_123",
        nextStatus: OrderStatus.CONFIRMED,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("UNAUTHORIZED");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should reject update with invalid schema", async () => {
      // Log in first
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const result = await updateOrderStatusAction({
        publicId: "",
        nextStatus: "INVALID_STATUS" as unknown as OrderStatus,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should delegate to updateOrderStatus and call revalidatePath on success", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const mockUpdatedResult = {
        publicId: "ord_pub_123",
        status: OrderStatus.CONFIRMED,
        deliveredAt: null,
        cancelledAt: null,
        updatedAt: new Date("2026-08-23T12:00:00.000Z"),
      };

      const updateSpy = vi
        .spyOn(adminOrderService, "updateOrderStatus")
        .mockResolvedValueOnce({
          success: true,
          data: mockUpdatedResult,
        });

      const result = await updateOrderStatusAction({
        publicId: "ord_pub_123",
        nextStatus: OrderStatus.CONFIRMED,
      });

      expect(updateSpy).toHaveBeenCalledWith("ord_pub_123", OrderStatus.CONFIRMED);
      expect(revalidatePath).toHaveBeenCalledWith("/admin/orders");
      expect(result).toEqual({
        success: true,
        data: mockUpdatedResult,
      });
    });

    it("should return service error and not call revalidatePath on failure", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const updateSpy = vi
        .spyOn(adminOrderService, "updateOrderStatus")
        .mockResolvedValueOnce({
          success: false,
          error: {
            code: "CONCURRENT_MODIFICATION",
            message: "Sipariş durumu başka bir işlem tarafından güncellendi.",
          },
        });

      const result = await updateOrderStatusAction({
        publicId: "ord_pub_123",
        nextStatus: OrderStatus.CONFIRMED,
      });

      expect(updateSpy).toHaveBeenCalledWith("ord_pub_123", OrderStatus.CONFIRMED);
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CONCURRENT_MODIFICATION");
      }
    });
  });

  describe("createProductAction", () => {
    const validCreatePayload = {
      name: "19L Doğal Damacana",
      description: "Doğal kaynak suyu",
      type: ProductType.DAMACANA_WATER,
      price: "180.00",
      depositAmount: "180.00",
      imageUrl: "/images/damacana.png",
      isActive: true,
    };

    const mockCreatedProduct = {
      id: "prod_new_1",
      slug: "19l-dogal-damacana",
      type: ProductType.DAMACANA_WATER,
      name: "19L Doğal Damacana",
      description: "Doğal kaynak suyu",
      price: "180",
      depositAmount: "180",
      imageUrl: "/images/damacana.png",
      isActive: true,
      createdAt: new Date("2026-08-24T12:00:00.000Z"),
      updatedAt: new Date("2026-08-24T12:00:00.000Z"),
    };

    it("should reject creation when unauthenticated with UNAUTHORIZED", async () => {
      const result = await createProductAction(validCreatePayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("UNAUTHORIZED");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should reject creation with invalid schema (VALIDATION_ERROR)", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const invalidPayload = {
        ...validCreatePayload,
        price: "-10.00",
      };

      const result = await createProductAction(invalidPayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should delegate to createProduct and revalidate paths on success", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const createSpy = vi
        .spyOn(adminProductService, "createProduct")
        .mockResolvedValueOnce({
          success: true,
          data: mockCreatedProduct,
        });

      const result = await createProductAction(validCreatePayload);

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "19L Doğal Damacana",
          price: "180.00",
          depositAmount: "180.00",
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith("/admin/products");
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/checkout");
      expect(revalidatePath).toHaveBeenCalledWith("/urunler/19l-dogal-damacana");
      expect(result).toEqual({
        success: true,
        data: mockCreatedProduct,
      });
    });

    it("should propagate service error and not revalidate on service failure", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      vi.spyOn(adminProductService, "createProduct").mockResolvedValueOnce({
        success: false,
        error: {
          code: "SLUG_COLLISION",
          message: "Slug oluşturulamadı.",
        },
      });

      const result = await createProductAction(validCreatePayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("SLUG_COLLISION");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("updateProductAction", () => {
    const validUpdatePayload = {
      id: "prod_new_1",
      name: "19L Damacana Güncellendi",
      description: "Güncellenmiş açıklama",
      type: ProductType.DAMACANA_WATER,
      price: "190.00",
      depositAmount: "190.00",
      imageUrl: "/images/damacana-v2.png",
      isActive: true,
    };

    const mockUpdatedProduct = {
      id: "prod_new_1",
      slug: "19l-dogal-damacana",
      type: ProductType.DAMACANA_WATER,
      name: "19L Damacana Güncellendi",
      description: "Güncellenmiş açıklama",
      price: "190",
      depositAmount: "190",
      imageUrl: "/images/damacana-v2.png",
      isActive: true,
      createdAt: new Date("2026-08-24T12:00:00.000Z"),
      updatedAt: new Date("2026-08-24T12:30:00.000Z"),
    };

    it("should reject update when unauthenticated with UNAUTHORIZED", async () => {
      const result = await updateProductAction(validUpdatePayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("UNAUTHORIZED");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should reject update with invalid schema (VALIDATION_ERROR)", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const invalidPayload = {
        ...validUpdatePayload,
        name: "A", // too short
      };

      const result = await updateProductAction(invalidPayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should delegate to updateProduct and revalidate paths on success", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const updateSpy = vi
        .spyOn(adminProductService, "updateProduct")
        .mockResolvedValueOnce({
          success: true,
          data: mockUpdatedProduct,
        });

      const result = await updateProductAction(validUpdatePayload);

      expect(updateSpy).toHaveBeenCalledWith(
        "prod_new_1",
        expect.objectContaining({
          name: "19L Damacana Güncellendi",
          price: "190.00",
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith("/admin/products");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/products/prod_new_1/edit");
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/checkout");
      expect(revalidatePath).toHaveBeenCalledWith("/urunler/19l-dogal-damacana");
      expect(result).toEqual({
        success: true,
        data: mockUpdatedProduct,
      });
    });

    it("should propagate PRODUCT_NOT_FOUND error from service and skip revalidation", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      vi.spyOn(adminProductService, "updateProduct").mockResolvedValueOnce({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Ürün bulunamadı.",
        },
      });

      const result = await updateProductAction(validUpdatePayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("toggleProductActiveAction", () => {
    const validTogglePayload = {
      id: "prod_new_1",
      isActive: false,
    };

    const mockToggledProduct = {
      id: "prod_new_1",
      slug: "19l-dogal-damacana",
      type: ProductType.DAMACANA_WATER,
      name: "19L Doğal Damacana",
      description: "Doğal kaynak suyu",
      price: "180",
      depositAmount: "180",
      imageUrl: "/images/damacana.png",
      isActive: false,
      createdAt: new Date("2026-08-24T12:00:00.000Z"),
      updatedAt: new Date("2026-08-24T12:30:00.000Z"),
    };

    it("should reject toggle when unauthenticated with UNAUTHORIZED", async () => {
      const result = await toggleProductActiveAction(validTogglePayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("UNAUTHORIZED");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should reject toggle with invalid schema (empty id)", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const result = await toggleProductActiveAction({
        id: "",
        isActive: false,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should delegate to toggleProductActive and revalidate paths on success", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      const toggleSpy = vi
        .spyOn(adminProductService, "toggleProductActive")
        .mockResolvedValueOnce({
          success: true,
          data: mockToggledProduct,
        });

      const result = await toggleProductActiveAction(validTogglePayload);

      expect(toggleSpy).toHaveBeenCalledWith("prod_new_1", false);
      expect(revalidatePath).toHaveBeenCalledWith("/admin/products");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/products/prod_new_1/edit");
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/checkout");
      expect(revalidatePath).toHaveBeenCalledWith("/urunler/19l-dogal-damacana");
      expect(result).toEqual({
        success: true,
        data: mockToggledProduct,
      });
    });

    it("should propagate PRODUCT_NOT_FOUND error on missing product", async () => {
      await loginAdminAction({
        username: "admin",
        password: "testpassword123",
      });

      vi.spyOn(adminProductService, "toggleProductActive").mockResolvedValueOnce({
        success: false,
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "Ürün bulunamadı.",
        },
      });

      const result = await toggleProductActiveAction(validTogglePayload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});


