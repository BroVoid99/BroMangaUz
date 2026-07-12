import Link from "next/link";
import { mangas } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl tracking-wide text-gold">Bro</span>
            <span className="font-display text-2xl tracking-wide text-parchment">Manga</span>
          </div>
          <p className="mt-3 font-body text-sm text-parchment/50">
            BroVoid tomonidan yaratilgan original manga va manhwa asarlari uchun platforma.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest2 text-gold">Navigatsiya</h3>
          <ul className="mt-4 space-y-2 font-body text-sm text-parchment/60">
            <li><Link href="/" className="hover:text-gold">Katalog</Link></li>
            <li><Link href="/trending" className="hover:text-gold">Trend</Link></li>
            <li><Link href="/ranking" className="hover:text-gold">Reyting</Link></li>
            <li><Link href="/login" className="hover:text-gold">Kirish</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest2 text-gold">Asarlar</h3>
          <ul className="mt-4 space-y-2 font-body text-sm text-parchment/60">
            {mangas.map((m) => (
              <li key={m.slug}>
                <Link href={`/manga/${m.slug}`} className="hover:text-gold">
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest2 text-gold">BroVoid</h3>
          <ul className="mt-4 space-y-2 font-body text-sm text-parchment/60">
            <li>
              <a href="https://webnovel.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                WebNovel profili
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-6">
        <div className="mx-auto max-w-6xl px-5 text-center font-mono text-xs text-parchment/40">
          © {new Date().getFullYear()} BroVoid — barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
