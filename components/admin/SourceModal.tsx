"use client";

import { useState } from "react";
import { Plus, X, Globe, TrendingUp } from "lucide-react";

export function SourceModal({ onCreated }: { onCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("RSS");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("GUNDEM");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          url: url.trim() || null,
          category,
        }),
      });

      if (res.ok) {
        setIsOpen(false);
        setName("");
        setUrl("");
        onCreated();
      }
    } catch (e) {
      console.error("Kaynak eklenirken hata:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Yeni Kaynak Ekle</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Yeni Gündem / RSS Kaynağı</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Kaynak Adı:</label>
                <input
                  type="text"
                  placeholder="Örn: Reuters Dünya RSS veya TRT Haber"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Kaynak Türü:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="RSS">Özel RSS Beslemesi (XML Feed)</option>
                  <option value="GOOGLE_TRENDS">Google Trends Coğrafi Beslemesi</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">RSS URL Adresi:</label>
                <input
                  type="url"
                  placeholder="https://example.com/rss/feed.xml"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Varsayılan Kategori:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="GUNDEM">GÜNDEM</option>
                  <option value="TEKNOLOJI">TEKNOLOJİ</option>
                  <option value="EKONOMI">EKONOMİ</option>
                  <option value="DUNYA">DÜNYA</option>
                  <option value="SPOR">SPOR</option>
                  <option value="OTOMOTIV">OTOMOTİV</option>
                  <option value="BILIM">BİLİM</option>
                  <option value="SAGLIK">SAĞLIK</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || !name}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-40"
                >
                  {loading ? "Kaydediliyor..." : "Kaynağı Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}