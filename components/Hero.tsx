import Link from "next/link";
import { Manga } from "@/lib/types";
import { gradientForSeed } from "@/lib/covers";

export default function Hero({ featured }: { featured: Manga }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        className="absolute inset-0"
        style={{ background: gradientForSeed(featured.coverSeed) }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <span className="hanko mb-5">BROVOID TAQDIM ETADI</span>
        <h1 className="max-w-2xl font-display text-6xl leading-[0.95] tracking-wide text-parchment sm:text-7xl">
          O'z dunyongni <span className="text-gold">chiz</span>.
        </h1>
        <p className="mt-5 max-w-lg font-body text-lg text-parchment/70">
          {featured.titleUz ?? featured.title} — {featured.synopsisUz ?? featured.synopsis}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/manga/${featured.slug}`}
            className="border-2 border-gold bg-gold px-7 py-3 font-display text-lg tracking-wide text-ink transition-transform hover:-translate-y-0.5"
          >
            Hoziroq o'qish
          </Link>
          <Link
            href="/#katalog"
            className="border-2 border-line px-7 py-3 font-display text-lg tracking-wide text-parchment/80 transition-colors hover:border-gold hover:text-gold"
          >
            Katalogni ko'rish
          </Link>
        </div>
      </div>
    </section>
  );
}
