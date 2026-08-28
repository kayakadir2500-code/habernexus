import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Haber ID gereklidir" }, { status: 400 });
  }

  const news = await db.news.findUnique({
    where: { id },
    select: { title: true, summary: true, audioUrl: true },
  });

  if (!news) {
    return NextResponse.json({ error: "Haber bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({
    title: news.title,
    summary: news.summary,
    audioUrl: news.audioUrl,
  });
}
