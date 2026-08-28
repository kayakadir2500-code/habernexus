/**
 * Görsel Optimizasyon & Depolama Servisi
 * Üretilen basın fotoğraflarını 16:9 WebP formatına dönüştürür (~80-120 KB)
 * Vercel Blob veya yerel depolamaya kaydeder.
 */

import sharp from "sharp";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

export async function optimizeAndStoreImage(
  imageBuffer: Buffer,
  filenamePrefix: string = "news"
): Promise<string> {
  try {
    // 1. Sharp ile 16:9 Oranında Kırp & WebP'ye Dönüştür
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(1200, 675, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    const filename = `${filenamePrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;

    // 2. Vercel Blob Varsa Yükle
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`news/${filename}`, optimizedBuffer, {
        access: "public",
        contentType: "image/webp",
      });
      return blob.url;
    }

    // 3. Yerel Fallback (public/uploads/)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, optimizedBuffer);

    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Görsel optimizasyon hatası:", error);
    // Hata durumunda yüksek kaliteli placeholder döndür
    return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80";
  }
}
