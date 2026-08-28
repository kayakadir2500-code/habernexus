import { db } from "../db";

export async function matchBestPersona(category: string): Promise<{
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  tone: string;
}> {
  try {
    const matchingPersonas = await db.persona.findMany({
      where: {
        categories: {
          has: category,
        },
      },
    });

    if (matchingPersonas.length > 0) {
      const selected = matchingPersonas[Math.floor(Math.random() * matchingPersonas.length)];
      return selected;
    }

    const firstPersona = await db.persona.findFirst();
    if (firstPersona) {
      return firstPersona;
    }

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