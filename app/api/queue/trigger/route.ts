import { NextRequest, NextResponse } from "next/server";
import { Client } from "@upstash/qstash";
import { runAutonomousNewsPipeline } from "@/lib/ai/pipeline";

export async function POST(req: NextRequest) {
  const qstashToken = process.env.QSTASH_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (qstashToken) {
    try {
      const qstash = new Client({ token: qstashToken });
      await qstash.publishJSON({
        url: `${appUrl}/api/queue/process`,
        body: {},
      });

      return NextResponse.json({
        success: true,
        message: "QStash kuyruğuna yeni otonom haber üretim görevi eklendi.",
      });
    } catch (error: any) {
      console.error("QStash tetikleme hatası:", error);
    }
  }

  // QStash anahtarı yoksa doğrudan çalıştır (Geliştirme modu)
  const result = await runAutonomousNewsPipeline();
  return NextResponse.json(result);
}
