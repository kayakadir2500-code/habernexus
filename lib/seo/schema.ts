/**
 * Google Schema.org & JSON-LD Zengin Veri Üreticisi
 * Google News, Keşfet (Discover) ve Arama Motorları için %100 uyumlu yapısal veriler.
 */

export function generateNewsArticleSchema(params: {
  title: string;
  description: string;
  slug: string;
  imageUrl: string;
  publishedAt: Date | string;
  updatedAt?: Date | string;
  personaName: string;
  personaSlug: string;
  personaRole?: string;
  baseUrl: string;
}) {
  const publishedIso = new Date(params.publishedAt).toISOString();
  const updatedIso = params.updatedAt ? new Date(params.updatedAt).toISOString() : publishedIso;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${params.baseUrl}/haber/${params.slug}`,
    },
    "headline": params.title,
    "description": params.description,
    "image": [params.imageUrl],
    "datePublished": publishedIso,
    "dateModified": updatedIso,
    "author": {
      "@type": "Person",
      "name": params.personaName,
      "url": `${params.baseUrl}/yazar/${params.personaSlug}`,
      "jobTitle": params.personaRole || "Editör",
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "HaberNexus",
      "url": params.baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${params.baseUrl}/logo.png`,
        "width": 600,
        "height": 60,
      },
    },
  };
}

export function generateFAQSchema(faqData: { question: string; answer: string }[]) {
  if (!faqData || faqData.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
