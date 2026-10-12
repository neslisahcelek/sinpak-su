import { NextResponse } from "next/server";
import { submitToIndexNow, INDEXNOW_KEY } from "@/lib/indexnow";
import { siteConfig } from "@/lib/site-config";
import { listActiveProducts } from "@/server/services/product.service";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.AUTH_SECRET;

    // Bearer token or IndexNow key query check for security
    const url = new URL(req.url);
    const keyQuery = url.searchParams.get("key");

    if (
      secret &&
      authHeader !== `Bearer ${secret}` &&
      keyQuery !== INDEXNOW_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "Yetkisiz istek. Lütfen geçerli bir Authorization başlığı veya key parametresi sağlayın.",
        },
        { status: 401 }
      );
    }

    let urls: string[] = [];
    try {
      const body = await req.json();
      if (Array.isArray(body?.urls) && body.urls.length > 0) {
        urls = body.urls;
      }
    } catch {
      // Body not supplied or not JSON; will auto-generate all sitemap URLs
    }

    if (urls.length === 0) {
      const baseUrl = siteConfig.url;
      urls = [
        baseUrl,
        `${baseUrl}/kurumsal-tedarik`,
        `${baseUrl}/kurumsal-tedarik/urunler`,
      ];

      try {
        const products = await listActiveProducts();
        for (const p of products) {
          urls.push(`${baseUrl}/urunler/${p.slug}`);
        }
      } catch {
        // Database offline fallback
      }
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Beklenmeyen sunucu hatası",
      },
      { status: 500 }
    );
  }
}
