import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.news.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Haber silindi" });
  } catch (error: any) {
    console.error("Haber silme hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}