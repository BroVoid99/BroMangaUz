"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllProgress, ReadingProgressEntry } from "@/lib/reading-progress";
import { getMangaBySlug } from "@/lib/data";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<ReadingProgressEntry[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <span className="hanko mb-4">PROFIL</span>
      <h1 className="font-display text-4xl tracking-wide text-parchment">{user.name}</h1>
      <p className="mt-1 font-mono text-sm text-parchment/50">{user.email}</p>

      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="mt-4 border border-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-parchment/70 transition-colors hover:border-gold hover:text-gold"
      >
        Chiqish
      </button>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-2xl tracking-wide text-parchment">O'qish tarixi</h2>
        {progress.length === 0 ? (
          <p className="mt-4 font-mono text-sm text-parchment/50">
            Hali hech narsa o'qimadingiz.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {progress.map((p) => {
              const manga = getMangaBySlug(p.slug);
              if (!manga) return null;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/manga/${p.slug}/${p.chapterNumber}`}
                    className="flex items-center justify-between py-3 font-body text-parchment/80 transition-colors hover:text-gold"
                  >
                    <span>{manga.title} — Bob {p.chapterNumber}</span>
                    <span className="font-mono text-xs text-parchment/40">
                      {new Date(p.updatedAt).toLocaleDateString("uz-UZ")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
