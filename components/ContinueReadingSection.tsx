"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProgress, ReadingProgressEntry } from "@/lib/reading-progress";
import { getMangaBySlug } from "@/lib/data";
import MangaCover from "./MangaCover";

export default function ContinueReadingSection() {
  const [progress, setProgress] = useState<ReadingProgressEntry[] | null>(null);

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  if (!progress || progress.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <h2 className="mb-5 font-display text-3xl tracking-wide text-parchment">
        O'qishni <span className="text-gold">davom ettirish</span>
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {progress.slice(0, 6).map((p) => {
          const manga = getMangaBySlug(p.slug);
          if (!manga) return null;
          return (
            <Link
              key={p.slug}
              href={`/manga/${p.slug}/${p.chapterNumber}`}
              className="group flex w-48 shrink-0 gap-3 border border-line bg-panel p-3 transition-colors hover:border-gold"
            >
              <MangaCover seed={manga.coverSeed} title={manga.title} className="w-14 shrink-0" />
              <div className="min-w-0">
                <h3 className="truncate font-display text-base tracking-wide text-parchment group-hover:text-gold">
                  {manga.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-parchment/50">Bob {p.chapterNumber}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
