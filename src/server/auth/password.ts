import crypto from "node:crypto";

/**
 * Constant-time comparison between two UTF-8 strings to prevent timing side-channel attacks.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");

  if (bufA.length !== bufB.length) {
    // Constant-time dummy comparison to maintain uniform timing profile
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Retrieves the configured auth secret.
 */
export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET environment variable is missing in production.");
    }
    return "dev-insecure-auth-secret-do-not-use-in-production-1234567890";
  }
  return secret;
}

/**
 * Verifies admin credentials against environment-configured values using constant-time comparison.
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword =
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "production" ? "" : "admin123");

  if (!expectedPassword) {
    return false;
  }

  const isUsernameMatch = timingSafeCompare(
    username.trim().toLowerCase(),
    expectedUsername.trim().toLowerCase()
  );
  const isPasswordMatch = timingSafeCompare(password, expectedPassword);

  return isUsernameMatch && isPasswordMatch;
}
