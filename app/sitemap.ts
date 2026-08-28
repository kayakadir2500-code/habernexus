import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let newsUrls: MetadataRoute.Sitemap = [];

  try {
    const articles = await db.news.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      take: 1000,
    });

    newsUrls = articles.map((article) => ({
      url: `${baseUrl}/haber/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt,
      changeFrequency: "hourly",
      priority: 0.9,
    }));
  } catch (e) {
    console.warn("Sitemap üretilirken veritabanı okunamadı:", e);
  }

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "always", priority: 1.0 },
    { url: `${baseUrl}/kategori/gundem`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/kategori/teknoloji`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/kategori/ekonomi`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/kategori/dunya`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/kategori/spor`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/destek`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [...staticUrls, ...newsUrls];
}