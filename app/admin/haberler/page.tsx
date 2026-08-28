import { db } from "@/lib/db";
import { NewsTableClient } from "@/components/admin/NewsTableClient";

export const revalidate = 0;

export default async function AdminNewsPage() {
  let allNews: any[] = [];
  try {
    allNews = await db.news.findMany({
      include: { persona: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (e) {
    console.warn("Haberler yüklenemedi:", e);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <NewsTableClient initialNews={allNews} />
    </div>
  );
}