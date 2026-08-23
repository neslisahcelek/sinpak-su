"use server";

import { revalidatePath } from "next/cache";
import {
  adminLoginInputSchema,
  updateOrderStatusSchema,
  type AdminLoginInput,
  type UpdateOrderStatusInput,
} from "@/server/validation/admin.schema";
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
  const isValid = verifyAdminCredentials(username, password);

  if (!isValid) {
    return err(
      makeSafeError(
        "INVALID_CREDENTIALS",
        "Kullanıcı adı veya şifre hatalı."
      )
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
      makeSafeError(
        "UNAUTHORIZED",
        "Bu işlem için yetkiniz bulunmamaktadır."
      )
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

