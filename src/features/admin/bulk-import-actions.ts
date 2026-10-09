"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/server/auth/session";
import {
  bulkImportProductsInputSchema,
  bulkImportSupplyProductsInputSchema,
  type BulkImportProductsInput,
  type BulkImportSupplyProductsInput,
} from "@/server/validation/admin-bulk-import.schema";
import {
  bulkImportProducts,
  bulkImportSupplyProducts,
  type BulkImportSummary,
} from "@/server/services/admin-bulk-import.service";
import { err, makeSafeError, type Result } from "@/server/types/result";

/**
 * Server action to bulk import retail water/beverage products from Excel data.
 */
export async function bulkImportProductsAction(
  rawInput: BulkImportProductsInput
): Promise<Result<BulkImportSummary>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = bulkImportProductsInputSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz içe aktarma verisi.",
        validationResult.error.flatten()
      )
    );
  }

  const result = await bulkImportProducts(validationResult.data);

  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/checkout");
  }

  return result;
}

/**
 * Server action to bulk import institutional supply products from Excel data.
 */
export async function bulkImportSupplyProductsAction(
  rawInput: BulkImportSupplyProductsInput
): Promise<Result<BulkImportSummary>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult =
    bulkImportSupplyProductsInputSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz içe aktarma verisi.",
        validationResult.error.flatten()
      )
    );
  }

  const result = await bulkImportSupplyProducts(validationResult.data);

  if (result.success) {
    revalidatePath("/admin/tedarik/products");
    revalidatePath("/admin/tedarik/categories");
    revalidatePath("/kurumsal-tedarik");
    revalidatePath("/kurumsal-tedarik/urunler");
  }

  return result;
}
