import { NextRequest, NextResponse } from "next/server";
import { fetchLiveGoogleModels } from "@/lib/ai/models";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customKey = searchParams.get("key") || undefined;

  const models = await fetchLiveGoogleModels(customKey);
  return NextResponse.json(models);
}
