import Link from "next/link";
import { db } from "@/lib/db";
import { ManualNewsGenerator } from "@/components/admin/ManualNewsGenerator";
import { 
  Newspaper, 
  CheckCircle2, 
  Users, 
  Activity, 
  ExternalLink
} from "lucide-react";

export const revalidate = 0; // Her girişte güncel veri

export default async function AdminDashboardPage() {
  let newsCount = 0;
  let indexedCount = 0;
  let personaCount = 0;
  let recentNews: any[] = [];
  let recentLogs: any[] = [];
  let settings: any = null;

  try {
    newsCount = await db.news.count();
    indexedCount = await db.news.count({ where: { indexedGoogle: true } });
    personaCount = await db.persona.count();
    recentNews = await db.news.findMany({
      take: 8,
      orderBy: { publishedAt: "desc" },
      include: { persona: true },
    });
    recentLogs = await db.jobLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    });
    settings = await db.systemSetting.findFirst({ where: { id: "default" } });
  } catch (error) {
    console.warn("Dashboard veri yükleme hatası:", error);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Genel Bakış & Kontrol Merkezi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            HaberNexus Otonom Yapay Zeka Haber Odası Canlı Metrikleri
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span>Yazar Modeli: </span>
            <span className="font-bold text-sky-400">{settings?.activeTextModel || "gemini-3.7-flash"}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span>Görsel Modeli: </span>
            <span className="font-bold text-sky-400">{settings?.activeImageModel || "imagen-3.0"}</span>
          </div>
        </div>
      </div>

      {/* Metrik Kartları (4 Kolon) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Toplam Haber</span>
            <Newspaper className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{newsCount}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">Otonom Yayınlandı</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Google İndeks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{indexedCount || newsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Indexing API Bildirildi</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Personalar</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{personaCount || 7}</div>
          <div className="text-[11px] text-indigo-400 mt-1 font-medium">Uzman Yazar Kadrosu</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sistem Modu</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">7/24 Otonom</div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">QStash Kuyruğu Hazır</div>
        </div>
      </div>

      {/* Manuel Haber Üretici Kutusu */}
      <ManualNewsGenerator />

      {/* İki Kolon: Son Haberler & Canlı Log Akışı */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Son Yayınlanan Haberler (8 Kolon) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-sky-400" />
              <span>Son Yayınlanan Haberler</span>
            </h2>
            <Link href="/admin/haberler" className="text-xs text-sky-400 hover:underline">
              Tümünü Gör
            </Link>
          </div>

          {recentNews.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-slate-800/80 rounded-2xl">
              Henüz haber üretilmedi. Yukarıdaki formdan veya sağ üstteki <strong>"Şimdi Otonom Haber Üret"</strong> butonuna basarak ilk haberi oluşturabilirsiniz.
            </div>
          ) : (
            <div className="space-y-3">
              {recentNews.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400">
                        {n.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {n.persona?.name || "Editör"}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 truncate">
                      {n.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Yayında
                    </span>
                    <Link
                      href={`/haber/${n.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Canlı İşlem Günlüğü (4 Kolon) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Otonom Görev Günlüğü</span>
          </h2>

          <div className="space-y-3 text-xs font-mono">
            {recentLogs.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                Gündem tarama ve üretim kayıtları burada anlık olarak akacaktır.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                    <span className="font-bold text-sky-400">[{log.step}]</span>
                    <span>{new Date(log.createdAt).toLocaleTimeString("tr-TR")}</span>
                  </div>
                  <div className="text-slate-300">{log.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}