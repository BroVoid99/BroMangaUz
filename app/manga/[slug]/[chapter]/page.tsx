import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMangaBySlug, getChapter, mangas } from "@/lib/data";
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

export default function ChapterPage({
  params
}: {
  params: { slug: string; chapter: string };
}) {
  const manga = getMangaBySlug(params.slug);
  const chapterNumber = Number(params.chapter);
  const chapter = getChapter(params.slug, chapterNumber);

  if (!manga || !chapter) notFound();

  const chapterNumbers = manga.chapters.map((c) => c.number);
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
