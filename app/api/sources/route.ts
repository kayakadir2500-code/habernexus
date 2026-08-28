import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const sources = await db.contentSource.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ sources });
}

export async function POST(req: NextRequest) {
  try {
    const { name, type, url, category } = await req.json();

    if (!name || !type) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const created = await db.contentSource.create({
      data: {
        name,
        type: type || "RSS",
        url: url || null,
        category: category || "GUNDEM",
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, source: created });
  } catch (error: any) {
    console.error("Kaynak ekleme hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}