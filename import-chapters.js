/**
 * MANHWA/MANGA BOB YUKLASH SKRIPTI
 * ---------------------------------
 * Papkadagi barcha ZIP fayllarni o'qiydi, ichidagi rasmlarni tartib bilan
 * ajratib, /public/uploads/{manhwaSlug}/{chapterNumber}/ papkasiga saqlaydi
 * va natijani chapters.json faylga (yoki o'zingizning bazangizga) yozadi.
 *
 * ZIP fayl nomlash qoidasi (buni o'zgartirsangiz bo'ladi):
 *   Chapter_1.zip, Chapter_2.zip, Chapter_1001.zip ...
 *
 * ZIP ICHIDA rasmlar: 001.jpg, 002.jpg, 003.jpg ... (tartib muhim emas,
 * skript "natural sort" bilan o'zi to'g'irlaydi: 2.jpg < 10.jpg)
 *
 * O'RNATISH:
 *   npm install adm-zip
 *
 * ISHLATISH:
 *   node import-chapters.js ./raw-chapters my-manhwa-slug
 *
 *   ./raw-chapters  -> ZIP fayllar turgan papka
 *   my-manhwa-slug  -> manhwaning saytdagi slug/ID'si
 */

const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

// ---- SOZLAMALAR ----
const SOURCE_DIR = process.argv[2]; // ZIP fayllar papkasi
const MANHWA_SLUG = process.argv[3]; // manhwa identifikatori
const OUTPUT_ROOT = path.join(__dirname, "public", "uploads");
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

if (!SOURCE_DIR || !MANHWA_SLUG) {
  console.error("Foydalanish: node import-chapters.js <zip-papka> <manhwa-slug>");
  process.exit(1);
}

// "Chapter_2.zip" ichidan 2 raqamini ajratib olish
function extractChapterNumber(filename) {
  const match = filename.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

// Tabiiy tartiblash: "2.jpg" ni "10.jpg" dan oldin qo'yadi
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function processZip(zipPath, chapterNumber) {
  const zip = new AdmZip(zipPath);
  const entries = zip
    .getEntries()
    .filter((e) => !e.isDirectory && ALLOWED_EXT.includes(path.extname(e.entryName).toLowerCase()))
    .sort((a, b) => naturalSort(a.entryName, b.entryName));

  if (entries.length === 0) {
    console.warn(`  ⚠️  ${path.basename(zipPath)} ichida rasm topilmadi, o'tkazib yuborildi.`);
    return null;
  }

  const chapterDir = path.join(OUTPUT_ROOT, MANHWA_SLUG, String(chapterNumber));
  ensureDir(chapterDir);

  const pageUrls = [];
  entries.forEach((entry, index) => {
    const ext = path.extname(entry.entryName).toLowerCase();
    // Sahifalarni 001, 002, 003... deb qayta nomlaymiz — tartib buzilmasin
    const pageFileName = `${String(index + 1).padStart(3, "0")}${ext}`;
    const destPath = path.join(chapterDir, pageFileName);

    fs.writeFileSync(destPath, entry.getData());

    // Saytda ishlatiladigan public URL (o'zingizning domenga moslang)
    pageUrls.push(`/uploads/${MANHWA_SLUG}/${chapterNumber}/${pageFileName}`);
  });

  return {
    chapterNumber,
    pageCount: pageUrls.length,
    pages: pageUrls,
  };
}

async function main() {
  const zipFiles = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.toLowerCase().endsWith(".zip"))
    .sort(naturalSort);

  if (zipFiles.length === 0) {
    console.error("Papkada ZIP fayl topilmadi.");
    process.exit(1);
  }

  console.log(`Topildi: ${zipFiles.length} ta ZIP fayl. Boshlanmoqda...\n`);

  const results = [];
  for (const file of zipFiles) {
    const chapterNumber = extractChapterNumber(file);
    if (chapterNumber === null) {
      console.warn(`⚠️  ${file} — bob raqami aniqlanmadi, o'tkazib yuborildi.`);
      continue;
    }

    process.stdout.write(`Bob ${chapterNumber} qayta ishlanmoqda (${file})... `);
    const result = await processZip(path.join(SOURCE_DIR, file), chapterNumber);

    if (result) {
      results.push(result);
      console.log(`✅ ${result.pageCount} sahifa`);
    } else {
      console.log("❌ xato");
    }
  }

  // Natijani JSON faylga yozamiz — buni keyin o'z bazangizga
  // (MongoDB/MySQL/Postgres) import qilishingiz mumkin.
  results.sort((a, b) => a.chapterNumber - b.chapterNumber);
  const outputJsonPath = path.join(__dirname, `${MANHWA_SLUG}-chapters.json`);
  fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2));

  console.log(`\n🎉 Tayyor! ${results.length} ta bob qayta ishlandi.`);
  console.log(`📄 Ma'lumotlar: ${outputJsonPath}`);
  console.log(`🖼️  Rasmlar: ${path.join(OUTPUT_ROOT, MANHWA_SLUG)}`);
}

main().catch((err) => {
  console.error("Xatolik:", err);
  process.exit(1);
});