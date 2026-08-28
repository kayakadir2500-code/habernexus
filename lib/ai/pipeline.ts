/**
 * HaberNexus Otonom Haber Üretim Boru Hattı (Master Pipeline)
 * Keşif -> Gatekeeper -> Grounding Writer -> Persona Atama -> Imagen Görsel -> TTS Ses -> DB Kaydı -> Google Indexing Ping
 */

import { db } from "@/lib/db";
import { fetchAllActiveTrends } from "@/lib/trends/fetcher";
import { evaluateNewsTopic } from "@/lib/ai/gatekeeper";
import { writeFullArticleWithGrounding } from "@/lib/ai/writer";
import { matchBestPersona } from "@/lib/ai/personaMatcher";
import { generateEditorialNewsImage } from "@/lib/ai/imageStudio";
import { generateArticleAudio } from "@/lib/tts/audioStudio";
import { pingGoogleIndexing } from "@/lib/seo/indexing";

export async function runAutonomousNewsPipeline(manualTopic?: string, manualCategory?: string) {
  const startTime = Date.now();
  console.log("🚀 [HaberNexus Pipeline] Otonom üretim süreci başlatıldı...");

  // 1. Sistem Ayarlarını Oku
  const settings = await db.systemSetting.findFirst({ where: { id: "default" } });
  const textModel = settings?.activeTextModel || "gemini-3.7-flash";
  const imageModel = settings?.activeImageModel || "imagen-3.0-generate-002";
  const ttsVoice = settings?.activeTtsVoice || "tr-TR-Standard-A";

  let topicToProcess: {
    rawTitle: string;
    snippet?: string;
    sourceDate?: string;
    category?: string;
  };

  if (manualTopic) {
    topicToProcess = {
      rawTitle: manualTopic,
      snippet: "Manuel yönetici talebi",
      category: manualCategory || "GUNDEM",
    };
  } else {
    // 2. Trendleri Tara
    const trends = await fetchAllActiveTrends();
    if (trends.length === 0) {
      console.log("⚠️ İşlenecek yeni trend bulunamadı.");
      return { success: false, message: "İşlenecek yeni trend bulunamadı." };
    }
    topicToProcess = trends[0];
  }

  // 3. Gatekeeper (Yayın Yönetmeni Süzgeci)
  console.log(`🔍 [Gatekeeper] Konu analiz ediliyor: "${topicToProcess.rawTitle}"...`);
  const decision = await evaluateNewsTopic({
    rawTitle: topicToProcess.rawTitle,
    rawSnippet: topicToProcess.snippet,
    sourceDate: topicToProcess.sourceDate,
    activeModel: textModel,
  });

  if (!decision.shouldPublish) {
    console.log(`❌ [Gatekeeper] Konu elendi: ${decision.reason}`);
    await db.jobLog.create({
      data: {
        step: "GATEKEEPER",
        status: "SKIPPED",
        message: `Konu elendi: ${topicToProcess.rawTitle} (${decision.reason})`,
      },
    });
    return { success: false, message: `Konu elendi: ${decision.reason}` };
  }

  // 4. Persona Seçimi
  const assignedPersona = await matchBestPersona(decision.category);
  console.log(`✍️ [Persona] Yazar atandı: ${assignedPersona.name} (${assignedPersona.role})`);

  // 5. Gemini Yazar & Canlı Google Search Grounding
  console.log(`📝 [Writer] Gemini ile haber yazılıyor & canlı teyit ediliyor...`);
  const articleData = await writeFullArticleWithGrounding({
    workingTitle: decision.clickWorthyTitle,
    category: decision.category,
    searchQueries: decision.searchQueries,
    angle: decision.angle,
    personaName: assignedPersona.name,
    personaTone: assignedPersona.tone,
    activeModel: textModel,
  });

  // 6. Imagen Basın Görseli Üretimi
  console.log(`🎨 [Imagen] 16:9 Gerçekçi basın fotoğrafı üretiliyor...`);
  const imageUrl = await generateEditorialNewsImage({
    prompt: articleData.imagePrompt,
    headlineTitle: articleData.title,
    activeModel: imageModel,
  });

  // 7. Veritabanına Kaydet
  console.log(`💾 [DB] Haber veritabanına kaydediliyor...`);
  const createdNews = await db.news.create({
    data: {
      title: articleData.title,
      slug: articleData.slug,
      summary: articleData.summary,
      content: articleData.content,
      category: articleData.category,
      tags: articleData.tags,
      imageUrl: imageUrl,
      imageAlt: articleData.imageAlt,
      imageCaption: articleData.imageCaption,
      metaTitle: articleData.metaTitle,
      metaDescription: articleData.metaDescription,
      readingTime: articleData.readingTime,
      faqData: articleData.faqData,
      sources: articleData.sources,
      personaId: assignedPersona.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // 8. Doğal Sesli Spiker Üretimi (Arka planda)
  try {
    const audioUrl = await generateArticleAudio({
      articleId: createdNews.id,
      title: createdNews.title,
      summary: createdNews.summary,
      voiceName: ttsVoice,
    });
    if (audioUrl) {
      await db.news.update({
        where: { id: createdNews.id },
        data: { audioUrl },
      });
    }
  } catch (err) {
    console.warn("Ses üretimi atlandı:", err);
  }

  // 9. Google Indexing API Anlık Ping
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const newsUrl = `${appUrl}/haber/${createdNews.slug}`;
  await pingGoogleIndexing(newsUrl);

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  console.log(`✅ [HaberNexus Pipeline] Haber başarıyla yayınlandı (${durationSec}s): "${createdNews.title}"`);

  // Log kaydı
  await db.jobLog.create({
    data: {
      step: "PUBLISH",
      status: "SUCCESS",
      message: `Haber yayınlandı: ${createdNews.title} (${durationSec} sn)`,
      details: { newsId: createdNews.id, slug: createdNews.slug, category: createdNews.category },
    },
  });

  return {
    success: true,
    news: createdNews,
    durationSeconds: durationSec,
  };
}
