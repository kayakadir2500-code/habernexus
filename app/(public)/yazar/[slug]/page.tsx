import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CheckCircle2, ChevronRight, Newspaper } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;

  const persona = await db.persona.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!persona) {
    notFound();
  }

  return (
    <div className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Yazar Profil Kartı */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-sky-500/40 shadow-2xl shrink-0">
            <Image
              src={persona.avatarUrl}
              alt={persona.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {persona.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Doğrulanmış Kıdemli Yazar</span>
              </span>
            </div>

            <div className="text-sm font-semibold text-sky-400 mb-3">
              {persona.role}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mb-4">
              {persona.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {persona.categories.map((cat: string) => (
                <span key={cat} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                  #{cat}
                </span>
              ))}
              <span className="px-3 py-1 rounded-lg bg-slate-800/50 text-slate-400 text-xs">
                {persona.articles.length} Yayınlanmış Makale
              </span>
            </div>
          </div>
        </div>

        {/* Yazara Ait Makaleler */}
        <div>
          <div className="flex items-center gap-2 mb-6 text-lg font-bold text-white">
            <Newspaper className="w-5 h-5 text-sky-400" />
            <h2>Yazarın Kaleme Aldığı Haberler</h2>
          </div>

          {persona.articles.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
              Henüz yayınlanmış bir makale bulunmuyor.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {persona.articles.map((item) => (
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
                      <span>{item.readingTime} dk okuma</span>
                      <div className="flex items-center gap-1 text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
                        <span>Habere Git</span>
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
    </div>
  );
}