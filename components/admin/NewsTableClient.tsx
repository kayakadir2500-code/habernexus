"use client";

import { useState } from "react";
import Link from "next/link";
import { Newspaper, CheckCircle2, ExternalLink, Trash2, Loader2 } from "lucide-react";

export function NewsTableClient({ initialNews }: { initialNews: any[] }) {
  const [news, setNews] = useState<any[]>(initialNews || []);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" başlıklı haberi silmek istediğinize emin misiniz?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNews((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      console.error("Haber silinemedi:", e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Newspaper className="w-7 h-7 text-sky-400" />
          <span>Tüm Yayınlanan Haberler ({news.length})</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Otonom olarak üretilen ve yayınlanan tüm makalelerin listesi ve indeksleme durumu
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Başlık</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Yazar</th>
                <th className="p-4">Yayın Tarihi</th>
                <th className="p-4">Okunma</th>
                <th className="p-4">Google İndeks</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Henüz yayınlanmış bir haber bulunmuyor.
                  </td>
                </tr>
              ) : (
                news.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-white max-w-xs truncate">
                      {n.title}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 font-bold">
                        {n.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{n.persona?.name || "Editör"}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(n.publishedAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-4 font-mono">{n.viewCount || 0}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>İndekslendi</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/haber/${n.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                          title="Haberi Görüntüle"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(n.id, n.title)}
                          disabled={deletingId === n.id}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors disabled:opacity-50"
                          title="Haberi Sil"
                        >
                          {deletingId === n.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}