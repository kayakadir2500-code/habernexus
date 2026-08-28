import Link from "next/link";
import { Zap } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
}

export function BreakingNewsTicker({ items }: { items: NewsItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 py-2.5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-md text-xs font-bold shrink-0 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-rose-400 animate-pulse" />
          <span>Son Dakika</span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center gap-6 text-sm text-slate-300">
          {items.map((news, idx) => (
            <Link
              key={news.id}
              href={`/haber/${news.slug}`}
              className="inline-flex items-center gap-2 hover:text-sky-400 transition-colors shrink-0"
            >
              <span className="text-slate-500 font-bold">#{idx + 1}</span>
              <span>{news.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
