import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  bulkImportProductsAction,
  bulkImportSupplyProductsAction,
} from "./bulk-import-actions";
import * as authSession from "@/server/auth/session";
import * as bulkImportService from "@/server/services/admin-bulk-import.service";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("bulk-import-actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("bulkImportProductsAction", () => {
    it("rejects unauthorized access when session is missing", async () => {
      vi.spyOn(authSession, "getAdminSession").mockResolvedValue(null);

      const result = await bulkImportProductsAction({
        products: [
          {
            name: "Erikli Su",
            price: "120.00",
            type: "BOTTLED_WATER",
            depositAmount: "0",
            description: "",
            imageUrl: null,
            displayOrder: 0,
          },
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("UNAUTHORIZED");
      }
    });

    it("successfully delegates valid products when authenticated", async () => {
      vi.spyOn(authSession, "getAdminSession").mockResolvedValue({
        username: "admin",
        role: "ADMIN",
        createdAt: Date.now(),
        expiresAt: Date.now() + 100000,
      });

      const spyService = vi
        .spyOn(bulkImportService, "bulkImportProducts")
        .mockResolvedValueOnce({
          success: true,
          data: {
            totalProcessed: 1,
            createdCount: 1,
            updatedCount: 0,
            errors: [],
          },
        });

      const result = await bulkImportProductsAction({
        products: [
          {
            name: "Erikli Su 0.5L",
            price: "120.00",
            type: "BOTTLED_WATER",
            depositAmount: "0",
            description: "",
            imageUrl: null,
            displayOrder: 0,
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe("bulkImportSupplyProductsAction", () => {
    it("successfully delegates valid supply products when authenticated", async () => {
      vi.spyOn(authSession, "getAdminSession").mockResolvedValue({
        username: "admin",
        role: "ADMIN",
        createdAt: Date.now(),
        expiresAt: Date.now() + 100000,
      });

      const spyService = vi
        .spyOn(bulkImportService, "bulkImportSupplyProducts")
        .mockResolvedValueOnce({
          success: true,
          data: {
            totalProcessed: 1,
            createdCount: 1,
            updatedCount: 0,
            errors: [],
          },
        });

      const result = await bulkImportSupplyProductsAction({
        products: [
          {
            name: "Çaykur Rize Çay 1kg",
            categoryName: "Sıcak İçecekler",
            unit: "Koli",
            price: "1200.00",
            description: "",
            imageUrl: null,
            displayOrder: 0,
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(spyService).toHaveBeenCalled();
    });
  });
});
