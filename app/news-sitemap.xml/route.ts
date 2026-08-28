import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  let articles: any[] = [];
  try {
    articles = await db.news.findMany({
      where: {
        isPublished: true,
        publishedAt: { gte: twoDaysAgo },
      },
      select: {
        slug: true,
        title: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 1000,
    });
  } catch (e) {
    console.warn("News sitemap veritabanı okunamadı:", e);
  }

  const xmlItems = articles
    .map((item) => {
      const pubDate = new Date(item.publishedAt).toISOString();
      const escapedTitle = item.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

      return `
  <url>
    <loc>${baseUrl}/haber/${item.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>HaberNexus</news:name>
        <news:language>tr</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapedTitle}</news:title>
    </news:news>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlItems}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600",
    },
  });
}