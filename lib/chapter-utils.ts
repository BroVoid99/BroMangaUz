import fs from "fs";
import path from "path";

export function getRealPageCount(
  slug: string,
  chapterNumber: number,
  fallback: number
): number {
  try {
    const dir = path.join(
      process.cwd(),
      "public",
      "chapters",
      slug,
      String(chapterNumber)
    );

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".webp"));

    return files.length > 0 ? files.length : fallback;
  } catch {
    return fallback;
  }
}