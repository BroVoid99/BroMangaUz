"use client";
import { useState } from "react";

const MANGA_OPTIONS = [
  { slug: "reality-quest", label: "Reality Quest" },
  { slug: "viral-hit", label: "Viral Hit" },
  { slug: "player", label: "Player" },
  { slug: "fake-girlfriend", label: "Fake Girlfriend" },
  { slug: "absolute-sword-sense", label: "Absolute Sword Sense" }
];

export default function AdminPage() {
  const [slug, setSlug] = useState(MANGA_OPTIONS[0].slug);
  const [chapterNumber, setChapterNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    </main>
  );
}