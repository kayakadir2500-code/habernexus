import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await db.news.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { summary: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        imageUrl: true,
        readingTime: true,
        publishedAt: true,
      },
      take: 6,
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Arama hatası:", error);
    return NextResponse.json({ results: [] });
  }
}