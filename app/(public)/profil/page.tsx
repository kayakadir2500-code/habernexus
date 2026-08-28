import Link from "next/link";
import { User, Bookmark, History, Heart, Sliders, CheckCircle, Sparkles } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="w-full py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profil Başlığı */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-sky-500/20 border-2 border-sky-500/50 flex items-center justify-center text-sky-400 font-black text-2xl shrink-0">
            HN
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">HaberNexus Okuru</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                Aktif Hesap
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Google Hesabı ile Bağlı</p>

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                <div className="text-xl font-bold text-sky-400">18</div>
                <div className="text-[11px] text-slate-400 font-medium">Okunan Haber</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                <div className="text-xl font-bold text-amber-400">4</div>
                <div className="text-[11px] text-slate-400 font-medium">Kaydedilen</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                <div className="text-xl font-bold text-emerald-400">%100</div>
                <div className="text-[11px] text-slate-400 font-medium">Reklamsız</div>
              </div>
            </div>
          </div>
        </div>

        {/* İlgi Alanları Yönetimi (Google News Formatı) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md mb-8">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
            <Sliders className="w-4 h-4" />
            <h3>Sana Özel Akış İlgi Alanları</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Anasayfada ve "Sana Özel" sekmesinde öncelikli görmek istediğin kategorileri seç:
          </p>

          <div className="flex flex-wrap gap-2">
            {["Gündem", "Teknoloji", "Ekonomi", "Dünya", "Spor", "Otomotiv", "Bilim", "Sağlık"].map((cat) => (
              <button
                key={cat}
                className="px-3.5 py-1.5 rounded-xl border border-sky-500/40 bg-sky-500/10 text-sky-300 text-xs font-semibold hover:bg-sky-500 hover:text-slate-950 transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kaydedilenler ve Okuma Geçmişi Sekmeleri */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
            <button className="flex items-center gap-2 text-sm font-bold text-sky-400 border-b-2 border-sky-400 pb-3 -mb-3.5">
              <Bookmark className="w-4 h-4" />
              <span>Kaydedilen Haberler</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-200">
              <History className="w-4 h-4" />
              <span>Son Okuma Geçmişi</span>
            </button>
          </div>

          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 text-slate-400 text-sm">
            Kaydedilen haberler burada listelenir. İlginizi çeken haberleri haber detayındaki yer imi ikonuna tıklayarak buraya ekleyebilirsiniz.
          </div>
        </div>
      </div>
    </div>
  );
}