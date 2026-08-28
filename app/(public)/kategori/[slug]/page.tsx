import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Clock, ChevronRight, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_MAP: Record<string, { title: string; desc: string }> = {
  gundem: { title: "GÜNDEM", desc: "Türkiye ve dünya gündemindeki en sıcak gelişmeler, canlı teyitli haberler." },
  teknoloji: { title: "TEKNOLOJİ", desc: "Yapay zeka, otonom sistemler, tüketici elektroniği ve siber dünya analizleri." },
  ekonomi: { title: "EKONOMİ", desc: "Küresel piyasalar, borsa, altın, kripto para ve makroekonomik veriler." },
  dunya: { title: "DÜNYA", desc: "Uluslararası ilişkiler, diplomasi ve küresel krizlerin perde arkası." },
  spor: { title: "SPOR", desc: "Süper Lig, Avrupa ligleri, transferler ve tüm branşlardan sıcak gelişmeler." },
  otomotiv: { title: "OTOMOTİV", desc: "Elektrikli otomobiller, yeni modeller, test sürüşleri ve gelecek mobilitesi." },
  bilim: { title: "BİLİM", desc: "Uzay araştırmaları, fizik, çevre ve çığır açan bilimsel buluşlar." },
  saglik: { title: "SAĞLIK", desc: "Tıp dünyasındaki son araştırmalar, sağlıklı yaşam ve biyoteknoloji." },
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const catInfo = CATEGORY_MAP[slug.toLowerCase()];

  if (!catInfo) {
    notFound();
  }

  const newsList = await db.news.findMany({
    where: {
      category: { equals: catInfo.title, mode: "insensitive" },
      isPublished: true,
    },
    include: { persona: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kategori Başlığı */}
        <div className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-950 border border-sky-500/20">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Kategori Gündemi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
            {catInfo.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            {catInfo.desc}
          </p>
        </div>

        {/* Haber Listesi */}
        {newsList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
            <p className="text-slate-400">Bu kategoride henüz yayınlanmış haber bulunmuyor.</p>
            <Link href="/" className="inline-block mt-4 text-sky-400 font-semibold hover:underline">
              Anasayfaya Dön
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((item) => (
              <Link
                key={item.id}
                href={`/haber/${item.slug}`}
                className="group flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-sky-500/40 hover:bg-slate-900 transition-all shadow-md"
              >
                <div className="relative w-full aspect-[16/9] bg-slate-800 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-700 text-sky-400 text-xs font-bold">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 leading-snug group-hover:text-sky-300 transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-300">
                      {item.persona?.name}
                    </span>
                    <div className="flex items-center gap-1 text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Oku</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}