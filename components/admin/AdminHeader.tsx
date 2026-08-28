"use client";

import { useState } from "react";
import { Zap, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export function AdminHeader() {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleTriggerPipeline = async () => {
    setLoading(true);
    setStatusMsg("Otonom boru hattı çalışıyor: Trend aranıyor, Gemini yazıyor, Imagen çiziyor...");

    try {
      const res = await fetch("/api/queue/trigger", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setStatusMsg(`✅ Başarılı: "${data.news?.title || "Haber yayınlandı"}" (${data.durationSeconds || 15} sn)`);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setStatusMsg(`⚠️ Bilgi: ${data.message || "İşlem tamamlandı"}`);
      }
    } catch (error: any) {
      setStatusMsg(`❌ Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400">Yönetim Masası</span>
        {statusMsg && (
          <span className="text-xs text-sky-400 bg-sky-950/60 border border-sky-800/60 px-3 py-1 rounded-full animate-pulse">
            {statusMsg}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        <button
          onClick={handleTriggerPipeline}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
              <span>Yapay Zeka Üretiyor...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Şimdi Otonom Haber Üret</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}