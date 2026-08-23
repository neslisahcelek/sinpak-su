import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { timingSafeCompare, verifyAdminCredentials } from "./password";

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

  it("should verify valid credentials against configured environment variables", () => {
    process.env.ADMIN_USERNAME = "sinpak_admin";
    process.env.ADMIN_PASSWORD = "SecretPassword!456";

    expect(
      verifyAdminCredentials("sinpak_admin", "SecretPassword!456")
    ).toBe(true);

    // Case-insensitive username match
    expect(
      verifyAdminCredentials("SINPAK_ADMIN", "SecretPassword!456")
    ).toBe(true);
  });

  it("should reject invalid username or password", () => {
    process.env.ADMIN_USERNAME = "sinpak_admin";
    process.env.ADMIN_PASSWORD = "SecretPassword!456";

    expect(
      verifyAdminCredentials("wrong_user", "SecretPassword!456")
    ).toBe(false);

    expect(
      verifyAdminCredentials("sinpak_admin", "wrong_password")
    ).toBe(false);
  });

  it("should reject when no password is configured in production mode", () => {
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.ADMIN_PASSWORD;

    expect(verifyAdminCredentials("admin", "admin123")).toBe(false);
    vi.unstubAllEnvs();
  });
});
