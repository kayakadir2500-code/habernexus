import { db } from "@/lib/db";
import { SourceListClient } from "@/components/admin/SourceListClient";

export const revalidate = 0;

export default async function SourcesPage() {
  let sources: any[] = [];
  try {
    sources = await db.contentSource.findMany({
      orderBy: { createdAt: "asc" },
    });
  } catch (e) {
    console.warn("Kaynaklar yüklenemedi:", e);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <SourceListClient initialSources={sources} />
    </div>
  );
}