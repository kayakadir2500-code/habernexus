import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AudioPlayer } from "@/components/public/AudioPlayer";
import { FAQAccordion } from "@/components/public/FAQAccordion";
import { PersonaCard } from "@/components/public/PersonaCard";
import { CommentSection } from "@/components/public/CommentSection";
import { ShareButtons } from "@/components/public/ShareButtons";
import { BookmarkButton } from "@/components/public/BookmarkButton";
import { generateNewsArticleSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo/schema";
import { 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await db.news.findUnique({
    where: { slug },
    include: { persona: true },
  });

  if (!news) {
    return { title: "Haber Bulunamadı - HaberNexus" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const ogImageUrl = `${appUrl}/api/og?title=${encodeURIComponent(news.title)}&category=${encodeURIComponent(news.category)}&author=${encodeURIComponent(news.persona?.name || "HaberNexus")}`;

  return {
    title: `${news.metaTitle || news.title} | HaberNexus`,
    description: news.metaDescription || news.summary,
    keywords: news.tags,
    authors: [{ name: news.persona?.name || "HaberNexus Haber Merkezi" }],
    alternates: {
      canonical: `${appUrl}/haber/${news.slug}`,
    },
    openGraph: {
      title: news.title,
      description: news.metaDescription || news.summary,
      url: `${appUrl}/haber/${news.slug}`,
      siteName: "HaberNexus",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: news.title }],
      type: "article",
      publishedTime: new Date(news.publishedAt).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.metaDescription || news.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await db.news.findUnique({
    where: { slug },
    include: { persona: true },
  });

  if (!news) {
    notFound();
  }

  db.news.update({
    where: { id: news.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const relatedNews = await db.news.findMany({
    where: {
      category: news.category,
      id: { not: news.id },
      isPublished: true,
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const articleSchema = generateNewsArticleSchema({
    title: news.title,
    description: news.metaDescription || news.summary,
    slug: news.slug,
    imageUrl: news.imageUrl,
    publishedAt: news.publishedAt,
    updatedAt: news.updatedAt,
    personaName: news.persona?.name || "HaberNexus Editörü",
    personaSlug: news.persona?.slug || "editor",
    personaRole: news.persona?.role,
    baseUrl: appUrl,
  });

  const faqList = (news.faqData as { question: string; answer: string }[]) || [];
  const faqSchema = generateFAQSchema(faqList);

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Anasayfa", url: appUrl },
    { name: news.category, url: `${appUrl}/kategori/${news.category.toLowerCase()}` },
    { name: news.title, url: `${appUrl}/haber/${news.slug}` },
  ]);

  const formattedDate = new Date(news.publishedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="w-full py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ekmek Kırıntısı */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/kategori/${news.category.toLowerCase()}`} className="hover:text-white uppercase text-sky-400">
            {news.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-500 truncate max-w-xs">{news.title}</span>
        </nav>

        {/* Üst Bilgiler & Kategori */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
            {news.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{news.readingTime} dk okuma</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HaberNexus Teyit Masası Onaylı</span>
          </div>
        </div>

        {/* Ana Başlık */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
          {news.title}
        </h1>

        {/* Yazar, Paylaşım ve Kaydetme Çubuğu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-sky-500/50">
              <Image
                src={news.persona?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
                alt={news.persona?.name || "Yazar"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <Link href={`/yazar/${news.persona?.slug}`} className="font-bold text-sm text-slate-200 hover:text-sky-400 transition-colors">
                {news.persona?.name}
              </Link>
              <div className="text-xs text-slate-400">{news.persona?.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <ShareButtons title={news.title} slug={news.slug} />
            <BookmarkButton newsId={news.id} title={news.title} />
          </div>
        </div>

        {/* 16:9 Manşet Görseli */}
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-3">
          <Image
            src={news.imageUrl}
            alt={news.imageAlt || news.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        {news.imageCaption && (
          <p className="text-xs text-slate-400 italic mb-8 px-2 text-center">
            📸 {news.imageCaption}
          </p>
        )}

        {/* Sesli Dinleme Oynatıcısı */}
        <AudioPlayer
          audioUrl={news.audioUrl}
          title={news.title}
          summary={news.summary}
        />

        {/* 5N1K Hap Bilgi Kutusu */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 border border-sky-500/30 shadow-lg">
          <div className="text-sky-400 font-bold text-sm uppercase tracking-wider mb-2">
            5N1K Hızlı Özet & Ana Hatlar
          </div>
          <p className="text-base text-slate-200 leading-relaxed font-medium">
            {news.summary}
          </p>
        </div>

        {/* Zenginleştirilmiş Haber Gövdesi */}
        <div className="article-prose text-slate-200 border-b border-slate-800 pb-10 mb-8 whitespace-pre-line">
          {news.content}
        </div>

        {/* Google SSS Akordeon Bölümü */}
        {faqList.length > 0 && <FAQAccordion items={faqList} />}

        {/* Doğrulanan Kaynaklar */}
        {news.sources && news.sources.length > 0 && (
          <div className="my-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
            <span className="font-bold text-slate-300 block mb-2">Doğrulanan Haber Kaynakları:</span>
            <div className="flex flex-wrap gap-2">
              {news.sources.map((src, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                  <span>{src}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Persona Yazar Kartı */}
        {news.persona && <PersonaCard persona={news.persona} />}

        {/* Okur Yorumları Bölümü */}
        <CommentSection newsId={news.id} />

        {/* İlgili Haberler */}
        {relatedNews.length > 0 && (
          <div className="my-12">
            <h3 className="text-xl font-bold text-white mb-6">İlgili Diğer Gelişmeler</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/haber/${item.slug}`}
                  className="group rounded-2xl bg-slate-900/70 border border-slate-800 p-3 hover:border-sky-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-800 mb-3">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h4>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.category}</span>
                    <span>{item.readingTime} dk</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}