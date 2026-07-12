# BroManga

BroVoid tomonidan yaratilgan original manga va manhwa asarlarini o'qish uchun platforma. Next.js 14 (App Router), TypeScript, Tailwind CSS asosida qurilgan.

## Dizayn tizimi

| Element | Qiymat |
|---|---|
| Fon rangi | `#0E0D10` (near-black) |
| Aksent rang | `#C9A227` (oltin) |
| Panel rangi | `#17151A` |
| Hanko (muhr) rangi | `#8B1E24` |
| Sarlavha shrifti | Bebas Neue |
| Matn shrifti | Manrope |
| Texnik/raqam shrifti | JetBrains Mono |

Muqova rasmlari hali tayyor bo'lmagan asarlar uchun sayt har bir asar nomidan deterministik gradient generatsiya qiladi (`lib/covers.ts`) — shu sababli bir xil asar doim bir xil rangda ko'rinadi, sahifa qayta yuklanganda o'zgarmaydi.

## Loyihani ishga tushirish

```bash
npm install
npm run dev
```

Sayt `http://localhost:3000` manzilida ochiladi.

## Papka tuzilishi

```
app/
  page.tsx                 → bosh sahifa, katalog + janr filtri
  manga/[slug]/page.tsx    → asar sahifasi (sinopsis, boblar ro'yxati)
  manga/[slug]/[chapter]/  → o'qish sahifasi (klaviatura navigatsiyasi bilan)
  sitemap.ts, robots.ts    → SEO
components/                → UI qismlari (Header, MangaCard, ChapterReader, ...)
lib/
  data.ts                  → hozirgi placeholder ma'lumotlar (3 ta BroVoid asari)
  types.ts                 → TypeScript turlari
  covers.ts                → deterministik gradient generatori
prisma/schema.prisma       → kelajakdagi PostgreSQL integratsiyasi uchun sxema
```

## Haqiqiy kontentni qo'shish

Hozircha barcha asarlar va boblar `lib/data.ts` faylida statik JS massiv sifatida saqlanadi. Yangi asar qo'shish uchun:

1. `lib/data.ts` ichidagi `mangas` massiviga yangi obyekt qo'shing (slug, sarlavha, sinopsis, janrlar, boblar).
2. Har bir bob uchun `pages` massiviga sahifa rasmlarining haqiqiy URL manzilini kiriting (`imageUrl` maydoni).
3. Muqova uchun haqiqiy rasm qo'yish uchun `components/MangaCover.tsx` da `coverUrl` mavjud bo'lsa gradient o'rniga `<Image>` chiqarishga o'zgartiring.

### Keyingi bosqich: haqiqiy baza

`prisma/schema.prisma` allaqachon tayyor — `Manga`, `Chapter`, `Page`, `Genre` modellari bilan. Real bazaga o'tish uchun:

```bash
# .env faylida DATABASE_URL ni to'ldiring
npx prisma migrate dev --name init
```

So'ng `lib/data.ts` dagi statik funksiyalarni (`getMangaBySlug`, `getAllGenres` va h.k.) Prisma so'rovlariga almashtiring — funksiya imzolari bir xil qoladi, shuning uchun komponentlarni o'zgartirish shart emas.

## Vercel'ga joylash

```bash
git push
```

Vercel'da repo'ni ulang — `next.config.js` va `package.json` allaqachon Vercel uchun tayyor. `DATABASE_URL` muhit o'zgaruvchisini faqat Prisma'ga o'tganingizda qo'shing.

## Klaviatura yorliqlar (reader sahifasida)

- `→` — keyingi bob
- `←` — oldingi bob
- `Esc` — asar sahifasiga qaytish
