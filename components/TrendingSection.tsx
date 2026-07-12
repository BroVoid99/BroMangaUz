import { Manga } from "@/lib/types";
import MangaCard from "./MangaCard";

export default function TrendingSection({ mangas }: { mangas: Manga[] }) {
  if (mangas.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-3xl tracking-wide text-parchment">
          🔥 Trend<span className="text-gold">da</span>
        </h2>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-2">
        {mangas.map((m) => (
          <div key={m.slug} className="w-36 shrink-0 sm:w-44">
            <MangaCard manga={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
