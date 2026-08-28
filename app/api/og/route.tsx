import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "HaberNexus - Güncel ve Doğrulanmış Son Dakika Haberleri";
    const category = searchParams.get("category") || "GÜNDEM";
    const author = searchParams.get("author") || "HaberNexus Haber Merkezi";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#070c14",
            backgroundImage: "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "60px 80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Üst Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  backgroundColor: "#0c8ee9",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#ffffff",
                  letterSpacing: "1px",
                }}
              >
                {category.toUpperCase()}
              </div>
              <span style={{ fontSize: 24, color: "#94a3b8", fontWeight: 500 }}>• CANLI HABER BÜLTENİ</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#38bdf8" }}>HABER</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#ffffff" }}>NEXUS</span>
            </div>
          </div>

          {/* Başlık */}
          <div
            style={{
              fontSize: title.length > 70 ? 44 : 54,
              fontWeight: 800,
              lineHeight: 1.25,
              color: "#f8fafc",
              maxWidth: "1000px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>

          {/* Alt Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "2px solid #1e293b",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                HN
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 22, fontWeight: 600, color: "#e2e8f0" }}>{author}</span>
                <span style={{ fontSize: 16, color: "#64748b" }}>HaberNexus Teyit Masası Onaylı</span>
              </div>
            </div>
            <div style={{ fontSize: 18, color: "#0ea5e9", fontWeight: 600 }}>habernexus.com</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error("OG Image Hatası:", e);
    return new Response("OG image generate failed", { status: 500 });
  }
}