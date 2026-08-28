"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function BookmarkButton({ newsId, title }: { newsId: string; title: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem("hn_bookmarks") || "[]");
      setSaved(savedList.includes(newsId));
    } catch {
      // LocalStorage desteği yoksa sessizce geç
    }
  }, [newsId]);

  const toggleSave = () => {
    try {
      const savedList: string[] = JSON.parse(localStorage.getItem("hn_bookmarks") || "[]");
      let updated: string[];

      if (savedList.includes(newsId)) {
        updated = savedList.filter((id) => id !== newsId);
        setSaved(false);
      } else {
        updated = [...savedList, newsId];
        setSaved(true);
      }

      localStorage.setItem("hn_bookmarks", JSON.stringify(updated));
    } catch {
      setSaved(!saved);
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`p-2.5 rounded-xl border transition-all ${
        saved
          ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40"
      }`}
      title={saved ? "Kaydedildi" : "Daha Sonra Oku"}
    >
      {saved ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
    </button>
  );
}