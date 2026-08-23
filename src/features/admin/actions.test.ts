import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import * as adminOrderService from "@/server/services/admin-order.service";
import {
  loginAdminAction,
  logoutAdminAction,
  getAdminSessionAction,
  updateOrderStatusAction,
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
});

