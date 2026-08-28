import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);
  const category = searchParams.get("category");

  const skip = (page - 1) * limit;

  try {
    const whereClause: any = { isPublished: true };
    if (category && category !== "ALL") {
      whereClause.category = { equals: category, mode: "insensitive" };
    }

    const newsList = await db.news.findMany({
      where: whereClause,
      include: { persona: true },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    });

    const total = await db.news.count({ where: whereClause });

    return NextResponse.json({
      success: true,
      data: newsList,
      page,
      hasMore: skip + newsList.length < total,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: [],
      page,
      hasMore: false,
    });
  }
}