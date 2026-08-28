import Link from "next/link";
import { Radio, Heart, ShieldCheck, Newspaper } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Kolon 1: Logo & Hakkında */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
              <Radio className="w-4 h-4 text-slate-950" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg text-white">HABER</span>
              <span className="font-extrabold text-lg text-sky-400">NEXUS</span>
            </div>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Türkiye ve dünya gündemindeki en sıcak gelişmeleri, tarafsızlık ve doğruluk ilkeleriyle okuyucularına ulaştıran 7/24 bağımsız dijital haber ajansı.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Google Haberler (Google News) Standartlarında</span>
          </div>
        </div>

        {/* Kolon 2: Kategoriler */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Kategoriler
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/kategori/gundem" className="hover:text-sky-400 transition-colors">Gündem</Link></li>
            <li><Link href="/kategori/teknoloji" className="hover:text-sky-400 transition-colors">Teknoloji</Link></li>
            <li><Link href="/kategori/ekonomi" className="hover:text-sky-400 transition-colors">Ekonomi & Finans</Link></li>
            <li><Link href="/kategori/dunya" className="hover:text-sky-400 transition-colors">Dünya</Link></li>
            <li><Link href="/kategori/spor" className="hover:text-sky-400 transition-colors">Spor</Link></li>
            <li><Link href="/kategori/otomotiv" className="hover:text-sky-400 transition-colors">Otomotiv</Link></li>
          </ul>
        </div>

        {/* Kolon 3: Kurumsal & Standartlar */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Yayın İlkeleri
          </h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white">5N1K Haber Doğruluk Kriteri</span></li>
            <li><span className="hover:text-white">Çift Kaynaklı Teyit İlkesi</span></li>
            <li><span className="hover:text-white">Tarafsızlık ve Kamu Yararı</span></li>
            <li><span className="hover:text-white">Kişisel Verilerin Korunması</span></li>
            <li><Link href="/destek" className="text-amber-400 hover:underline">Bağımsız Yayıncılığa Destek</Link></li>
          </ul>
        </div>

        {/* Kolon 4: Haber Merkezi Güvencesi */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            HaberNexus Masası
          </h4>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span>Haber Masası:</span>
              <span className="font-semibold text-sky-400">7/24 Kesintisiz Yayın</span>
            </div>
            <div className="flex justify-between">
              <span>Teyit Standardı:</span>
              <span className="font-semibold text-sky-400">Doğrulanmış Ajans Verisi</span>
            </div>
            <div className="flex justify-between">
              <span>Google İndeksleme:</span>
              <span className="font-semibold text-emerald-400">Anlık & Resmi</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} HaberNexus. Tüm hakları saklıdır.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sitemap.xml" className="hover:text-slate-400">Sitemap XML</Link>
          <Link href="/news-sitemap.xml" className="hover:text-slate-400">Google News XML</Link>
          <Link href="/admin" className="text-slate-600 hover:text-slate-400">Yönetim</Link>
        </div>
      </div>
    </footer>
  );
}