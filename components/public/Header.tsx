"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Heart, 
  Radio
} from "lucide-react";
import { SearchModal } from "@/components/public/SearchModal";

const CATEGORIES = [
  { id: "tum-haberler", label: "Tümü", href: "/" },
  { id: "gundem", label: "Gündem", href: "/kategori/gundem" },
  { id: "teknoloji", label: "Teknoloji", href: "/kategori/teknoloji" },
  { id: "ekonomi", label: "Ekonomi", href: "/kategori/ekonomi" },
  { id: "dunya", label: "Dünya", href: "/kategori/dunya" },
  { id: "spor", label: "Spor", href: "/kategori/spor" },
  { id: "otomotiv", label: "Otomotiv", href: "/kategori/otomotiv" },
  { id: "bilim", label: "Bilim", href: "/kategori/bilim" },
  { id: "saglik", label: "Sağlık", href: "/kategori/saglik" },
];

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        {/* Üst Canlı Çubuk */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400">CANLI YAYIN:</span>
              <span className="text-slate-300 truncate max-w-[240px] sm:max-w-md">
                HaberNexus 7/24 Haber Merkezi & Muhabir Ağı Aktif
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-slate-400">
              <Link href="/destek" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Destek Ol</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Ana Navigasyon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Mobil Menü Butonu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all">
                  <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Radio className="w-5 h-5 text-sky-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xl tracking-tight text-white">HABER</span>
                    <span className="font-extrabold text-xl tracking-tight text-sky-400">NEXUS</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase -mt-1">
                    Bağımsız Haber Ajansı
                  </span>
                </div>
              </Link>
            </div>

            {/* Masaüstü Kategoriler */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Sağ Aksiyonlar: Arama & Giriş */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-sky-400 transition-all"
                title="Haber Ara"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                href="/profil"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                  G
                </div>
                <span className="hidden sm:inline">Giriş Yap</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobil Menü Çekmecesi */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase px-3 py-1 tracking-wider">
              Kategoriler
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <div className="border-t border-slate-800 pt-3 mt-3">
              <Link
                href="/destek"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-amber-400 hover:bg-slate-800"
              >
                <Heart className="w-5 h-5 text-rose-500" />
                <span>HaberNexus'a Destek Ol</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Canlı Arama Modalı */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}