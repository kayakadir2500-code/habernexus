import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { BreakingNewsTicker } from "@/components/public/BreakingNewsTicker";
import { EthicalSupportBox } from "@/components/public/EthicalSupportBox";
import { InfiniteFeed } from "@/components/public/InfiniteFeed";
import { Clock, Flame } from "lucide-react";

export const revalidate = 60; // 60 saniyede bir ISR yenileme

export default async function HomePage() {
  let allNews: any[] = [];
  let breakingNews: any[] = [];

  try {
    allNews = await db.news.findMany({
      where: { isPublished: true },
      include: { persona: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    breakingNews = allNews.slice(0, 5);
  } catch (error) {
    console.warn("DB haberleri çekilirken hata (İlk çalıştırma olabilir):", error);
  }

  const featured = allNews[0] || getMockHeroNews();
  const secondaryNews = allNews.slice(1, 4);
  const remainingNews = allNews.slice(4);

  return (
    <div className="w-full">
      {/* Son Dakika Bandı */}
      <BreakingNewsTicker items={breakingNews.length > 0 ? breakingNews : [featured]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ÜST MANŞET IZGARASI (HERO 16:9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Ana Manşet (8 Kolon) */}
          <div className="lg:col-span-8">
            <Link
              href={`/haber/${featured.slug}`}
              className="group relative block w-full aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-300 hover:border-sky-500/50"
            >
              <Image
                src={featured.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80"}
                alt={featured.imageAlt || featured.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-300 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{featured.readingTime || 3} dk okuma</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 group-hover:text-sky-300 transition-colors">
                  {featured.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 line-clamp-2 mb-4 font-normal">
                  {featured.summary}
                </p>

                {featured.persona && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-sky-400">
                      <Image
                        src={featured.persona.avatarUrl}
                        alt={featured.persona.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-slate-200">{featured.persona.name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">HaberNexus Teyit Masası Onaylı</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Yan Manşetler (4 Kolon) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Öne Çıkan Gündem</span>
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {(secondaryNews.length > 0 ? secondaryNews : getMockSecondaryNews()).map((item: any) => (
                <Link
                  key={item.id || item.slug}
                  href={`/haber/${item.slug}`}
                  className="group flex items-center gap-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/30 hover:bg-slate-900 transition-all shadow-sm"
                >
                  <div className="relative w-24 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <Image
                      src={item.imageUrl || "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&auto=format&fit=crop&q=80"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-sky-300 transition-colors mt-0.5">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{item.readingTime || 3} dk</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* GOOGLE NEWS TARZI SANA ÖZEL VE DİNAMİK HABER AKIŞI */}
        <div className="mt-12">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Sana Özel Akış & Son Gelişmeler</h2>
              <p className="text-xs text-slate-400">Haber merkezimizin canlı teyit masasında hazırlanan son gelişmeler</p>
            </div>
          </div>

          {/* İstemci Taraflı Sonsuz Akış & Kategori Filtresi */}
          <InfiniteFeed initialNews={remainingNews.length > 0 ? remainingNews : getMockGridNews()} />
        </div>

        {/* Etik Destek Kutusu */}
        <EthicalSupportBox />
      </div>
    </div>
  );
}

function getMockHeroNews() {
  return {
    id: "mock-hero-1",
    title: "Otonom Teknolojiler ve Dijital Dönüşümde Yeni Çağ: Sektörlere Doğrudan Etkiler",
    slug: "dijital-donusumde-yeni-cag-ve-sektorlere-etkileri",
    summary: "Yeni nesil teknolojiler habercilikten finansa tüm sektörlerde verimlilik standartlarını yeniden belirliyor. Uzmanlar önümüzdeki dönem için kritik öngörülerde bulundu.",
    category: "TEKNOLOJİ",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "Dijital Dönüşümde Yeni Çağ",
    readingTime: 4,
    publishedAt: new Date(),
    persona: {
      name: "Ahmet Yılmaz",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
  };
}

function getMockSecondaryNews() {
  return [
    {
      id: "sec-1",
      title: "Küresel Piyasalarda Kritik Faiz Kararları Sonrası Altın ve Borsada Hareketlilik",
      slug: "kuresel-piyasalarda-faiz-ve-altin-hareketliligi",
      category: "EKONOMİ",
      imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&auto=format&fit=crop&q=80",
      readingTime: 3,
    },
    {
      id: "sec-2",
      title: "Elektrikli Araç Piyasasında Batarya Menzilini İkiye Katlayan Yeni Buluş",
      slug: "elektrikli-araclar-yeni-batarya-teknolojisi",
      category: "OTOMOTİV",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
      readingTime: 4,
    },
    {
      id: "sec-3",
      title: "Uzay Teleskobu Tarafından Yaşama Elverişli 3 Yeni Ötegezegen Keşfedildi",
      slug: "uzay-teleskobu-3-yeni-otegezegen-kesfetti",
      category: "BİLİM",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80",
      readingTime: 3,
    },
  ];
}

function getMockGridNews() {
  return [
    {
      id: "grid-1",
      title: "Sağlıkta Çığır Açan Yeni Aşı Çalışması: Klinik Faz-3 Sonuçları Paylaşıldı",
      slug: "saglikta-yeni-asi-calismasi-faz-3",
      summary: "Uluslararası tıp konsorsiyumu tarafından geliştirilen tedavi yöntemi %94 başarı oranı gösterdi.",
      category: "SAĞLIK",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      persona: { name: "Dr. Zeynep Demir" },
    },
    {
      id: "grid-2",
      title: "Şampiyonlar Ligi'nde Nefes Kesen Çeyrek Final Eşleşmeleri Belli Oldu",
      slug: "sampiyonlar-ligi-ceyrek-final-eslesmeleri",
      summary: "Avrupa futbolunun en prestijli turnuvasında devler ligi kuraları çekildi.",
      category: "SPOR",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
      persona: { name: "Burak Çelik" },
    },
    {
      id: "grid-3",
      title: "Küresel İklim Zirvesinde Tarihi Anlaşma: Karbon Vergisi Yürürlüğe Giriyor",
      slug: "kuresel-iklim-zirvesi-tarihi-anlasma",
      summary: "140 ülkenin imzaladığı yeni protokol ile sanayi emisyonları için katı kurallar getirildi.",
      category: "DÜNYA",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
      persona: { name: "Deniz Kaya" },
    },
  ];
}