export interface ReadingProgressEntry {
  slug: string;
  chapterNumber: number;
  updatedAt: string; // ISO
}

const KEY = "bromanga:reading-progress";

export function saveProgress(slug: string, chapterNumber: number) {
  if (typeof window === "undefined") return;
  try {
    const all = getAllProgress();
    const filtered = all.filter((p) => p.slug !== slug);
    filtered.unshift({ slug, chapterNumber, updatedAt: new Date().toISOString() });
    window.localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 20)));
  } catch {
    // localStorage mavjud emas yoki to'lgan — jim o'tkazib yuboramiz
  }
}

export function getAllProgress(): ReadingProgressEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ReadingProgressEntry[]) : [];
  } catch {
    return [];
  }
}

export function getProgressFor(slug: string): ReadingProgressEntry | undefined {
  return getAllProgress().find((p) => p.slug === slug);
}
