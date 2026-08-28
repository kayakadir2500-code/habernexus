/**
 * Doğal Yapay Zeka Spiker Stüdyosu (AI Voice Studio)
 * Haberin 5N1K özetini ve ana noktalarını pürüzsüz Türkçe spiker sesiyle seslendirir.
 */

import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

export async function generateArticleAudio(params: {
  articleId: string;
  title: string;
  summary: string;
  voiceName?: string;
}): Promise<string | null> {
  const ttsKey = process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY;
  const voice = params.voiceName || "tr-TR-Standard-A";

  const textToRead = `${params.title}. Haber özeti: ${params.summary}`;

  if (!ttsKey) {
    // API anahtarı yoksa sesli okuyucu için dinamik endpoint URL'i döndür
    return `/api/audio/${params.articleId}`;
  }

  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: textToRead },
          voice: {
            languageCode: "tr-TR",
            name: voice,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.05,
            pitch: 0.0,
          },
        }),
      }
    );

    if (!res.ok) {
      console.warn("TTS API yanıt vermedi, dinamik uç nokta kullanılacak.");
      return `/api/audio/${params.articleId}`;
    }

    const data = await res.json();
    if (!data.audioContent) {
      return `/api/audio/${params.articleId}`;
    }

    const audioBuffer = Buffer.from(data.audioContent, "base64");
    const filename = `audio-${params.articleId}-${Date.now()}.mp3`;

    // 1. Vercel Blob Varsa Yükle
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`audio/${filename}`, audioBuffer, {
        access: "public",
        contentType: "audio/mpeg",
      });
      return blob.url;
    }

    // 2. Yerel Depolama (public/uploads/audio/)
    const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, audioBuffer);

    return `/uploads/audio/${filename}`;
  } catch (error) {
    console.error("Ses üretim hatası:", error);
    return `/api/audio/${params.articleId}`;
  }
}
