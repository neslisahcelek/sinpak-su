"use server";

import { revalidatePath } from "next/cache";
import {
  adminLoginInputSchema,
  updateOrderStatusSchema,
  type AdminLoginInput,
  type UpdateOrderStatusInput,
} from "@/server/validation/admin.schema";
import {
  createProductSchema,
  updateProductSchema,
  toggleProductActiveSchema,
  type CreateProductInput,
  type UpdateProductInput,
  type ToggleProductActiveInput,
} from "@/server/validation/admin-product.schema";
import { verifyAdminCredentials } from "@/server/auth/password";
import {
  createAdminSessionPayload,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  getAdminSession,
} from "@/server/auth/session";
import {
  updateOrderStatus,
  type UpdateOrderStatusResult,
} from "@/server/services/admin-order.service";
import {
  createProduct,
  updateProduct,
  toggleProductActive,
  type AdminProductDto,
} from "@/server/services/admin-product.service";
import { uploadProductImage } from "@/server/storage/supabase-storage";
import { err, makeSafeError, ok, type Result } from "@/server/types/result";

/**
 * Server action to authenticate admin staff and establish a signed session cookie.
 */
export async function loginAdminAction(
  rawInput: AdminLoginInput
): Promise<Result<{ success: true }>> {
  const validationResult = adminLoginInputSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz kullanıcı adı veya şifre.",
        validationResult.error.flatten()
      )
    );
  }

  const { username, password } = validationResult.data;
  const isValid = await verifyAdminCredentials(username, password);

  if (!isValid) {
    return err(
      makeSafeError("INVALID_CREDENTIALS", "Kullanıcı adı veya şifre hatalı.")
    );
  }

  const session = createAdminSessionPayload(username);
  await setAdminSessionCookie(session);

  return ok({ success: true });
}

/**
 * Server action to clear admin session and log out.
 */
export async function logoutAdminAction(): Promise<Result<{ success: true }>> {
  await clearAdminSessionCookie();
  return ok({ success: true });
}

/**
 * Server action to check whether the current user is an authenticated admin.
 */
export async function getAdminSessionAction(): Promise<
  Result<{ authenticated: boolean; username?: string }>
> {
  const session = await getAdminSession();
  if (!session) {
    return ok({ authenticated: false });
  }

  return ok({
    authenticated: true,
    username: session.username,
  });
}

/**
 * Server action to advance or transition an order's status as an authenticated admin.
 */
export async function updateOrderStatusAction(
  rawInput: UpdateOrderStatusInput
): Promise<Result<UpdateOrderStatusResult>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = updateOrderStatusSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz sipariş durumu güncelleme isteği.",
        validationResult.error.flatten()
      )
    );
  }

  const { publicId, nextStatus } = validationResult.data;
  const result = await updateOrderStatus(publicId, nextStatus);

  if (result.success) {
    revalidatePath("/admin/orders");
  }

  return result;
}

/**
 * Server action to create a new product as an authenticated admin.
 */
export async function createProductAction(
  rawInput: CreateProductInput
): Promise<Result<AdminProductDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = createProductSchema.safeParse(rawInput);
  if (!validationResult.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Geçersiz ürün bilgileri.",
        validationResult.error.flatten()
      )
    );
  }

  const result = await createProduct(validationResult.data);

  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/checkout");
    if (result.data.slug) {
      revalidatePath(`/urunler/${result.data.slug}`);
    }
  }

  return result;
}

/**
 * Server action to update an existing product as an authenticated admin.
 */
export async function updateProductAction(
  rawInput: UpdateProductInput
): Promise<Result<AdminProductDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = updateProductSchema.safeParse(rawInput);
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
  const result = await updateProduct(id, input);

  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${result.data.id}/edit`);
    revalidatePath("/");
    revalidatePath("/checkout");
    if (result.data.slug) {
      revalidatePath(`/urunler/${result.data.slug}`);
    }
  }

  return result;
}

/**
 * Server action to toggle a product's active status as an authenticated admin.
 */
export async function toggleProductActiveAction(
  rawInput: ToggleProductActiveInput
): Promise<Result<AdminProductDto>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const validationResult = toggleProductActiveSchema.safeParse(rawInput);
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
  const result = await toggleProductActive(id, isActive);

  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${result.data.id}/edit`);
    revalidatePath("/");
    revalidatePath("/checkout");
    if (result.data.slug) {
      revalidatePath(`/urunler/${result.data.slug}`);
    }
  }

  return result;
}

/**
 * Server action to securely upload a compressed product image to Supabase Storage.
 */
export async function uploadProductImageAction(
  formData: FormData
): Promise<Result<{ url: string; path: string }>> {
  const session = await getAdminSession();
  if (!session) {
    return err(
      makeSafeError("UNAUTHORIZED", "Bu işlem için yetkiniz bulunmamaktadır.")
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return err(
      makeSafeError("VALIDATION_ERROR", "Geçerli bir dosya yüklenmedi.")
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Görsel boyutu maksimum 5MB olabilir."
      )
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await uploadProductImage(buffer, file.type, file.name);

    return ok({
      url: result.url,
      path: result.path,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Görsel yüklenemedi.";

    if (
      message.includes("Desteklenmeyen dosya türü") ||
      message.includes("dosya imzası")
    ) {
      return err(makeSafeError("VALIDATION_ERROR", message));
    }

    console.error("Product image upload failed:", error);
    return err(
      makeSafeError(
        "INTERNAL_ERROR",
        "Görsel depolamaya yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."
      )
    );
  }
}

