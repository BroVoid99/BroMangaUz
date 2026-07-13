import "server-only";
import { prisma } from "./prisma";

export async function getDbChapter(mangaSlug: string, number: number) {
  const chapter = await prisma.chapter.findUnique({
    where: { mangaSlug_number: { mangaSlug, number } },
    include: { pages: { orderBy: { index: "asc" } } }
  });
  return chapter;
}

export async function getDbChapterNumbers(mangaSlug: string): Promise<number[]> {
  const chapters = await prisma.chapter.findMany({
    where: { mangaSlug },
    select: { number: true }
  });
  return chapters.map((c) => c.number);
}

export async function upsertChapterWithPages(
  mangaSlug: string,
  number: number,
  pageUrls: string[],
  title?: string
) {
  const existing = await prisma.chapter.findUnique({
    where: { mangaSlug_number: { mangaSlug, number } }
  });

  if (existing) {
    await prisma.page.deleteMany({ where: { chapterId: existing.id } });
    await prisma.chapter.update({
      where: { id: existing.id },
      data: {
        title,
        pages: {
          create: pageUrls.map((url, i) => ({ index: i + 1, imageUrl: url }))
        }
      }
    });
    return existing.id;
  }

  const created = await prisma.chapter.create({
    data: {
      mangaSlug,
      number,
      title,
      pages: {
        create: pageUrls.map((url, i) => ({ index: i + 1, imageUrl: url }))
      }
    }
  });
  return created.id;
}