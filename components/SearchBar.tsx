"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Manga } from "@/lib/types";

export default function SearchBar({ mangas }: { mangas: Manga[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results =
    query.trim().length > 0
      ? mangas
          .filter((m) =>
            [m.title, m.titleUz ?? "", ...m.genres]
              .join(" ")
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .slice(0, 6)
      : [];
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Asar qidirish..."
        className="w-full border border-line bg-panel px-4 py-2 font-body text-sm text-parchment outline-none placeholder:text-parchment/40 focus:border-gold"
      />
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-line bg-panel shadow-xl">
          {results.map((m) => (
            <Link
              key={m.slug}
              href={`/manga/${m.slug}`}
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="flex items-center justify-between border-b border-line px-4 py-2.5 last:border-b-0 hover:bg-ink"
            >
              <span className="font-body text-sm text-parchment">{m.title}</span>
              <span className="font-mono text-xs text-parchment/40">★ {m.rating.toFixed(1)}</span>
            </Link>
          ))}
        </div>
      )}
      {open && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-line bg-panel px-4 py-3 font-mono text-xs text-parchment/50">
          Hech narsa topilmadi.
        </div>
      )}
    </div>
  );
}
