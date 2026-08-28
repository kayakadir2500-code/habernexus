import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "HaberNexus - Güncel ve Doğrulanmış Dijital Haber Ajansı",
    template: "%s | HaberNexus",
  },
  description:
    "Türkiye ve dünya gündeminden en son haberler, tarafsız analizler ve bağımsız gazetecilik.",
  keywords: ["haber", "gündem", "teknoloji", "ekonomi", "dünya", "spor", "son dakika haberleri"],
  openGraph: {
    title: "HaberNexus - Güncel ve Doğrulanmış Dijital Haber Ajansı",
    description: "7/24 kesintisiz, teyitli ve bağımsız dijital haber portalı.",
    siteName: "HaberNexus",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}