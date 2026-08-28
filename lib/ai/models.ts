/**
 * Google AI Model Keşif & Yönetim Servisi
 * Canlı olarak Google API üzerinden güncel Gemini ve Imagen modellerini sorgular.
 */

export interface GoogleModelInfo {
  name: string;
  displayName: string;
  description: string;
  supportedGenerationMethods: string[];
  type: "TEXT" | "IMAGE" | "EMBEDDING" | "OTHER";
}

const FALLBACK_TEXT_MODELS = [
  { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash (En Hızlı & En Yeni)", type: "TEXT" },
  { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Kıdemli & Derin Analiz)", type: "TEXT" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", type: "TEXT" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", type: "TEXT" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", type: "TEXT" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", type: "TEXT" },
];

const FALLBACK_IMAGE_MODELS = [
  { id: "imagen-3.0-generate-002", name: "Imagen 3 (Ultra Gerçekçi Basın Fotoğrafı)", type: "IMAGE" },
  { id: "imagen-3.0-fast-generate-001", name: "Imagen 3 Fast", type: "IMAGE" },
  { id: "imagen-4.0-generate-001", name: "Imagen 4 (Yeni Nesil)", type: "IMAGE" },
];

export async function fetchLiveGoogleModels(apiKey?: string): Promise<{
  textModels: { id: string; name: string }[];
  imageModels: { id: string; name: string }[];
}> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    return {
      textModels: FALLBACK_TEXT_MODELS,
      imageModels: FALLBACK_IMAGE_MODELS,
    };
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn("Google API models.list isteği başarısız oldu, varsayılan modeller kullanılıyor.");
      return {
        textModels: FALLBACK_TEXT_MODELS,
        imageModels: FALLBACK_IMAGE_MODELS,
      };
    }

    const data = await res.json();
    const models: any[] = data.models || [];

    const textModels: { id: string; name: string }[] = [];
    const imageModels: { id: string; name: string }[] = [];

    for (const m of models) {
      const cleanId = m.name.replace(/^models\//, "");
      const methods: string[] = m.supportedGenerationMethods || [];

      if (methods.includes("generateContent")) {
        textModels.push({
          id: cleanId,
          name: `${m.displayName || cleanId} (${cleanId})`,
        });
      }

      if (cleanId.toLowerCase().includes("imagen") || methods.includes("generateImages")) {
        imageModels.push({
          id: cleanId,
          name: `${m.displayName || cleanId} (${cleanId})`,
        });
      }
    }

    // Eğer API'den liste boş gelirse fallback'leri birleştir
    return {
      textModels: textModels.length > 0 ? textModels : FALLBACK_TEXT_MODELS,
      imageModels: imageModels.length > 0 ? imageModels : FALLBACK_IMAGE_MODELS,
    };
  } catch (error) {
    console.error("Modeller çekilirken hata oluştu:", error);
    return {
      textModels: FALLBACK_TEXT_MODELS,
      imageModels: FALLBACK_IMAGE_MODELS,
    };
  }
}
