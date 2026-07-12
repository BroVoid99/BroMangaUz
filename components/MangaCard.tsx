import Link from "next/link";
import { Manga, STATUS_LABEL } from "@/lib/types";
import MangaCover from "./MangaCover";

export default function MangaCard({ manga }: { manga: Manga }) {
  const lastChapter = manga.chapters[manga.chapters.length - 1];

  return (
    <Link
      href={`/manga/${manga.slug}`}
      className="group block"
    >
      <MangaCover
        seed={manga.coverSeed}
        title={manga.title}
        className="transition-transform duration-300 group-hover:-translate-y-1"
      />
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xl tracking-wide text-parchment group-hover:text-gold transition-colors">
            {manga.title}
          </h3>
          <span className="hanko shrink-0">{STATUS_LABEL[manga.status].slice(0, 3).toUpperCase()}</span>
        </div>
        <p className="font-mono text-xs text-parchment/50">
          {lastChapter ? `Bob ${lastChapter.number}` : "Tez orada"} · ★ {manga.rating.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}
