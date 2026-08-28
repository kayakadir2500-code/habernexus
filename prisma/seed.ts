import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 HaberNexus veritabanı tohumlama başlatılıyor...");

  // 1. Sistem Ayarları
  await prisma.systemSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      activeTextModel: "gemini-3.7-flash",
      activeImageModel: "imagen-3.0-generate-002",
      activeTtsVoice: "tr-TR-Standard-A",
      dailyTarget: 10,
      isAutoPublish: true,
    },
  });

  // 2. Personalar (Yapay Zeka Yazarları)
  const personas = [
    {
      name: "Ahmet Yılmaz",
      slug: "ahmet-yilmaz",
      role: "Kıdemli Teknoloji & Yapay Zeka Editörü",
      bio: "10 yılı aşkın süredir teknoloji, yapay zeka, tüketici elektroniği ve siber güvenlik alanlarında derinlemesine analizler kaleme alıyor. Karmaşık teknik gelişmeleri herkesin anlayabileceği akıcı bir dille aktarmasıyla tanınır.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      categories: ["TEKNOLOJI", "BILIM"],
      tone: "Teknik, analitik, vizyoner ve merak uyandırıcı",
    },
    {
      name: "Selin Kara",
      slug: "selin-kara",
      role: "Ekonomi, Piyasalar & Finans Baş Analisti",
      bio: "Küresel piyasalar, makroekonomi, borsa, döviz kurları ve merkez bankası politikalarını yakından takip eden finans yazarı. Rakamların perde arkasındaki gerçek hikayeleri okuyucularıyla buluşturuyor.",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      categories: ["EKONOMI"],
      tone: "Ciddi, veriye dayalı, anlaşılır ve güven verici",
    },
    {
      name: "Emre Yıldız",
      slug: "emre-yildiz",
      role: "Gündem & Son Dakika Muhabiri",
      bio: "Türkiye ve dünya gündemindeki sıcak gelişmeleri tarafsız, ilkeli ve hızlı bir şekilde aktaran deneyimli haberci. Olay yerinden en doğru bilgileri sıcağı sıcağına derler.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      categories: ["GUNDEM"],
      tone: "Hızlı, nesnel, dinamik ve dikkat çekici",
    },
    {
      name: "Dr. Zeynep Demir",
      slug: "zeynep-demir",
      role: "Sağlık & Yaşam Bilimleri Editörü",
      bio: "Tıp dünyasındaki son araştırmalar, sağlıklı yaşam rehberleri ve biyoteknoloji yeniliklerini bilimsel doğrular ışığında okuyuculara sunan uzman içerik üreticisi.",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      categories: ["SAGLIK", "BILIM"],
      tone: "Bilimsel, kanıta dayalı, eğitici ve samimi",
    },
    {
      name: "Burak Çelik",
      slug: "burak-celik",
      role: "Spor & Futbol Servisi Şefi",
      bio: "Süper Lig, Avrupa futbolu, transfer kulisleri ve basketbol dünyasındaki tüm heyecan verici gelişmeleri tutkulu ve akıcı üslubuyla aktaran spor gazetecisi.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      categories: ["SPOR"],
      tone: "Heyecanlı, enerjik, tarafsız ve detaycı",
    },
    {
      name: "Mert Aksoy",
      slug: "mert-aksoy",
      role: "Otomotiv & Geleceğin Mobilitesi Editörü",
      bio: "Elektrikli araçlar, otonom sürüş sistemleri ve otomobil piyasasındaki son modelleri inceleyen otomotiv tutkunu ve test editörü.",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
      categories: ["OTOMOTIV"],
      tone: "Modern, detaylı, kullanıcı odaklı",
    },
    {
      name: "Deniz Kaya",
      slug: "deniz-kaya",
      role: "Dünya & Diplomasi Masası Şefi",
      bio: "Uluslararası ilişkiler, jeopolitik krizler ve küresel manşetleri çok yönlü kaynaklardan analiz eden kıdemli dış haberler uzmanı.",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
      categories: ["DUNYA"],
      tone: "Stratejik, küresel bakış açılı ve tarafsız",
    },
  ];

  for (const p of personas) {
    await prisma.persona.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // 3. İçerik & Trend Kaynakları
  const sources = [
    {
      name: "Google Trends Türkiye",
      type: "GOOGLE_TRENDS",
      url: "https://trends.google.com.tr/trending/rss?geo=TR",
      category: "GUNDEM",
    },
    {
      name: "Google Trends Dünya",
      type: "GOOGLE_TRENDS",
      url: "https://trends.google.com/trending/rss?geo=US",
      category: "DUNYA",
    },
    {
      name: "Anadolu Ajansı Güncel RSS",
      type: "RSS",
      url: "https://www.aa.com.tr/tr/rss/default?cat=guncel",
      category: "GUNDEM",
    },
    {
      name: "Bloomberg HT Ekonomi RSS",
      type: "RSS",
      url: "https://www.bloomberght.com/rss",
      category: "EKONOMI",
    },
    {
      name: "Teknoloji Gündemi RSS",
      type: "RSS",
      url: "https://shiftdelete.net/feed",
      category: "TEKNOLOJI",
    },
  ];

  for (const s of sources) {
    const existing = await prisma.contentSource.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.contentSource.create({ data: s });
    }
  }

  console.log("✅ Tohumlama başarıyla tamamlandı! Personalar, kaynaklar ve sistem ayarları hazır.");
}

main()
  .catch((e) => {
    console.error("Tohumlama hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
