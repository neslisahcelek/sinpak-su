"use server";

import { revalidatePath } from "next/cache";
import {
  createSupplyCategorySchema,
  updateSupplyCategorySchema,
  toggleSupplyCategoryActiveSchema,
  deleteSupplyCategorySchema,
  createSupplyProductSchema,
  updateSupplyProductSchema,
  toggleSupplyProductActiveSchema,
  deleteSupplyProductSchema,
  type CreateSupplyCategoryInput,
  type UpdateSupplyCategoryInput,
  type ToggleSupplyCategoryActiveInput,
  type DeleteSupplyCategoryInput,
  type CreateSupplyProductInput,
  type UpdateSupplyProductInput,
  type ToggleSupplyProductActiveInput,
  type DeleteSupplyProductInput,
} from "@/server/validation/admin-supply.schema";
import { getAdminSession } from "@/server/auth/session";
import {
  createSupplyCategory,
  updateSupplyCategory,
  toggleSupplyCategoryActive,
  deleteSupplyCategory,
  type SupplyCategoryDto,
} from "@/server/services/admin-supply-category.service";
import {
  createSupplyProduct,
  updateSupplyProduct,
  toggleSupplyProductActive,
  deleteSupplyProduct,
  type SupplyProductDto,
} from "@/server/services/admin-supply-product.service";
import { err, makeSafeError, type Result } from "@/server/types/result";

function revalidateSupplyPaths() {
  revalidatePath("/admin/tedarik/categories");
  revalidatePath("/admin/tedarik/products");
  revalidatePath("/kurumsal-tedarik");
  revalidatePath("/kurumsal-tedarik/urunler");
}

// ==========================================
// CATEGORY ACTIONS
// ==========================================

export async function createSupplyCategoryAction(
  rawInput: CreateSupplyCategoryInput
): Promise<Result<SupplyCategoryDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = createSupplyCategorySchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz kategori bilgileri.",
        validationResult.error.flatten()
      )
    );
  }

  const result = await createSupplyCategory(validationResult.data);
  if (result.success) {
    revalidateSupplyPaths();
  }

  return result;
}

export async function updateSupplyCategoryAction(
  rawInput: UpdateSupplyCategoryInput
): Promise<Result<SupplyCategoryDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = updateSupplyCategorySchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz kategori güncelleme bilgileri.",
        validationResult.error.flatten()
      )
    );
  }

  const { id, ...input } = validationResult.data;
  const result = await updateSupplyCategory(id, input);
  if (result.success) {
    revalidateSupplyPaths();
  }

  return result;
}

export async function toggleSupplyCategoryActiveAction(
  rawInput: ToggleSupplyCategoryActiveInput
): Promise<Result<SupplyCategoryDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult =
    toggleSupplyCategoryActiveSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz durum güncelleme bilgileri.",
        validationResult.error.flatten()
      )
    );
  }

  const { id, isActive } = validationResult.data;
  const result = await toggleSupplyCategoryActive(id, isActive);
  if (result.success) {
    revalidateSupplyPaths();
  }

  return result;
}

export async function deleteSupplyCategoryAction(
  rawInput: DeleteSupplyCategoryInput
): Promise<Result<{ success: true }>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = deleteSupplyCategorySchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz silme isteği.",
        validationResult.error.flatten()
      )
    );
  }

  const result = await deleteSupplyCategory(validationResult.data.id);
  if (result.success) {
    revalidateSupplyPaths();
  }

  return result;
}

// ==========================================
// PRODUCT ACTIONS
// ==========================================

export async function createSupplyProductAction(
  rawInput: CreateSupplyProductInput
): Promise<Result<SupplyProductDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = createSupplyProductSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz ürün bilgileri.",
        validationResult.error.flatten()
      )
    );
  }

  const result = await createSupplyProduct(validationResult.data);
  if (result.success) {
    revalidateSupplyPaths();
  }

  return result;
}

export async function updateSupplyProductAction(
  rawInput: UpdateSupplyProductInput
): Promise<Result<SupplyProductDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = updateSupplyProductSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz ürün güncelleme bilgileri.",
        validationResult.error.flatten()
      )
    );
  }

  const { id, ...input } = validationResult.data;
  const result = await updateSupplyProduct(id, input);
  if (result.success) {
    revalidateSupplyPaths();
  }

  return result;
}

export async function toggleSupplyProductActiveAction(
  rawInput: ToggleSupplyProductActiveInput
): Promise<Result<SupplyProductDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult =
    toggleSupplyProductActiveSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz durum güncelleme bilgileri.",
        validationResult.error.flatten()
      )
    );
  }

  const { id, isActive } = validationResult.data;
  const result = await toggleSupplyProductActive(id, isActive);
  if (result.success) {
    revalidateSupplyPaths();
  }

  return result;
}

export async function deleteSupplyProductAction(
  rawInput: DeleteSupplyProductInput
): Promise<Result<{ success: true }>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = deleteSupplyProductSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz silme isteği.",
        validationResult.error.flatten()
      )
    );
  }

  const result = await deleteSupplyProduct(validationResult.data.id);
  if (result.success) {
    revalidateSupplyPaths();
  }

  return result;
}
