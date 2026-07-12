import Link from "next/link";
import { Manga, Chapter } from "@/lib/types";
import MangaCover from "./MangaCover";

export default function LatestUpdatesSection({
  updates
}: {
  updates: { manga: Manga; latestChapter: Chapter }[];
}) {
  if (updates.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <h2 className="mb-5 font-display text-3xl tracking-wide text-parchment">
        Yangi <span className="text-gold">boblar</span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {updates.map(({ manga, latestChapter }) => (
          <Link
            key={manga.slug}
            href={`/manga/${manga.slug}/${latestChapter.number}`}
            className="group flex gap-3 border border-line bg-panel p-3 transition-colors hover:border-gold"
          >
            <MangaCover seed={manga.coverSeed} title={manga.title} className="w-16 shrink-0" />
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg tracking-wide text-parchment group-hover:text-gold">
                {manga.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-parchment/50">
                Bob {latestChapter.number}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-parchment/30">
                {new Date(latestChapter.publishedAt).toLocaleDateString("uz-UZ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
