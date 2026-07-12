export type MangaStatus = "ONGOING" | "COMPLETED" | "HIATUS" | "DROPPED";

export interface ChapterPage {
  index: number;
  imageUrl: string;
}

export interface Chapter {
  number: number;
  title?: string;
  publishedAt: string;
  pages: ChapterPage[];
}

export interface Manga {
  slug: string;
  title: string;
  titleUz?: string;
  author: string;
  synopsis: string;
  synopsisUz?: string;
  coverSeed: string;
  status: MangaStatus;
  rating: number;
  views: number;
  genres: string[];
  chapters: Chapter[];
}

export const STATUS_LABEL: Record<MangaStatus, string> = {
  ONGOING: "Davom etmoqda",
  COMPLETED: "Yakunlangan",
  HIATUS: "To'xtatilgan",
  DROPPED: "Tashlab yuborilgan"
};
