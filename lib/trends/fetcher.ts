/**
 * Gündem & Trend Toplama Motoru
 * Google Trends ve RSS beslemelerini ayrıştırır, yinelenenleri eler ve ham konuları çıkarır.
 */

import Parser from "rss-parser";
import { db } from "@/lib/db";

const parser = new Parser({
  customFields: {
    item: [
      ["ht:approx_traffic", "approxTraffic"],
      ["ht:news_item", "newsItems", { keepArray: true }],
      ["ht:picture", "picture"],
    ],
  },
});

export interface TrendCandidate {
  rawTitle: string;
  snippet: string;
  sourceUrl?: string;
  sourceDate?: string;
  sourceName: string;
  category: string;
}

export async function fetchAllActiveTrends(): Promise<TrendCandidate[]> {
  try {
    const sources = await db.contentSource.findMany({
      where: { isActive: true },
    });

    if (sources.length === 0) {
      // Varsayılan kaynaklar
      return [
        {
          rawTitle: "Yapay Zeka ve Otonom Teknolojilerde Yeni Dönem",
          snippet: "Küresel teknoloji devleri yeni nesil modellerini ve günlük hayata etkilerini duyurdu.",
          sourceName: "Trend Masası",
          category: "TEKNOLOJI",
          sourceDate: new Date().toISOString(),
        },
        {
          rawTitle: "Küresel Piyasalarda Kritik Faiz ve Enflasyon Kararları",
          snippet: "Merkez bankalarının son adımları sonrası altın, döviz ve borsa hareketlendi.",
          sourceName: "Finans Masası",
          category: "EKONOMI",
          sourceDate: new Date().toISOString(),
        },
      ];
    }

    const candidates: TrendCandidate[] = [];

    for (const src of sources) {
      if (!src.url) continue;

      try {
        const feed = await parser.parseURL(src.url);
        const items = feed.items.slice(0, 10); // Her kaynaktan en güncel 10 konu

        for (const item of items) {
          if (!item.title) continue;

          // Veritabanında yakın zamanda benzer başlık var mı kontrol et (Deduplication)
          const isDuplicate = await checkDatabaseDuplicate(item.title);
          if (!isDuplicate) {
            candidates.push({
              rawTitle: item.title,
              snippet: item.contentSnippet || item.content || item.summary || "",
              sourceUrl: item.link,
              sourceDate: item.pubDate || item.isoDate,
              sourceName: src.name,
              category: src.category || "GUNDEM",
            });
          }
        }
      } catch (err) {
        console.warn(`Kaynak okunamadı (${src.name} - ${src.url}):`, err);
      }
    }

    return candidates;
  } catch (error) {
    console.error("Trend çekme hatası:", error);
    return [];
  }
}

async function checkDatabaseDuplicate(title: string): Promise<boolean> {
  try {
    const cleanWords = title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (cleanWords.length === 0) return false;

    // Başlığın anahtar kelimelerinden biri son 7 günde yayınlanan haberlerde var mı?
    const existing = await db.news.findFirst({
      where: {
        title: {
          contains: cleanWords[0],
          mode: "insensitive",
        },
        publishedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return !!existing;
  } catch {
    return false;
  }
}
