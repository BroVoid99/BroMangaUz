import type { Metadata } from "next";
import { getTopRated } from "@/lib/data";
import RankingSection from "@/components/RankingSection";

export const metadata: Metadata = {
  title: "Reyting"
};

export default function RankingPage() {
  const topRated = getTopRated(50);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <span className="hanko mb-4">REYTING</span>
      <h1 className="font-display text-4xl tracking-wide text-parchment">
        Eng yuqori baholangan asarlar
      </h1>
      <RankingSection mangas={topRated} title="Top reyting" />
    </div>
  );
}
