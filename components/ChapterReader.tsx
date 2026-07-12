"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chapter, Manga } from "@/lib/types";
import { gradientForSeed } from "@/lib/covers";
import { saveProgress } from "@/lib/reading-progress";

export default function ChapterReader({
  manga,
  chapter,
  prevNumber,
  nextNumber
}: {
  manga: Manga;
  chapter: Chapter;
  prevNumber: number | null;
  nextNumber: number | null;
}) {
  const router = useRouter();

  const goTo = useCallback(
    (n: number | null) => {
      if (n === null) return;
      router.push(`/manga/${manga.slug}/${n}`);
    },
    [manga.slug, router]
  );

  useEffect(() => {
    saveProgress(manga.slug, chapter.number);
  }, [manga.slug, chapter.number]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goTo(nextNumber);
      if (e.key === "ArrowLeft") goTo(prevNumber);
      if (e.key === "Escape") router.push(`/manga/${manga.slug}`);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goTo, nextNumber, prevNumber, manga.slug, router]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <Link href={`/manga/${manga.slug}`} className="font-display text-xl tracking-wide text-gold">
          {manga.title}
        </Link>
        <span className="font-mono text-xs text-parchment/50">
          Bob {chapter.number} / {manga.chapters.length}
        </span>
      </div>

      <div className="space-y-2">
        {chapter.pages.map((page) => (
          <div
            key={page.index}
            className="flex aspect-[2/3] w-full items-center justify-center border border-line"
            style={{ background: gradientForSeed(`${manga.slug}-${chapter.number}-${page.index}`) }}
          >
            <span className="font-mono text-xs text-parchment/40">
              {chapter.number}.{page.index} — sahifa rasmi hali yuklanmagan
            </span>
          </div>
        ))}
      </div>

      <nav className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <button
          onClick={() => goTo(prevNumber)}
          disabled={prevNumber === null}
          className="border border-line px-5 py-2 font-mono text-xs uppercase tracking-wide text-parchment/70 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Oldingi bob
        </button>
        <span className="hidden font-mono text-xs text-parchment/40 sm:inline">
          ← / → tugmalari bilan navigatsiya
        </span>
        <button
          onClick={() => goTo(nextNumber)}
          disabled={nextNumber === null}
          className="border border-line px-5 py-2 font-mono text-xs uppercase tracking-wide text-parchment/70 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          Keyingi bob →
        </button>
      </nav>
    </div>
  );
}
