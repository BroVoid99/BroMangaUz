/**
 * MANHWA BOB YUKLASH SKRIPTI — BroManga uchun moslashtirilgan (v2)
 * -------------------------------------------------------------------
 * PDF fayllarni WEBP rasmlarga aylantiradi va
 * public/chapters/{slug}/{chapterNumber}/{001,002,...}.webp
 * formatida saqlaydi — bu ChapterReader.tsx kutayotgan aniq yo'l va format.
 *
 * O'RNATISH:
 *   npm install pdf-to-img sharp
 *
 * ISHLATISH:
 *   node import-chapters-pdf.js ./raw-chapters reality-quest
 *
 *   ./raw-chapters   -> PDF fayllar turgan papka (Chapter_1.pdf, Chapter_2.pdf ...)
 *   reality-quest    -> lib/data.ts dagi manga slug'i (albatta mavjud slug bo'lishi kerak)
 */

const fs = require("fs");
const path = require("path");
const { pdf } = require("pdf-to-img");
const sharp = require("sharp");

const SOURCE_DIR = process.argv[2];
const MANGA_SLUG = process.argv[3];
const OUTPUT_ROOT = path.join(__dirname, "public", "chapters"); // <-- to'g'irlandi
const SCALE = 2;
const WEBP_QUALITY = 85; // 0-100, yuqoriroq = sifatliroq lekin katta hajm

if (!SOURCE_DIR || !MANGA_SLUG) {
  console.error("Foydalanish: node import-chapters-pdf.js <pdf-papka> <manga-slug>");
  process.exit(1);
}

function extractChapterNumber(filename) {
  const match = filename.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function processPdf(pdfPath, chapterNumber) {
  const chapterDir = path.join(OUTPUT_ROOT, MANGA_SLUG, String(chapterNumber));
  ensureDir(chapterDir);

  const document = await pdf(pdfPath, { scale: SCALE });

  let index = 1;
  let pageCount = 0;
  for await (const pageBuffer of document) {
    const pageFileName = `${String(index).padStart(3, "0")}.webp`; // <-- to'g'irlandi
    const destPath = path.join(chapterDir, pageFileName);

    // PNG buffer -> WEBP ga siqib konvertatsiya qilamiz
    // WEBP formatining maksimal o'lchovi 16383px — uzun manhwa sahifalari
    // (webtoon strip) ba'zan shundan oshib ketadi, shuning uchun kerak
    // bo'lsa proportsional kichraytiramiz.
    const WEBP_MAX_DIMENSION = 16383;
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

    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(destPath);

    index++;
    pageCount++;
  }

  return { chapterNumber, pageCount };
}

async function main() {
  const pdfFiles = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort(naturalSort);

  if (pdfFiles.length === 0) {
    console.error("Papkada PDF fayl topilmadi.");
    process.exit(1);
  }

  console.log(`Topildi: ${pdfFiles.length} ta PDF fayl. Boshlanmoqda...\n`);

  const results = [];
  for (const file of pdfFiles) {
    const chapterNumber = extractChapterNumber(file);
    if (chapterNumber === null) {
      console.warn(`⚠️  ${file} — bob raqami aniqlanmadi, o'tkazib yuborildi.`);
      continue;
    }

    process.stdout.write(`Bob ${chapterNumber} qayta ishlanmoqda (${file})... `);
    try {
      const result = await processPdf(path.join(SOURCE_DIR, file), chapterNumber);
      results.push(result);
      console.log(`✅ ${result.pageCount} sahifa (webp)`);
    } catch (err) {
      console.log(`❌ xato: ${err.message}`);
    }
  }

  console.log(`\n🎉 Tayyor! ${results.length} ta bob qayta ishlandi.`);
  console.log(`🖼️  Rasmlar: ${path.join(OUTPUT_ROOT, MANGA_SLUG)}`);
  console.log(
    `\nℹ️  Eslatma: sahifalar soni endi lib/data.ts da avtomatik aniqlanadi (agar\n` +
      `   pastdagi data.ts o'zgarishini qo'llagan bo'lsangiz). Aks holda pastdagi\n` +
      `   ko'rsatmaga qarab lib/data.ts ni qo'lda yangilang.`
  );
}

main().catch((err) => {
  console.error("Xatolik:", err);
  process.exit(1);
});