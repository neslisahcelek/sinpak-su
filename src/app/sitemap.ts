import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { listActiveProducts } from "@/server/services/product.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  let products: Awaited<ReturnType<typeof listActiveProducts>> = [];
  try {
    products = await listActiveProducts();
  } catch {
    // Sitemap generation should not fail the build if the DB is unavailable.
  }

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/urunler/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kurumsal-tedarik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...productUrls,
  ];
}
