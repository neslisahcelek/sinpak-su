import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { PrismaClient } from "@prisma/client";

import {
  timingSafeCompare,
  hashPassword,
  verifyPassword,
  verifyAdminCredentials,
} from "./password";

type MockAdminDb = Pick<PrismaClient, "adminUser">;

describe("Admin Password & Credential Verification", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should perform timing-safe string comparison correctly", () => {
    expect(timingSafeCompare("password123", "password123")).toBe(true);
    expect(timingSafeCompare("password123", "password124")).toBe(false);
    expect(timingSafeCompare("short", "longerpassword")).toBe(false);
    expect(timingSafeCompare("", "")).toBe(true);
  });

  it("should hash and verify passwords correctly using scrypt", async () => {
    const rawPassword = "MySecureAdminPassword123!";
    const hash = await hashPassword(rawPassword);

    expect(hash).toContain(":");
    expect(await verifyPassword(rawPassword, hash)).toBe(true);
    expect(await verifyPassword("WrongPassword123!", hash)).toBe(false);
    expect(await verifyPassword(rawPassword, "invalid:hash")).toBe(false);
  });

  it("should verify admin from database when found", async () => {
    const rawPassword = "DbPassword123!";
    const hash = await hashPassword(rawPassword);

    const mockDb = {
      adminUser: {
        findUnique: vi.fn().mockResolvedValue({
          id: "admin_1",
          username: "custom_admin",
          passwordHash: hash,
          isActive: true,
          name: "Test Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    } as unknown as MockAdminDb;

    const isMatch = await verifyAdminCredentials(
      "custom_admin",
      rawPassword,
      mockDb
    );
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyAdminCredentials(
      "custom_admin",
      "wrong_pwd",
      mockDb
    );
    expect(isWrongMatch).toBe(false);
  });

  it("should reject inactive admin user from database", async () => {
    const rawPassword = "DbPassword123!";
    const hash = await hashPassword(rawPassword);

    const mockDb = {
      adminUser: {
        findUnique: vi.fn().mockResolvedValue({
          id: "admin_2",
          username: "inactive_admin",
          passwordHash: hash,
          isActive: false,
          name: "Inactive Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    } as unknown as MockAdminDb;

    const isMatch = await verifyAdminCredentials(
      "inactive_admin",
      rawPassword,
      mockDb
    );
    expect(isMatch).toBe(false);
  });

  it("should verify valid credentials against configured environment variables fallback", async () => {
    process.env.ADMIN_USERNAME = "sinpak_admin";
    process.env.ADMIN_PASSWORD = "SecretPassword!456";

    const mockDb = {
      adminUser: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as unknown as MockAdminDb;

    expect(
      await verifyAdminCredentials("sinpak_admin", "SecretPassword!456", mockDb)
    ).toBe(true);

    // Case-insensitive username match
    expect(
      await verifyAdminCredentials("SINPAK_ADMIN", "SecretPassword!456", mockDb)
    ).toBe(true);
  });

  it("should reject invalid username or password via fallback", async () => {
    process.env.ADMIN_USERNAME = "sinpak_admin";
    process.env.ADMIN_PASSWORD = "SecretPassword!456";

    const mockDb = {
      adminUser: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as unknown as MockAdminDb;

    expect(
      await verifyAdminCredentials("wrong_user", "SecretPassword!456", mockDb)
    ).toBe(false);

    expect(
      await verifyAdminCredentials("sinpak_admin", "wrong_password", mockDb)
    ).toBe(false);
  });

  it("should reject when no password is configured in production mode", async () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.ADMIN_PASSWORD;

    const mockDb = {
      adminUser: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    } as unknown as MockAdminDb;

    expect(await verifyAdminCredentials("admin", "admin123", mockDb)).toBe(false);
    vi.unstubAllEnvs();
  });
});
