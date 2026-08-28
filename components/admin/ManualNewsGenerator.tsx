"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

const CATEGORIES = [
  "GUNDEM",
  "TEKNOLOJI",
  "EKONOMI",
  "DUNYA",
  "SPOR",
  "OTOMOTIV",
  "BILIM",
  "SAGLIK",
];

export function ManualNewsGenerator() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("GUNDEM");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/news/generate-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        setTopic("");
      } else {
        setError(data.error || data.message || "Haber üretilemedi");
      }
    } catch (e: any) {
      setError(e.message || "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 border border-sky-500/20 shadow-xl mb-8">
      <div className="flex items-center gap-2 mb-2 text-sky-400 font-bold text-sm uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        <span>Hızlı Manuel Haber Üret & Canlıya Al</span>
      </div>
      <p className="text-xs text-slate-400 mb-6">
        İstediğiniz bir konuyu veya başlığı yazın; Gemini canlı Google aramayla araştırsın, 5N1K formatında yazsın, Imagen 16:9 görselini üretsin ve Google botuna bildirsin.
      </p>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Örn: TCMB faiz kararı açıklandı, borsada son durum..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
            className="flex-1 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-sky-500 sm:w-48"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-40 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <span>Hemen Yaz & Yayınla</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {result && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Haber Başarıyla Yayınlandı ({result.durationSeconds || 12} sn):{" "}
                <strong>{result.news?.title}</strong>
              </span>
            </div>
            {result.news?.slug && (
              <a
                href={`/haber/${result.news.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-sky-400 underline hover:text-sky-300 shrink-0"
              >
                Haberi Görüntüle →
              </a>
            )}
          </div>
        )}
      </form>
    </div>
  );
}