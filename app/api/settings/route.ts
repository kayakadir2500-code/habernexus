import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const settings = await db.systemSetting.findFirst({ where: { id: "default" } });
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  try {
    const { activeTextModel, activeImageModel, activeTtsVoice, dailyTarget, isAutoPublish } = await req.json();

    const updated = await db.systemSetting.upsert({
      where: { id: "default" },
      update: {
        activeTextModel: activeTextModel || undefined,
        activeImageModel: activeImageModel || undefined,
        activeTtsVoice: activeTtsVoice || undefined,
        dailyTarget: typeof dailyTarget === "number" ? dailyTarget : undefined,
        isAutoPublish: typeof isAutoPublish === "boolean" ? isAutoPublish : undefined,
      },
      create: {
        id: "default",
        activeTextModel: activeTextModel || "gemini-3.7-flash",
        activeImageModel: activeImageModel || "imagen-3.0-generate-002",
        activeTtsVoice: activeTtsVoice || "tr-TR-Standard-A",
        dailyTarget: dailyTarget || 10,
        isAutoPublish: isAutoPublish ?? true,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Ayar kaydetme hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}