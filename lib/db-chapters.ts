import "server-only";
import { del } from "@vercel/blob";
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
  // Avval mavjud bo'lsa, eski sahifalarni tozalaymiz (qayta yuklashni qo'llab-quvvatlash uchun)
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

/**
 * Bitta sahifani (Blob'dan va DB'dan) o'chiradi, so'ng shu bobdagi
 * qolgan sahifalarni qayta indekslaydi (bo'shliq qolmasligi uchun).
 */
export async function deleteChapterPage(pageId: string) {
  const page = await prisma.page.findUnique({ where: { id: pageId } });

  if (!page) {
    throw new Error("Sahifa topilmadi.");
  }

  // Vercel Blob'dan haqiqiy faylni o'chiramiz
  await del(page.imageUrl);

  // DB'dan yozuvni o'chiramiz
  await prisma.page.delete({ where: { id: pageId } });

  // O'chirilgan sahifadan keyingi barcha sahifalarning index'ini
  // bittaga kamaytiramiz — shunda o'quvchi uchun tartibda bo'shliq qolmaydi.
  await prisma.page.updateMany({
    where: { chapterId: page.chapterId, index: { gt: page.index } },
    data: { index: { decrement: 1 } }
  });

  return { chapterId: page.chapterId };
}