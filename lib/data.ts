import { Manga } from "./types";

function makeChapters(count: number, pagesPerChapter = 6) {
  return Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    return {
      number,
      title: undefined,
      publishedAt: new Date(2026, 4, number).toISOString(),
      pages: Array.from({ length: pagesPerChapter }, (_, p) => ({
        index: p + 1,
        imageUrl: "" // real scan URL keyinchalik shu yerga qo'yiladi
      }))
    };
  });
}

export const mangas: Manga[] = [
  {
    slug: "zero-awakening",
    title: "Zero Awakening",
    titleUz: "Nol Uyg'onish",
    author: "BroVoid",
    synopsis:
      "Ethan Cross wakes up bound to the Glitch System — a power that breaks every rule of the world he thought he knew.",
    synopsisUz:
      "Ethan Cross g'alati bir kuchga — 'Glitch System'ga ega bo'lib uyg'onadi. Bu kuch dunyoning barcha qoidalarini buzadi va uni yangi, xavfli haqiqat sari yetaklaydi.",
    coverSeed: "zero-awakening",
    status: "ONGOING",
    rating: 4.6,
    views: 18400,
    genres: ["Fantasy", "Isekai", "Action"],
    chapters: makeChapters(13)
  },
  {
    slug: "frozen-woods",
    title: "Frozen Woods",
    titleUz: "Muzlagan O'rmon",
    author: "BroVoid",
    synopsis:
      "Leonard fights to survive a frozen, monster-ridden world alongside Asel — until the arena forces him to become something else.",
    synopsisUz:
      "Leonard sovuq va yovvoyi mavjudotlarga to'la dunyoda omon qolish uchun kurashadi. Asel bilan birga boshlangan bu safar, arenada unga boshqa birov bo'lishga majbur qiladi.",
    coverSeed: "frozen-woods",
    status: "ONGOING",
    rating: 4.8,
    views: 25100,
    genres: ["Dark Fantasy", "Survival", "Isekai"],
    chapters: makeChapters(11)
  },
  {
    slug: "valemort-merosi",
    title: "Valemort Merosi",
    titleUz: "Valemort Merosi",
    author: "BroVoid",
    synopsis:
      "Obevan enters a deadly tournament to uncover his family's buried secret — and the truth behind the Valemort state.",
    synopsisUz:
      "Obevan oilasining yashirin sirini ochish uchun o'lim xavfi bor turnirga kiradi. Har bir jangda u 'Valemort holati' haqidagi haqiqatga bir qadam yaqinlashadi.",
    coverSeed: "valemort-merosi",
    status: "ONGOING",
    rating: 4.5,
    views: 12700,
    genres: ["Fantasy", "Tournament", "Drama"],
    chapters: makeChapters(9)
  }
];

export function getAllGenres(): string[] {
  const set = new Set<string>();
  mangas.forEach((m) => m.genres.forEach((g) => set.add(g)));
  return Array.from(set).sort();
}

export function getMangaBySlug(slug: string): Manga | undefined {
  return mangas.find((m) => m.slug === slug);
}

export function getChapter(slug: string, number: number) {
  const manga = getMangaBySlug(slug);
  if (!manga) return undefined;
  return manga.chapters.find((c) => c.number === number);
}

/** Ko'rishlar soni bo'yicha eng ko'p o'qilganlar */
export function getTrending(limit = 8): Manga[] {
  return [...mangas].sort((a, b) => b.views - a.views).slice(0, limit);
}

/** Reyting bo'yicha eng yuqori baholanganlar (raqamli ranking) */
export function getTopRated(limit = 10): Manga[] {
  return [...mangas].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

/** Eng so'nggi chop etilgan bob bo'yicha yangilanganlar */
export function getLatestUpdates(limit = 8) {
  return [...mangas]
    .map((m) => ({
      manga: m,
      latestChapter: m.chapters[m.chapters.length - 1]
    }))
    .filter((x) => x.latestChapter)
    .sort(
      (a, b) =>
        new Date(b.latestChapter.publishedAt).getTime() -
        new Date(a.latestChapter.publishedAt).getTime()
    )
    .slice(0, limit);
}
