import { mangas, getAllGenres, getTrending, getLatestUpdates, getTopRated } from "@/lib/data";
import Hero from "@/components/Hero";
import TrendingSection from "@/components/TrendingSection";
import LatestUpdatesSection from "@/components/LatestUpdatesSection";
import RankingSection from "@/components/RankingSection";
import ContinueReadingSection from "@/components/ContinueReadingSection";
import GenreFilter from "@/components/GenreFilter";

export default function HomePage() {
  const genres = getAllGenres();
  const trending = getTrending(8);
  const updates = getLatestUpdates(8);
  const topRated = getTopRated(5);
  const featured = trending[0] ?? mangas[0];

  return (
    <div>
      <Hero featured={featured} />

      <ContinueReadingSection />

      <TrendingSection mangas={trending} />

      <LatestUpdatesSection updates={updates} />

      <RankingSection mangas={topRated} title="Top reyting" />

      <div id="katalog" className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="mb-5 font-display text-3xl tracking-wide text-parchment">
          Barcha <span className="text-gold">asarlar</span>
        </h2>
        <GenreFilter mangas={mangas} genres={genres} />
      </div>
    </div>
  );
}
