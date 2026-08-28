"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, Clock, ChevronRight } from "lucide-react";

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced Arama
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (e) {
        console.error("Arama hatası:", e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm">
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
      />

      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Arama Input Alanı */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Haber veya konu arayın (örn: Faiz, Yapay Zeka, Şampiyonlar Ligi)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Sonuçlar Listesi */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="py-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Haberler taranıyor...</span>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              "{query}" ile eşleşen bir haber bulunamadı.
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Sonuçlar ({results.length})
              </div>
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/haber/${item.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-950 transition-all"
                >
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <Image
                      src={item.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-sky-400 uppercase">
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                      {item.title}
                    </h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </Link>
              ))}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="py-6 text-center text-xs text-slate-500">
              Aramak istediğiniz anahtar kelimeyi yazın.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}