import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/productos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/la-marca`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/hecho-en-argentina`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  let products: MetadataRoute.Sitemap = [];
  try {
    const all = await getAllProducts();
    products = all.map((p) => ({
      url: `${base}/productos/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {}

  return [...staticRoutes, ...products];
}
