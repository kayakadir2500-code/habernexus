"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight, Loader2, Sparkles, Filter } from "lucide-react";

const TABS = [
  { id: "ALL", label: "Tüm Akış" },
  { id: "GUNDEM", label: "Gündem" },
  { id: "TEKNOLOJI", label: "Teknoloji" },
  { id: "EKONOMI", label: "Ekonomi" },
  { id: "DUNYA", label: "Dünya" },
  { id: "SPOR", label: "Spor" },
  { id: "OTOMOTIV", label: "Otomotiv" },
  { id: "BILIM", label: "Bilim" },
  { id: "SAGLIK", label: "Sağlık" },
];

export function InfiniteFeed({ initialNews }: { initialNews: any[] }) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [news, setNews] = useState<any[]>(initialNews || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Tab değiştiğinde yeniden çek
  useEffect(() => {
    setPage(1);
    setNews([]);
    setHasMore(true);
    fetchNews(1, activeTab, true);
  }, [activeTab]);

  const fetchNews = async (pageNum: number, category: string, reset: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news/feed?page=${pageNum}&limit=6&category=${category}`);
      const data = await res.json();

      if (data.success) {
        if (reset) {
          setNews(data.data.length > 0 ? data.data : (category === "ALL" ? initialNews : []));
        } else {
          setNews((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.hasMore);
      }
    } catch (e) {
      console.error("Haber akışı çekme hatası:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, activeTab, false);
  };

  return (
    <div className="w-full space-y-8">
      {/* Kategori Sekmeleri */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-800/80">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Haber Kartları Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link
            key={item.id || item.slug}
            href={`/haber/${item.slug}`}
            className="group flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden hover:border-sky-500/40 hover:bg-slate-900 transition-all shadow-md"
          >
            <div className="relative w-full aspect-[16/9] bg-slate-800 overflow-hidden">
              <Image
                src={item.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80"}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-700 text-sky-400 text-xs font-bold uppercase tracking-wider">
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

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">
                  {item.persona?.name || "HaberNexus Masası"}
                </span>
                <div className="flex items-center gap-1 text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Habere Git</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Daha Fazla Yükle Butonu */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-850 text-slate-200 text-xs font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                <span>Haberler Yükleniyor...</span>
              </>
            ) : (
              <span>Daha Fazla Haber Göster</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}