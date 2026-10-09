export const ADMIN_COOKIE_NAME = "sinpak_admin_session";

export interface AdminSession {
  username: string;
  role: "ADMIN";
  createdAt: number;
  expiresAt: number;
}

/**
 * Converts a base64url string to Uint8Array for Web Crypto API.
 */
export function base64UrlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Validates admin HMAC session token using Web Crypto API.
 * 100% compatible with Next.js Edge Middleware and Node.js runtimes.
 */
export async function verifyAdminSessionEdge(
  token: string | undefined | null,
  secret: string,
  nowMs: number = Date.now()
): Promise<AdminSession | null> {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) {
    return null;
  }

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = base64UrlToUint8Array(signature);
    const dataBytes = enc.encode(payloadB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      dataBytes as unknown as BufferSource
    );

    if (!isValid) {
      return null;
    }

    const jsonStr = new TextDecoder().decode(base64UrlToUint8Array(payloadB64));
    const payload = JSON.parse(jsonStr) as Partial<AdminSession>;

    if (
      typeof payload.username !== "string" ||
      payload.role !== "ADMIN" ||
      typeof payload.createdAt !== "number" ||
      typeof payload.expiresAt !== "number"
    ) {
      return null;
    }

    if (nowMs >= payload.expiresAt) {
      return null;
    }

    return {
      username: payload.username,
      role: "ADMIN",
      createdAt: payload.createdAt,
      expiresAt: payload.expiresAt,
    };
  } catch {
    return null;
  }
}
