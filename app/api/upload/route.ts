import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { pdf } from "pdf-to-img";
import sharp from "sharp";
import { upsertChapterWithPages } from "@/lib/db-chapters";

export const runtime = "nodejs";
export const maxDuration = 300; // Fluid Compute yoqilgani uchun Hobby'da ham 300s gacha ruxsat etiladi

const WEBP_MAX_DIMENSION = 16383;
const WEBP_QUALITY = 85;
const SCALE = 2;
const CONCURRENCY = 5; // test natijalariga ko'ra optimal qiymat

/**
 * items massividagi har bir elementni worker orqali ishlaydi,
 * lekin bir vaqtning o'zida ko'pi bilan limit tadan parallel ishga tushiradi.
 * Natija massivi kirish tartibida (index bo'yicha) qaytadi.
 */
async function processWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, idx: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function runNext(): Promise<void> {
    const current = cursor++;
    if (current >= items.length) return;
    results[current] = await worker(items[current], current);
    await runNext();
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runNext()));

  return results;
}

export async function POST(req: Request) {
  try {
    // MUHIM O'ZGARISH: endi PDF faylning o'zi emas, balki uning
    // Blob'dagi manzili (pdfUrl) JSON sifatida keladi. Fayl allaqachon
    // brauzerdan to'g'ridan-to'g'ri Blob'ga yuklangan bo'ladi
    // (@vercel/blob/client orqali), shuning uchun bu yerga faqat
    // bir necha bayt matn keladi — 4.5MB limitiga hech qachon urilmaydi.
    const bodyJson = await req.json();
    const pdfUrl = bodyJson?.pdfUrl as string | undefined;
    const slug = bodyJson?.slug as string | undefined;
    const chapterNumberRaw = bodyJson?.chapterNumber as string | number | undefined;

    if (!pdfUrl) {
      return NextResponse.json({ success: false, error: "PDF manzili topilmadi." }, { status: 400 });
    }
    if (!slug) {
      return NextResponse.json({ success: false, error: "Manhwa tanlanmagan." }, { status: 400 });
    }
    if (chapterNumberRaw === undefined || isNaN(Number(chapterNumberRaw))) {
      return NextResponse.json({ success: false, error: "Bob raqami noto'g'ri." }, { status: 400 });
    }

    const chapterNumber = Number(chapterNumberRaw);

    // Server endi PDF'ni Blob'dan o'zi yuklab oladi.
    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) {
      return NextResponse.json(
        { success: false, error: "PDF Blob'dan yuklab bo'lmadi." },
        { status: 400 }
      );
    }
    const arrayBuffer = await pdfRes.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // PDF hujjatini ochamiz (hali sahifalarni render qilmaydi)
    const document = await pdf(pdfBuffer, { scale: SCALE });
    const pageCount = document.length;

    if (!pageCount || pageCount === 0) {
      return NextResponse.json(
        { success: false, error: "PDF ichidan sahifa topilmadi." },
        { status: 400 }
      );
    }

    const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

    // Har bir sahifani (render -> webp -> blob upload) PARALLEL, lekin
    // CONCURRENCY bilan cheklangan holda ishlaymiz.
    const pageUrls = await processWithConcurrencyLimit(
      pageNumbers,
      CONCURRENCY,
      async (pageNum) => {
        const pageBuffer = await document.getPage(pageNum);

        const image = sharp(pageBuffer);
        const metadata = await image.metadata();
        let pipeline = image;
        if (
          (metadata.width && metadata.width > WEBP_MAX_DIMENSION) ||
          (metadata.height && metadata.height > WEBP_MAX_DIMENSION)
        ) {
          pipeline = pipeline.resize({
            width: metadata.width ? Math.min(metadata.width, WEBP_MAX_DIMENSION) : undefined,
            height: metadata.height ? Math.min(metadata.height, WEBP_MAX_DIMENSION) : undefined,
            fit: "inside",
            withoutEnlargement: true
          });
        }

        const webpBuffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();

        const pageFileName = `chapters/${slug}/${chapterNumber}/${String(pageNum).padStart(3, "0")}.webp`;
        const blob = await put(pageFileName, webpBuffer, {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: "image/webp"
        });

        return blob.url;
      }
    );

    // Xotirani tozalash (kutubxona hujjatida tavsiya etilgan)
    if (typeof (document as any).destroy === "function") {
      await (document as any).destroy();
    }

    await upsertChapterWithPages(slug, chapterNumber, pageUrls);

    return NextResponse.json({
      success: true,
      pageCount: pageUrls.length,
      slug,
      chapterNumber
    });
  } catch (err: any) {
    console.error("========== UPLOAD ERROR ==========");
    console.error(err);
    console.error("==================================");
    return NextResponse.json(
      { success: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}