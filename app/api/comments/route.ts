import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const newsId = searchParams.get("newsId");

  if (!newsId) {
    return NextResponse.json({ comments: [] });
  }

  try {
    const comments = await db.comment.findMany({
      where: { newsId },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { newsId, content, authorName } = await req.json();

    if (!newsId || !content) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    // Anonim / Misafir kullanıcı oluştur veya bağla
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: {
          name: authorName || "HaberNexus Okuru",
          email: `guest-${Date.now()}@habernexus.local`,
        },
      });
    }

    const created = await db.comment.create({
      data: {
        content,
        newsId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, comment: created });
  } catch (error: any) {
    console.error("Yorum ekleme hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}