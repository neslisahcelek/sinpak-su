import { describe, it, expect } from "vitest";
import { signSessionToken, createAdminSessionPayload } from "./session";
import { verifyAdminSessionEdge } from "./edge-session";

describe("edge-session", () => {
  const secret = "test-secret-that-is-at-least-32-chars-long-123456";

  it("successfully verifies valid session signed by Node.js crypto", async () => {
    const session = createAdminSessionPayload("superadmin", 1000000);
    const token = signSessionToken(session, secret);

    const verified = await verifyAdminSessionEdge(
      token,
      secret,
      1000000 + 1000
    );
    expect(verified).not.toBeNull();
    expect(verified?.username).toBe("superadmin");
    expect(verified?.role).toBe("ADMIN");
  });

  it("rejects token with invalid signature", async () => {
    const session = createAdminSessionPayload("superadmin", 1000000);
    const token = signSessionToken(session, secret);
    const tampered = token.slice(0, -4) + "abcd";

    const verified = await verifyAdminSessionEdge(
      tampered,
      secret,
      1000000 + 1000
    );
    expect(verified).toBeNull();
  });

  it("rejects token signed with different secret", async () => {
    const session = createAdminSessionPayload("superadmin", 1000000);
    const token = signSessionToken(
      session,
      "different-secret-key-1234567890123"
    );

    const verified = await verifyAdminSessionEdge(
      token,
      secret,
      1000000 + 1000
    );
    expect(verified).toBeNull();
  });

  it("rejects expired token", async () => {
    const session = createAdminSessionPayload("superadmin", 1000000);
    const token = signSessionToken(session, secret);

    // After expiration (session duration is 7 days)
    const afterExpiration = session.expiresAt + 1;
    const verified = await verifyAdminSessionEdge(
      token,
      secret,
      afterExpiration
    );
    expect(verified).toBeNull();
  });

  it("rejects malformed or empty token", async () => {
    expect(await verifyAdminSessionEdge("", secret)).toBeNull();
    expect(await verifyAdminSessionEdge(null, secret)).toBeNull();
    expect(await verifyAdminSessionEdge("not-a-token", secret)).toBeNull();
  });
});
