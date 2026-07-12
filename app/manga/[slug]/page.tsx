import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMangaBySlug, mangas } from "@/lib/data";
import { STATUS_LABEL } from "@/lib/types";
import MangaCover from "@/components/MangaCover";

export function generateStaticParams() {
  return mangas.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const manga = getMangaBySlug(params.slug);
  if (!manga) return {};
  return {
    title: manga.title,
    description: manga.synopsisUz ?? manga.synopsis,
    openGraph: {
      title: `${manga.title} | BroManga`,
      description: manga.synopsisUz ?? manga.synopsis
    }
  };
}

export default function MangaDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const manga = getMangaBySlug(params.slug);
  if (!manga) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-10 sm:grid-cols-[240px_1fr]">
        <MangaCover seed={manga.coverSeed} title={manga.title} className="w-full" />

        <div>
          <span className="hanko mb-3">{STATUS_LABEL[manga.status]}</span>
          <h1 className="font-display text-4xl tracking-wide text-parchment sm:text-5xl">
            {manga.title}
          </h1>
          {manga.titleUz && (
            <p className="mt-1 font-body text-parchment/50">{manga.titleUz}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {manga.genres.map((g) => (
              <span
                key={g}
                className="border border-line px-3 py-1 font-mono text-xs uppercase tracking-wide text-parchment/70"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-2xl font-body leading-relaxed text-parchment/80">
            {manga.synopsisUz ?? manga.synopsis}
          </p>

          <dl className="mt-6 flex gap-8 font-mono text-xs text-parchment/50">
            <div>
              <dt className="uppercase tracking-wide">Muallif</dt>
              <dd className="mt-1 text-parchment">{manga.author}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide">Reyting</dt>
              <dd className="mt-1 text-gold">★ {manga.rating.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide">Ko'rishlar</dt>
              <dd className="mt-1 text-parchment">{manga.views.toLocaleString("uz-UZ")}</dd>
            </div>
          </dl>

          {manga.chapters.length > 0 && (
            <Link
              href={`/manga/${manga.slug}/${manga.chapters[0].number}`}
              className="mt-8 inline-block border-2 border-gold px-6 py-2.5 font-display text-lg tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              1-bobdan o'qishni boshlash
            </Link>
          )}
        </div>
      </div>

      <section className="mt-14 border-t border-line pt-8">
        <h2 className="font-display text-2xl tracking-wide text-parchment">Boblar</h2>
        <ul className="mt-4 divide-y divide-line">
          {[...manga.chapters].reverse().map((ch) => (
            <li key={ch.number}>
              <Link
                href={`/manga/${manga.slug}/${ch.number}`}
                className="flex items-center justify-between py-3 font-body text-parchment/80 transition-colors hover:text-gold"
              >
                <span>Bob {ch.number}{ch.title ? ` — ${ch.title}` : ""}</span>
                <span className="font-mono text-xs text-parchment/40">
                  {new Date(ch.publishedAt).toLocaleDateString("uz-UZ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
