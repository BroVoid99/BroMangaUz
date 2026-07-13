import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMangaBySlug, mangas } from "@/lib/data";
import { getDbChapter, getDbChapterNumbers } from "@/lib/db-chapters";
import ChapterReader from "@/components/ChapterReader";

export function generateStaticParams() {
  return mangas.flatMap((m) =>
    m.chapters.map((c) => ({ slug: m.slug, chapter: String(c.number) }))
  );
}

export function generateMetadata({
  params
}: {
  params: { slug: string; chapter: string };
}): Metadata {
  const manga = getMangaBySlug(params.slug);
  if (!manga) return {};
  return {
    title: `${manga.title} — Bob ${params.chapter}`
  };
}

export default async function ChapterPage({
  params
}: {
  params: { slug: string; chapter: string };
}) {
  const manga = getMangaBySlug(params.slug);
  if (!manga) notFound();

  const chapterNumber = Number(params.chapter);

  // 1) Avval bazadan qidiramiz (admin panel orqali yuklangan haqiqiy bob).
  //    Bu ustuvor, chunki statik ro'yxatda ko'plab manhwalar uchun
  //    bo'sh placeholder boblar (imageUrl: "") oldindan yaratilgan bo'lishi
  //    mumkin va ular haqiqiy yuklangan bobni "to'sib qo'yishi" mumkin edi.
  let chapter: (typeof manga.chapters)[number] | undefined;

  const dbChapter = await getDbChapter(params.slug, chapterNumber);
  if (dbChapter && dbChapter.pages.length > 0) {
    chapter = {
      number: dbChapter.number,
      title: dbChapter.title ?? undefined,
      publishedAt: dbChapter.publishedAt.toISOString(),
      pages: dbChapter.pages.map((p) => ({ index: p.index, imageUrl: p.imageUrl }))
    };
  }

  // 2) Bazada topilmasa, statik/disk asosidagi bobga qaytamiz
  //    (CLI skript orqali public/chapters/ ga yuklangan boblar).
  if (!chapter) {
    chapter = manga.chapters.find((c) => c.number === chapterNumber);
  }

  if (!chapter) notFound();

  // Navigatsiya uchun: statik + bazadagi bob raqamlarini birlashtiramiz
  const dbChapterNumbers = await getDbChapterNumbers(params.slug);
  const staticChapterNumbers = manga.chapters.map((c) => c.number);
  const chapterNumbers = Array.from(
    new Set([...staticChapterNumbers, ...dbChapterNumbers])
  ).sort((a, b) => a - b);

  const currentIndex = chapterNumbers.indexOf(chapterNumber);
  const prevNumber = currentIndex > 0 ? chapterNumbers[currentIndex - 1] : null;
  const nextNumber =
    currentIndex < chapterNumbers.length - 1 ? chapterNumbers[currentIndex + 1] : null;

  return (
    <ChapterReader
      manga={manga}
      chapter={chapter}
      prevNumber={prevNumber}
      nextNumber={nextNumber}
    />
  );
}
