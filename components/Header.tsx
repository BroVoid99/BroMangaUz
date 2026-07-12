"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "./SearchBar";

export default function Header() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display text-3xl tracking-wide text-gold">Bro</span>
          <span className="font-display text-3xl tracking-wide text-parchment">Manga</span>
        </Link>

        <nav className="hidden items-center gap-6 font-body text-sm md:flex">
          <Link href="/" className="gold-underline text-parchment/90">
            Katalog
          </Link>
          <Link href="/trending" className="gold-underline text-parchment/90">
            Trend
          </Link>
          <Link href="/ranking" className="gold-underline text-parchment/90">
            Reyting
          </Link>
        </nav>

        <div className="hidden flex-1 justify-end md:flex">
          <SearchBar />
        </div>

        <div className="ml-auto hidden items-center gap-4 md:flex">
          {user ? (
            <Link
              href="/profile"
              className="border border-gold px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link
              href="/login"
              className="border border-gold px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Kirish
            </Link>
          )}
        </div>

        <button
          className="ml-auto font-display text-2xl text-gold md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menyu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-line px-5 py-4 md:hidden">
          <SearchBar />
          <nav className="mt-4 flex flex-col gap-3 font-body text-sm">
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-parchment/90">
              Katalog
            </Link>
            <Link href="/trending" onClick={() => setMobileOpen(false)} className="text-parchment/90">
              Trend
            </Link>
            <Link href="/ranking" onClick={() => setMobileOpen(false)} className="text-parchment/90">
              Reyting
            </Link>
            <Link
              href={user ? "/profile" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="text-gold"
            >
              {user ? user.name.split(" ")[0] : "Kirish"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
