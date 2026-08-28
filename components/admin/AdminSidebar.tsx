"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Cpu, 
  Users, 
  Rss, 
  Newspaper, 
  ExternalLink, 
  Sparkles,
  Zap,
  Activity
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Genel Bakış & Loglar", href: "/admin", icon: LayoutDashboard },
  { label: "Yapay Zeka Ayarları", href: "/admin/ai-ayarlari", icon: Cpu },
  { label: "AI Personalar", href: "/admin/personalar", icon: Users },
  { label: "Gündem & Kaynaklar", href: "/admin/kaynaklar", icon: Rss },
  { label: "Haber Yönetimi", href: "/admin/haberler", icon: Newspaper },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950 p-4 lg:p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 font-extrabold text-lg text-white">
              <span>NEXUS</span>
              <span className="text-sky-400">ADMIN</span>
            </div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Otonom Mod Aktif</span>
            </div>
          </div>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar py-2 lg:py-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
                  isActive
                    ? "bg-sky-500/15 border border-sky-500/30 text-sky-300 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Alt Aksiyon: Siteye Git */}
      <div className="hidden lg:block pt-6 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
        >
          <span>Portalı Görüntüle</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </aside>
  );
}