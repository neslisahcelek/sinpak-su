import { describe, expect, it, vi, beforeEach } from "vitest";
import { submitToIndexNow, INDEXNOW_KEY } from "./indexnow";

describe("IndexNow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("handles empty URL lists cleanly without making a network request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = await submitToIndexNow([]);

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.submittedUrls).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("submits URLs to IndexNow API with proper payload structure", async () => {
    const mockFetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      text: async () => "",
    } as unknown as Response);

    const testUrls = [
      "https://sinpaktedarik.com/",
      "https://sinpaktedarik.com/kurumsal-tedarik",
    ];

    const result = await submitToIndexNow(testUrls);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.indexnow.org/indexnow");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({
      "Content-Type": "application/json; charset=utf-8",
    });

    const parsedBody = JSON.parse(options.body as string);
    expect(parsedBody.host).toBe("sinpaktedarik.com");
    expect(parsedBody.key).toBe(INDEXNOW_KEY);
    expect(parsedBody.keyLocation).toBe(
      `https://sinpaktedarik.com/${INDEXNOW_KEY}.txt`
    );
    expect(parsedBody.urlList).toEqual(testUrls);

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.submittedUrls).toEqual(testUrls);
  });

  it("accepts 202 status code as success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      status: 202,
      statusText: "Accepted",
      text: async () => "Accepted",
    } as unknown as Response);

    const result = await submitToIndexNow(["https://sinpaktedarik.com/"]);
    expect(result.success).toBe(true);
    expect(result.status).toBe(202);
  });

  it("handles HTTP error status codes gracefully", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      status: 403,
      statusText: "Forbidden",
      text: async () => "Key invalid",
    } as unknown as Response);

    const result = await submitToIndexNow(["https://sinpaktedarik.com/"]);
    expect(result.success).toBe(false);
    expect(result.status).toBe(403);
    expect(result.message).toContain("403");
  });

  it("catches network errors fail-safe and never throws to caller", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("DNS lookup failed")
    );

    const result = await submitToIndexNow(["https://sinpaktedarik.com/"]);
    expect(result.success).toBe(false);
    expect(result.status).toBe(500);
    expect(result.message).toContain("DNS lookup failed");
  });
});
