"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Coffee, ToggleLeft, ToggleRight } from "lucide-react";

export function EthicalSupportBox() {
  const [optInAds, setOptInAds] = useState(false);

  return (
    <div className="w-full my-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Heart className="w-6 h-6 fill-rose-500/20 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-100 text-base">
                HaberNexus Bağımsız Habercilik
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                %100 Ücretsiz & Reklamsız
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Okurlarımızı asla zorunlu reklamlara boğmuyoruz. Bağımsız haber merkezimizin ve araştırmacı habercilik ekibimizin yayın faaliyetlerine katkıda bulunmak isterseniz isteğe bağlı reklamları açabilir veya bize bir kahve ısmarlayabilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={() => setOptInAds(!optInAds)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              optInAds
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            {optInAds ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-400" />
                <span>Destek Reklamları Açık</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-slate-400" />
                <span>Reklamlarla Destek Ol</span>
              </>
            )}
          </button>

          <Link
            href="/destek"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Coffee className="w-4 h-4 fill-slate-950" />
            <span>Bağış Yap</span>
          </Link>
        </div>
      </div>
    </div>
  );
}