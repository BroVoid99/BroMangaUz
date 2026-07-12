import { MetadataRoute } from "next";
import { mangas } from "@/lib/data";

const BASE_URL = "https://bromanga.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    }
  ];

  const mangaRoutes: MetadataRoute.Sitemap = mangas.flatMap((m) => [
    {
      url: `${BASE_URL}/manga/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    ...m.chapters.map((c) => ({
      url: `${BASE_URL}/manga/${m.slug}/${c.number}`,
      lastModified: new Date(c.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5
    }))
  ]);

  return [...staticRoutes, ...mangaRoutes];
}
