import type { Metadata } from "next";
import { getTrending } from "@/lib/data";
import MangaCard from "@/components/MangaCard";

export const metadata: Metadata = {
  title: "Trend asarlar"
};

export default function TrendingPage() {
  const trending = getTrending(50);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <span className="hanko mb-4">TREND</span>
      <h1 className="font-display text-4xl tracking-wide text-parchment">
        Eng ko'p o'qilayotgan asarlar
      </h1>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {trending.map((m) => (
          <MangaCard key={m.slug} manga={m} />
        ))}
      </div>
    </div>
  );
}
