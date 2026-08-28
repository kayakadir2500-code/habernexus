"use client";

import { useState } from "react";
import { Share2, Link as LinkIcon, Check, Send } from "lucide-react";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/haber/${slug}`;
    }
    return `https://habernexus.com/haber/${slug}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(`${title} - HaberNexus: `);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, "_blank");
  };

  const shareTwitter = () => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(`${title} @habernexus`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      {/* WhatsApp */}
      <button
        onClick={shareWhatsApp}
        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
        title="WhatsApp'ta Paylaş"
      >
        <span>WhatsApp</span>
      </button>

      {/* Twitter / X */}
      <button
        onClick={shareTwitter}
        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
        title="X'te Paylaş"
      >
        <span>X (Twitter)</span>
      </button>

      {/* Bağlantıyı Kopyala */}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
        title="Bağlantıyı Kopyala"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}