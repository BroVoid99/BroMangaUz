import { NextResponse } from "next/server";
import { getDbChapter, deleteChapterPage } from "@/lib/db-chapters";

export const runtime = "nodejs";

// Bobning barcha sahifalarini (id, index, imageUrl) qaytaradi
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const numberRaw = searchParams.get("number");

  if (!slug || !numberRaw || isNaN(Number(numberRaw))) {
    return NextResponse.json(
      { success: false, error: "Manhwa yoki bob raqami noto'g'ri." },
      { status: 400 }
    );
  }

  const chapter = await getDbChapter(slug, Number(numberRaw));

  if (!chapter) {
    return NextResponse.json({ success: false, error: "Bob topilmadi." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    chapterId: chapter.id,
    pages: chapter.pages.map((p) => ({ id: p.id, index: p.index, imageUrl: p.imageUrl }))
  });
}

// Bitta sahifani o'chiradi (body: { pageId: string })
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const pageId = body?.pageId as string | undefined;

    if (!pageId) {
      return NextResponse.json({ success: false, error: "pageId ko'rsatilmagan." }, { status: 400 });
    }

    await deleteChapterPage(pageId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("========== DELETE PAGE ERROR ==========");
    console.error(err);
    console.error("========================================");
    return NextResponse.json(
      { success: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}