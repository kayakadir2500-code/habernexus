import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import slugify from "slugify";

export async function GET() {
  const personas = await db.persona.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ personas });
}

export async function POST(req: NextRequest) {
  try {
    const { name, role, bio, avatarUrl, categories, tone } = await req.json();

    if (!name || !role || !bio) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const cleanSlug = slugify(name, { lower: true, strict: true, locale: "tr" });

    const created = await db.persona.create({
      data: {
        name,
        slug: `${cleanSlug}-${Date.now().toString().slice(-4)}`,
        role,
        bio,
        avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        categories: categories || ["GUNDEM"],
        tone: tone || "Profesyonel, akıcı ve analitik",
      },
    });

    return NextResponse.json({ success: true, persona: created });
  } catch (error: any) {
    console.error("Persona oluşturma hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}