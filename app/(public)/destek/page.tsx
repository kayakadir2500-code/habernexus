import Link from "next/link";
import { Heart, Coffee, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="w-full py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Bağımsız Yayıncılık</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            HaberNexus'a Destek Olun
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Okurlarımızı zorunlu reklamlara ve yanıltıcı başlıklara maruz bırakmıyoruz. 
            Bağımsız haber merkezimizin, araştırmacı muhabir ekibimizin ve 7/24 kesintisiz yayın altyapımızın sürdürülebilirliğine katkıda bulunabilirsiniz.
          </p>
        </div>

        {/* 2 Destek Seçeneği */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Seçenek 1: Bir Kahve Ismarla */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Coffee className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Haber Masasına Kahve Ismarla</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Tek seferlik veya düzenli küçük bir bağış ile bağımsız haber odamızın yayın faaliyetlerine destek olun ve profilinizde özel "Destekçi" rozeti kazanın.
              </p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {["50 ₺", "100 ₺", "250 ₺"].map((amount) => (
                  <button
                    key={amount}
                    className="py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-sm font-bold text-slate-200 hover:border-amber-500 hover:text-amber-400 transition-all"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all">
              Güvenli Bağış Yap
            </button>
          </div>

          {/* Seçenek 2: İsteğe Bağlı Reklamlar */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-sky-500/30 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">İsteğe Bağlı Reklamları Aç</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Maddi ödeme yapmadan destek olmak isterseniz, sayfalarda sadece sizin için gösterilecek sade ve estetik reklam alanlarını açabilirsiniz.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Asla rahatsız edici pop-up reklamlar gösterilmez</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>İstediğiniz zaman tek tıkla tekrar kapatabilirsiniz</span>
                </li>
              </ul>
            </div>

            <Link
              href="/profil"
              className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm text-center shadow-lg shadow-sky-500/25 transition-all"
            >
              Profilimden Reklamları Yönet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}