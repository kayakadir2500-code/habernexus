import { NextRequest, NextResponse } from "next/server";
import { runAutonomousNewsPipeline } from "@/lib/ai/pipeline";

export const maxDuration = 60; // Vercel / Serverless 60s execution limit

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { topic, category } = body;

    const result = await runAutonomousNewsPipeline(topic, category);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Queue process hatası:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
