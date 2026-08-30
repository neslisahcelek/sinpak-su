import { describe, it, expect } from "vitest";
import {
  signSessionToken,
  verifySessionToken,
  createAdminSessionPayload,
} from "./session";

describe("Admin Session Signing and Verification", () => {
  const testSecret = "super-secret-test-key-1234567890";
  const now = 1700000000000;

  it("should successfully sign and verify a valid admin session", () => {
    const session = createAdminSessionPayload("admin_staff", now);
    const token = signSessionToken(session, testSecret);

    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(2);

    const verified = verifySessionToken(token, testSecret, now + 1000);
    expect(verified).not.toBeNull();
    expect(verified?.username).toBe("admin_staff");
    expect(verified?.role).toBe("ADMIN");
    expect(verified?.createdAt).toBe(now);
    expect(verified?.expiresAt).toBe(session.expiresAt);
  });

  it("should reject token with tampered payload", () => {
    const session = createAdminSessionPayload("admin_staff", now);
    const token = signSessionToken(session, testSecret);

    const [, signature] = token.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({ ...session, username: "attacker" }),
      "utf-8"
    ).toString("base64url");
    const tamperedToken = `${tamperedPayload}.${signature}`;

    const verified = verifySessionToken(tamperedToken, testSecret, now + 1000);
    expect(verified).toBeNull();
  });

  it("should reject token with tampered signature", () => {
    const session = createAdminSessionPayload("admin_staff", now);
    const token = signSessionToken(session, testSecret);

    const [payloadB64] = token.split(".");
    const fakeSignature =
      Buffer.from("invalid-signature").toString("base64url");
    const tamperedToken = `${payloadB64}.${fakeSignature}`;

    const verified = verifySessionToken(tamperedToken, testSecret, now + 1000);
    expect(verified).toBeNull();
  });

  it("should reject token signed with a different secret", () => {
    const session = createAdminSessionPayload("admin_staff", now);
    const token = signSessionToken(session, "different-secret-key");

    const verified = verifySessionToken(token, testSecret, now + 1000);
    expect(verified).toBeNull();
  });

  it("should reject expired token", () => {
    const session = createAdminSessionPayload("admin_staff", now);
    const token = signSessionToken(session, testSecret);

    // Check at time beyond expiresAt
    const verified = verifySessionToken(
      token,
      testSecret,
      session.expiresAt + 1
    );
    expect(verified).toBeNull();
  });

  it("should reject malformed tokens", () => {
    expect(verifySessionToken("", testSecret, now)).toBeNull();
    expect(verifySessionToken("invalid", testSecret, now)).toBeNull();
    expect(verifySessionToken("a.b.c", testSecret, now)).toBeNull();
    expect(verifySessionToken(null, testSecret, now)).toBeNull();
    expect(verifySessionToken(undefined, testSecret, now)).toBeNull();
  });
});
