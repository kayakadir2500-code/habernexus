"use client";

import { useState } from "react";
import { SourceModal } from "@/components/admin/SourceModal";
import { Rss, CheckCircle2, Globe, TrendingUp, Loader2 } from "lucide-react";

export function SourceListClient({ initialSources }: { initialSources: any[] }) {
  const [sources, setSources] = useState<any[]>(initialSources || []);
  const [loading, setLoading] = useState(false);

  const refreshSources = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sources");
      const data = await res.json();
      if (data.sources) {
        setSources(data.sources);
      }
    } catch (e) {
      console.error("Kaynaklar yenilenemedi:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Rss className="w-7 h-7 text-amber-400" />
            <span>Gündem & Trend Kaynakları ({sources.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gündemin otomatik tarandığı Google Trends ve özel RSS haber beslemeleri
          </p>
        </div>

        <SourceModal onCreated={refreshSources} />
      </div>

      {loading && (
        <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Kaynaklar güncelleniyor...</span>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white mb-4">Aktif Besleme ve Trend Listesi</h2>

        <div className="space-y-3">
          {sources.map((s) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {s.type === "GOOGLE_TRENDS" ? (
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Globe className="w-5 h-5 text-sky-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{s.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {s.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono truncate max-w-md mt-0.5">
                    {s.url || "Otomatik Google Trends API"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 text-xs font-semibold">
                  {s.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aktif</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}