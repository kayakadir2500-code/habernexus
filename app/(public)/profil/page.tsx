"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { User, Bookmark, History, Heart, LogOut, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
        Profil yükleniyor...
      </div>
    );
  }

  // Giriş Yapmamış Kullanıcı Görünümü
  if (!session?.user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 mx-auto shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <User className="w-8 h-8 text-sky-400" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white">HaberNexus'a Giriş Yap</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Google hesabınızla tek tıkla giriş yaparak okuma listenizi senkronize edebilir, haberlere yorum yapabilir ve ilgi alanlarınızı kişiselleştirebilirsiniz.
            </p>
          </div>

          {/* Google ile Giriş Yap Butonu */}
          <button
            onClick={() => signIn("google")}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-white/5 active:scale-98"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google ile Giriş Yap</span>
          </button>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Giriş yaparak HaberNexus Yayın İlkeleri ve Gizlilik Sözleşmesi'ni kabul etmiş olursunuz.
          </div>
        </div>
      </div>
    );
  }

  // Giriş Yapmış Kullanıcı Görünümü
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Kullanıcı Kartı */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-400 shrink-0">
            <Image
              src={session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
              alt={session.user.name || "Kullanıcı"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{session.user.name}</h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Doğrulanmış Okur</span>
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">{session.user.email}</div>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 text-xs font-semibold transition-all self-start sm:self-center"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Çıkış Yap</span>
        </button>
      </div>

      {/* Okuma İstatistikleri & Tercihler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Okuma Durumu
          </div>
          <div className="text-2xl font-black text-white">Aktif</div>
          <div className="text-[11px] text-sky-400 mt-1">Son haberler senkronize</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Hesap Güvenliği
          </div>
          <div className="text-2xl font-black text-emerald-400">Google Korumalı</div>
          <div className="text-[11px] text-slate-400 mt-1">OAuth 2.0 İki Aşamalı</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Yayın Tercihi
          </div>
          <div className="text-2xl font-black text-indigo-400">%100 Reklamsız</div>
          <div className="text-[11px] text-slate-400 mt-1">Doğal gazete deneyimi</div>
        </div>
      </div>

      {/* Hızlı Erişim Bağlantıları */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/"
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-950 transition-all text-xs font-semibold text-slate-200"
          >
            <span>📰 Son Haberleri Keşfet</span>
            <ArrowRight className="w-4 h-4 text-sky-400" />
          </Link>
          <Link
            href="/destek"
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-950 transition-all text-xs font-semibold text-slate-200"
          >
            <span>☕ HaberNexus'a Destek Ol</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}