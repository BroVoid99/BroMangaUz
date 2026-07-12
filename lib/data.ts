import { Manga } from "./types";
import fs from "fs";
import path from "path";

// public/chapters/{slug}/{chapterNumber}/ papkasidagi .webp fayllar sonini
// o'qiydi. Agar papka hali mavjud bo'lmasa (bob hali yuklanmagan bo'lsa),
// fallback sifatida berilgan sonni qaytaradi.
function getRealPageCount(slug: string, chapterNumber: number, fallback: number): number {
  try {
    const dir = path.join(process.cwd(), "public", "chapters", slug, String(chapterNumber));
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".webp"));
    return files.length > 0 ? files.length : fallback;
  } catch {
    return fallback;
  }
}

function makeChapters(slug: string, count: number, pagesPerChapter = 6) {
  return Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    const pageCount = getRealPageCount(slug, number, pagesPerChapter);

    return {
      number,
      title: undefined,
      publishedAt: new Date(2026, 4, number).toISOString(),
      pages: Array.from({ length: pageCount }, (_, p) => ({
        index: p + 1,
        imageUrl: "" // ChapterReader.tsx o'zi /chapters/{slug}/{number}/{index}.webp dan quradi
      }))
    };
  });
}

export const mangas: Manga[] = [
  {
    slug: "reality-quest",
    title: "Reality Quest",
    titleUz: "Reality Quest",
    author: "YuNuni",
    synopsis:
      "Ha Do-Wan was bullied every day until he receives a mysterious Reality Quest system that turns his life upside down.",
    synopsisUz:
      "Ha Do-Wan har kuni bezorilar tomonidan qiynalardi. Bir kuni u sirli 'Reality Quest' tizimiga ega bo'lib, hayoti butunlay o'zgaradi.",
    coverSeed: "reality-quest",
    status: "ONGOING",
    rating: 4.9,
    views: 985000,
    genres: ["Action", "School", "System"],
    chapters: makeChapters("reality-quest", 160)
  },
  {
    slug: "viral-hit",
    title: "Viral Hit",
    titleUz: "Viral Hit",
    author: "Taejun Pak",
    synopsis:
      "Hobin Yoo accidentally becomes famous after uploading fight videos and enters the dangerous world of street fighting.",
    synopsisUz:
      "Hobin Yoo tasodifan jang videolari orqali mashhur bo'lib ketadi va xavfli ko'cha janglari dunyosiga kirib qoladi.",
    coverSeed: "viral-hit",
    status: "COMPLETED",
    rating: 4.8,
    views: 1430000,
    genres: ["Action", "Comedy", "School"],
    chapters: makeChapters("viral-hit", 218)
  },
  {
    slug: "fake-girlfriend",
    title: "Fake Girlfriend",
    titleUz: "Soxta Sevgilim",
    author: "Unknown",
    synopsis:
      "A fake relationship slowly turns into real emotions as two students pretend to date.",
    synopsisUz:
      "Soxta munosabat vaqt o'tishi bilan haqiqiy his-tuyg'ularga aylanadi.",
    coverSeed: "fake-girlfriend",
    status: "ONGOING",
    rating: 4.7,
    views: 654000,
    genres: ["Romance", "Comedy", "School"],
    chapters: makeChapters("fake-girlfriend", 95)
  },
  {
    slug: "player",
    title: "Player",
    titleUz: "Player",
    author: "Park Jong-Seok",
    synopsis:
      "A boy enters a fantasy world where only players can change fate.",
    synopsisUz:
      "Oddiy yigit taqdirni o'zgartira oladigan o'yinchilar dunyosiga tushib qoladi.",
    coverSeed: "player",
    status: "ONGOING",
    rating: 4.8,
    views: 1180000,
    genres: ["Fantasy", "Action", "Adventure"],
    chapters: makeChapters("player", 260)
  },
  {
    slug: "absolute-sword-sense",
    title: "Absolute Sword Sense",
    titleUz: "Mutloq Qilich Hissi",
    author: "Han Joong Wueol Ya",
    synopsis:
      "After death, Woonhwi gains the mysterious ability to hear the voices of swords.",
    synopsisUz:
      "O'limdan keyin Woonhwi qilichlarning ovozini eshita oladigan noyob qobiliyatga ega bo'ladi.",
    coverSeed: "absolute-sword-sense",
    status: "ONGOING",
    rating: 4.9,
    views: 1360000,
    genres: ["Action", "Martial Arts", "Fantasy"],
    chapters: makeChapters("absolute-sword-sense", 130)
  }
];

export function getAllGenres(): string[] {
  const set = new Set<string>();

  mangas.forEach((m) =>
    m.genres.forEach((g) => set.add(g))
  );

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

export function getTrending(limit = 8): Manga[] {
  return [...mangas]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getTopRated(limit = 10): Manga[] {
  return [...mangas]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

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