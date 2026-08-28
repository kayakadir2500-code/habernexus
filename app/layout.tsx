import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HaberNexus - Güncel ve Doğrulanmış Son Dakika Haber Portalı",
  description:
    "Türkiye ve dünya gündeminden en sıcak son dakika gelişmeleri, 7/24 canlı teyitli tarafsız haberler, derinlemesine analizler ve özel dosyalar HaberNexus'ta.",
  keywords: ["haber", "son dakika", "gündem", "teknoloji", "ekonomi", "dünya", "spor", "otomotiv", "habernexus"],
  authors: [{ name: "HaberNexus Haber Merkezi" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "HaberNexus - Güncel ve Doğrulanmış Son Dakika Haber Portalı",
    description: "7/24 canlı teyitli, ilkeli ve bağımsız gazetecilik.",
    url: "https://habernexus.com",
    siteName: "HaberNexus",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaberNexus - Güncel ve Doğrulanmış Son Dakika Haber Portalı",
    description: "7/24 canlı teyitli, ilkeli ve bağımsız gazetecilik.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}