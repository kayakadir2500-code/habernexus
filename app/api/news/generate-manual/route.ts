import { NextRequest, NextResponse } from "next/server";
import { runAutonomousNewsPipeline } from "@/lib/ai/pipeline";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { topic, category } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, error: "Konu başlığı gereklidir." }, { status: 400 });
    }

    const result = await runAutonomousNewsPipeline(topic, category);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Manuel üretim hatası:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
