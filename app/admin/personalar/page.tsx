import { db } from "@/lib/db";
import { PersonaListClient } from "@/components/admin/PersonaListClient";

export const revalidate = 0;

export default async function PersonasPage() {
  let personas: any[] = [];
  try {
    personas = await db.persona.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (e) {
    console.warn("Personalar yüklenemedi:", e);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PersonaListClient initialPersonas={personas} />
    </div>
  );
}