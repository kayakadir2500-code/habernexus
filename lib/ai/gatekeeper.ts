/**
 * AI Yayın Yönetmeni (Editorial Gatekeeper)
 * Gündem maddesini zamansal tazelik, haber değeri, virallik ve SEO açısından analiz eder.
 * Eski / bayat maçları, asılsız dedikoduları ve değersiz içerikleri eler.
 */

export interface GatekeeperDecision {
  shouldPublish: boolean;
  score: number; // 0 - 100
  reason: string;
  category: "GUNDEM" | "TEKNOLOJI" | "EKONOMI" | "DUNYA" | "SPOR" | "OTOMOTIV" | "BILIM" | "SAGLIK";
  clickWorthyTitle: string;
  searchQueries: string[];
  angle: string;
}

export async function evaluateNewsTopic(params: {
  rawTitle: string;
  rawSnippet?: string;
  sourceUrl?: string;
  sourceDate?: string;
  activeModel?: string;
}): Promise<GatekeeperDecision> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = params.activeModel || "gemini-3.7-flash";
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD formatı

  if (!apiKey) {
    // API anahtarı yoksa akıllı varsayılan
    return {
      shouldPublish: true,
      score: 85,
      reason: "Geliştirme modu: Varsayılan onay verildi.",
      category: "GUNDEM",
      clickWorthyTitle: params.rawTitle,
      searchQueries: [params.rawTitle],
      angle: "Gelişmeler ve son durum",
    };
  }

  const prompt = `
Sen HaberNexus dijital haber ajansının Kıdemli Genel Yayın Yönetmenisin (Editor-in-Chief).
Aşağıda internet gündeminden veya RSS kaynaklarından gelen ham bir konu başlığı verilmiştir.

GÖREVİN:
1. ZAMANSAL TAZELİK KONTROLÜ (Temporal Validation):
   - Bugünün Tarihi: ${currentDate}
   - Konu Tarihi / İpucu: ${params.sourceDate || "Belirtilmedi"}
   - Konu: "${params.rawTitle}"
   - Açıklama: "${params.rawSnippet || ""}"
   - DİKKAT: Eğer bu olay (örn. bitmiş bir spor maçı, eski bir kaza, aylar önceki bir açıklama) geçmişte kalmışsa ve bugün için taze bir gelişme içermiyorsa "shouldPublish": false yap ve sebebini "Zaman aşımı / Eski gelişme" olarak belirt.

2. HABER DEĞERİ & VİRALLİK ANALİZİ (News-Worthiness):
   - 0-100 arasında puan ver. 65 puan altındaki sıradan, spam veya değersiz konular elenmelidir.

3. MERAK UYANDIRAN & TIKLANABİLİR ÇALIŞMA BAŞLIĞI:
   - Okuyucuda merak duygusu uyandıran, profesyonel gazetecilik standartlarında, tıklama isteği oluşturan ilgi çekici bir Türkçe başlık üret (asla ucuz/yanıltıcı yalan clickbait olmasın).

4. KATEGORİ SEÇİMİ:
   - Sadece şunlardan biri olmalı: GUNDEM, TEKNOLOJI, EKONOMI, DUNYA, SPOR, OTOMOTIV, BILIM, SAGLIK.

5. GOOGLE ARAMA SORGULARI:
   - Yapay zeka yazarımızın internette en güncel ve doğru bilgileri canlı araması için 2-3 adet odaklanmış Google arama sorgusu hazırla.

LÜTFEN SADECE VE SADECE GEÇERLİ BİR JSON YANITI DÖNDÜR (Markdown formatı olmadan):
{
  "shouldPublish": true,
  "score": 88,
  "reason": "Konu güncel, yüksek arama hacmine sahip ve kamuoyu ilgisi yüksek.",
  "category": "GUNDEM",
  "clickWorthyTitle": "Merak Uyandıran Profesyonel Başlık",
  "searchQueries": ["arama sorgusu 1", "arama sorgusu 2"],
  "angle": "Haberin odaklanacağı can alıcı nokta"
}
`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gatekeeper API Hatası:", errText);
      return fallbackDecision(params.rawTitle);
    }

    const data = await res.json();
    const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawResponse) return fallbackDecision(params.rawTitle);

    const parsed: GatekeeperDecision = JSON.parse(rawResponse);
    return parsed;
  } catch (error) {
    console.error("Gatekeeper analizi sırasında hata:", error);
    return fallbackDecision(params.rawTitle);
  }
}

function fallbackDecision(title: string): GatekeeperDecision {
  return {
    shouldPublish: true,
    score: 75,
    reason: "Yedek karar mekanizması devreye girdi.",
    category: "GUNDEM",
    clickWorthyTitle: title,
    searchQueries: [title],
    angle: "Son gelişmeler ve detaylar",
  };
}
