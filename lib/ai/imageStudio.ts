/**
 * Ultra Gerçekçi Basın Fotoğrafı Stüdyosu (Imagen 3 / Imagen 4)
 * Google Imagen modelleri ile 16:9 haber görseli üretir ve optimize eder.
 */

import { optimizeAndStoreImage } from "@/lib/image/optimizer";

export async function generateEditorialNewsImage(params: {
  prompt: string;
  headlineTitle: string;
  activeModel?: string;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = params.activeModel || "imagen-3.0-generate-002";

  if (!apiKey) {
    console.warn("GEMINI_API_KEY bulunamadı, fallback görsel atanıyor.");
    return getRandomFallbackNewsImage();
  }

  // Güvenlik & Profesyonel Fotoğrafçılık filtreleri ekle
  const fullPrompt = `${params.prompt}, high resolution news photojournalism, authentic press photography, clear details, 8k, natural light --no text, no watermark, no CGI, no cartoon`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: fullPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "16:9",
            outputMimeType: "image/jpeg",
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Imagen API çağrısı başarısız, alternatif görsel yükleniyor:", errText);
      return getRandomFallbackNewsImage();
    }

    const data = await res.json();
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

    if (!base64Image) {
      return getRandomFallbackNewsImage();
    }

    const imageBuffer = Buffer.from(base64Image, "base64");
    const storedUrl = await optimizeAndStoreImage(imageBuffer, "imagen-news");
    return storedUrl;
  } catch (error) {
    console.error("Görsel üretilirken hata oluştu:", error);
    return getRandomFallbackNewsImage();
  }
}

function getRandomFallbackNewsImage(): string {
  const fallbacks = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
