/**
 * Akıllı Persona & Yazar Eşleştirici
 * Haberin konusunu ve kategorisini analiz ederek veritabanındaki en uygun AI Personayı seçer.
 */

import { db } from "@/lib/db";

export async function matchBestPersona(category: string): Promise<{
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  tone: string;
}> {
  try {
    // 1. İlgili kategoride uzmanlığı olan bir persona ara
    const matchingPersonas = await db.persona.findMany({
      where: {
        categories: {
          has: category,
        },
      },
    });

    if (matchingPersonas.length > 0) {
      // Rastgele birini veya en az haber yazanı seç
      const selected = matchingPersonas[Math.floor(Math.random() * matchingPersonas.length)];
      return selected;
    }

    // 2. Kategoriye özel persona bulunamadıysa ilk personayı al
    const firstPersona = await db.persona.findFirst();
    if (firstPersona) {
      return firstPersona;
    }

    // 3. Veritabanı boşsa varsayılan döndür
    return {
      id: "default-editor",
      name: "HaberNexus Editör Masası",
      role: "Kıdemli Yayın Kurulu",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      tone: "Profesyonel, tarafsız ve analitik",
    };
  } catch (error) {
    console.error("Persona eşleştirme hatası:", error);
    return {
      id: "default-editor",
      name: "HaberNexus Editör Masası",
      role: "Kıdemli Yayın Kurulu",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      tone: "Profesyonel, tarafsız ve analitik",
    };
  }
}
