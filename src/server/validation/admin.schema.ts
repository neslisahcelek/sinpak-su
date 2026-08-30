import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const adminLoginInputSchema = z.object({
  username: z.string().trim().min(1, "Kullanıcı adı gereklidir."),
  password: z.string().min(1, "Şifre gereklidir."),
});

export type AdminLoginInput = z.infer<typeof adminLoginInputSchema>;

export const updateOrderStatusSchema = z.object({
  publicId: z.string().trim().min(1, "Sipariş numarası gereklidir."),
  nextStatus: z.nativeEnum(OrderStatus),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
