import Link from "next/link";
import { Manga } from "@/lib/types";

export default function RankingSection({
  mangas,
  title = "Reyting"
}: {
  mangas: Manga[];
  title?: string;
}) {
  if (mangas.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <h2 className="mb-5 font-display text-3xl tracking-wide text-parchment">
        {title.split(" ")[0]} <span className="text-gold">{title.split(" ").slice(1).join(" ")}</span>
      </h2>
      <ol className="divide-y divide-line border-y border-line">
        {mangas.map((m, i) => (
          <li key={m.slug}>
            <Link
              href={`/manga/${m.slug}`}
              className="flex items-center gap-4 py-3.5 transition-colors hover:bg-panel"
            >
              <span
                className={`w-8 shrink-0 text-center font-display text-2xl ${
                  i < 3 ? "text-gold" : "text-parchment/30"
                }`}
              >
                {i + 1}
              </span>
              <span className="flex-1 truncate font-body text-parchment/90">{m.title}</span>
              <span className="shrink-0 font-mono text-xs text-parchment/50">
                ★ {m.rating.toFixed(1)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
