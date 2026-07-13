"use client";
import { useState } from "react";

const MANGA_OPTIONS = [
  { slug: "reality-quest", label: "Reality Quest" },
  { slug: "viral-hit", label: "Viral Hit" },
  { slug: "player", label: "Player" },
  { slug: "fake-girlfriend", label: "Fake Girlfriend" },
  { slug: "absolute-sword-sense", label: "Absolute Sword Sense" }
];

type ChapterPage = {
  id: string;
  index: number;
  imageUrl: string;
};

export default function AdminPage() {
  const [slug, setSlug] = useState(MANGA_OPTIONS[0].slug);
  const [chapterNumber, setChapterNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // --- Sahifalarni boshqarish uchun holat (state) ---
  const [manageSlug, setManageSlug] = useState(MANGA_OPTIONS[0].slug);
  const [manageChapterNumber, setManageChapterNumber] = useState("");
  const [pages, setPages] = useState<ChapterPage[] | null>(null);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [pagesMessage, setPagesMessage] = useState<string | null>(null);
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);

  async function loadPages() {
    if (!manageChapterNumber || isNaN(Number(manageChapterNumber))) {
      setPagesMessage("⚠️ Bob raqamini to'g'ri kiriting");
      return;
    }

    setPagesLoading(true);
    setPagesMessage(null);
    setPages(null);

    try {
      const res = await fetch(
        `/api/admin/chapter-pages?slug=${encodeURIComponent(manageSlug)}&number=${encodeURIComponent(manageChapterNumber)}`
      );
      const data = await res.json();
      setPagesLoading(false);

      if (data.success) {
        setPages(data.pages);
        if (data.pages.length === 0) {
          setPagesMessage("Bu bobda sahifalar topilmadi.");
        }
      } else {
        setPagesMessage(`❌ Xato: ${data.error}`);
      }
    } catch (err: any) {
      setPagesLoading(false);
      setPagesMessage(`❌ Xato: ${err.message}`);
    }
  }

  async function handleDeletePage(pageId: string) {
    const confirmed = window.confirm("Bu sahifani butunlay o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.");
    if (!confirmed) return;

    setDeletingPageId(pageId);
    setPagesMessage(null);

    try {
      const res = await fetch("/api/admin/chapter-pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId })
      });
      const data = await res.json();
      setDeletingPageId(null);

      if (data.success) {
        setPagesMessage("✅ Sahifa o'chirildi.");
        // Ro'yxatni yangilaymiz
        await loadPages();
      } else {
        setPagesMessage(`❌ Xato: ${data.error}`);
      }
    } catch (err: any) {
      setDeletingPageId(null);
      setPagesMessage(`❌ Xato: ${err.message}`);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-bold text-yellow-400">BroManga Admin</h1>
      <p className="mt-2 text-gray-400">Manhwa va manga boblarini yuklash paneli</p>

      <div className="mt-10 rounded-xl border border-gray-700 bg-zinc-900 p-6">
        <h2 className="mb-6 text-2xl font-semibold">Yangi bob qo'shish</h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm">Manhwa</label>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-black p-3"
            >
              {MANGA_OPTIONS.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">Bob raqami</label>
            <input
              type="number"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-black p-3"
              placeholder="161"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">PDF yoki CBZ</label>
            <input
              type="file"
              accept=".pdf,.cbz,.zip"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setFile(e.target.files[0]);
                }
              }}
              className="w-full rounded-lg border border-gray-700 bg-black p-3"
            />
          </div>

          <button
            disabled={loading}
            onClick={async () => {
              if (!file) {
                setMessage("⚠️ Fayl tanlang");
                return;
              }
              if (!chapterNumber || isNaN(Number(chapterNumber))) {
                setMessage("⚠️ Bob raqamini to'g'ri kiriting");
                return;
              }

              setLoading(true);
              setMessage(null);

              const formData = new FormData();
              formData.append("file", file);
              formData.append("slug", slug);
              formData.append("chapterNumber", chapterNumber);

              try {
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData
                });
                const data = await res.json();
                setLoading(false);

                if (data.success) {
                  setMessage(`✅ Bob ${data.chapterNumber} muvaffaqiyatli yuklandi (${data.pageCount} sahifa)`);
                  setFile(null);
                  setChapterNumber("");
                } else {
                  setMessage(`❌ Xato: ${data.error}`);
                }
              } catch (err: any) {
                setLoading(false);
                setMessage(`❌ Xato: ${err.message}`);
              }
            }}
            className="w-full rounded-lg bg-yellow-500 py-3 font-bold text-black disabled:opacity-50"
          >
            {loading ? "Yuklanmoqda..." : "Upload"}
          </button>

          {message && (
            <p className="rounded-lg border border-gray-700 bg-black p-3 text-sm">{message}</p>
          )}
        </div>
      </div>

      {/* --- Sahifalarni boshqarish bo'limi --- */}
      <div className="mt-10 rounded-xl border border-gray-700 bg-zinc-900 p-6">
        <h2 className="mb-6 text-2xl font-semibold">Sahifalarni boshqarish</h2>
        <p className="mb-4 text-sm text-gray-400">
          Yuklangan bobdan keraksiz sahifani (masalan, xato skanerlangan varaqni) o'chirish uchun.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <select
            value={manageSlug}
            onChange={(e) => setManageSlug(e.target.value)}
            className="flex-1 rounded-lg border border-gray-700 bg-black p-3"
          >
            {MANGA_OPTIONS.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={manageChapterNumber}
            onChange={(e) => setManageChapterNumber(e.target.value)}
            placeholder="Bob raqami"
            className="flex-1 rounded-lg border border-gray-700 bg-black p-3"
          />

          <button
            onClick={loadPages}
            disabled={pagesLoading}
            className="rounded-lg bg-gray-700 px-6 py-3 font-semibold disabled:opacity-50"
          >
            {pagesLoading ? "Yuklanmoqda..." : "Sahifalarni ko'rish"}
          </button>
        </div>

        {pagesMessage && (
          <p className="mt-4 rounded-lg border border-gray-700 bg-black p-3 text-sm">{pagesMessage}</p>
        )}

        {pages && pages.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {pages.map((p) => (
              <div key={p.id} className="rounded-lg border border-gray-700 bg-black p-2">
                <img
                  src={p.imageUrl}
                  alt={`Sahifa ${p.index}`}
                  className="mb-2 h-40 w-full rounded object-cover"
                />
                <p className="mb-2 text-center text-xs text-gray-400">Sahifa {p.index}</p>
                <button
                  onClick={() => handleDeletePage(p.id)}
                  disabled={deletingPageId === p.id}
                  className="w-full rounded bg-red-600 py-1.5 text-sm font-semibold disabled:opacity-50"
                >
                  {deletingPageId === p.id ? "O'chirilmoqda..." : "O'chirish"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
