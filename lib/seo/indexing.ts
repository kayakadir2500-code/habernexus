/**
 * Google Indexing API Entegrasyonu
 * Yeni bir haber yayınlandığı saniyede Google botuna anlık sinyal gönderir.
 */

import { google } from "googleapis";

export async function pingGoogleIndexing(url: string): Promise<{ success: boolean; message: string }> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    console.log(`[Google Indexing] Simülasyon: ${url} için ping sinyali hazırlandı (Gerçek ortamda Service Account aktif olur).`);
    return {
      success: true,
      message: "Simülasyon: Hizmet hesabı bilgileri bekleniyor.",
    };
  }

  try {
    const jwtClient = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey,
      ["https://www.googleapis.com/auth/indexing"],
      undefined
    );

    await jwtClient.authorize();
    const indexing = google.indexing({ version: "v3", auth: jwtClient });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: "URL_UPDATED",
      },
    });

    console.log(`[Google Indexing] Başarılı: ${url}`, response.data);
    return { success: true, message: "Google botuna anlık bildirim gönderildi." };
  } catch (error: any) {
    console.error(`[Google Indexing] Hata (${url}):`, error?.message || error);
    return { success: false, message: error?.message || "Indexing API çağrısı başarısız." };
  }
}
