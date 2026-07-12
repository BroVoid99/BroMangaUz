"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Manga } from "@/lib/types";
import MangaCard from "./MangaCard";

export default function GenreFilter({
  mangas,
  genres
}: {
  mangas: Manga[];
  genres: string[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!active) return mangas;
    return mangas.filter((m) => m.genres.includes(active));
  }, [active, mangas]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={clsx(
            "border px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
            !active
              ? "border-gold bg-gold text-ink"
              : "border-line text-parchment/70 hover:border-gold hover:text-gold"
          )}
        >
          Barchasi
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setActive(g)}
            className={clsx(
              "border px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
              active === g
                ? "border-gold bg-gold text-ink"
                : "border-line text-parchment/70 hover:border-gold hover:text-gold"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-parchment/50">
          Bu janrda hozircha asar yo'q.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <MangaCard key={m.slug} manga={m} />
          ))}
        </div>
      )}
    </div>
  );
}
