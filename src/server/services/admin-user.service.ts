import { prisma } from "@/server/db/client";
import { hashPassword } from "@/server/auth/password";
import type { PrismaClient, AdminUser } from "@prisma/client";

export type AdminUserSummary = Pick<
  AdminUser,
  "id" | "username" | "name" | "isActive" | "createdAt" | "updatedAt"
>;

export interface CreateAdminUserInput {
  username: string;
  password: string;
  name?: string | null;
  isActive?: boolean;
}

/**
 * Finds an admin user by their unique case-insensitive username.
 */
export async function findAdminUserByUsername(
  username: string,
  db: Pick<PrismaClient, "adminUser"> = prisma
): Promise<AdminUser | null> {
  const normalized = username.trim().toLowerCase();
  return db.adminUser.findUnique({
    where: { username: normalized },
  });
}

/**
 * Creates or upserts an admin user with a securely hashed password.
 */
export async function upsertAdminUser(
  input: CreateAdminUserInput,
  db: Pick<PrismaClient, "adminUser"> = prisma
): Promise<AdminUserSummary> {
  const normalized = input.username.trim().toLowerCase();
  const passwordHash = await hashPassword(input.password);

  const user = await db.adminUser.upsert({
    where: { username: normalized },
    update: {
      passwordHash,
      name: input.name ?? null,
      isActive: input.isActive ?? true,
    },
    create: {
      username: normalized,
      passwordHash,
      name: input.name ?? null,
      isActive: input.isActive ?? true,
    },
  });

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Lists all admin users for management.
 */
export async function listAdminUsers(
  db: Pick<PrismaClient, "adminUser"> = prisma
): Promise<AdminUserSummary[]> {
  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      username: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users;
}
