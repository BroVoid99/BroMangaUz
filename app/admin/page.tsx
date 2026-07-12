export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl font-bold text-yellow-400">
        BroManga Admin
      </h1>

      <p className="mt-2 text-gray-400">
        Manhwa va manga boblarini yuklash paneli
      </p>

      <div className="mt-10 rounded-xl border border-gray-700 bg-zinc-900 p-6">

        <h2 className="mb-6 text-2xl font-semibold">
          Yangi bob qo'shish
        </h2>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block text-sm">
              Manhwa
            </label>

            <select className="w-full rounded-lg border border-gray-700 bg-black p-3">
              <option>Reality Quest</option>
              <option>Viral Hit</option>
              <option>Player</option>
              <option>Fake Girlfriend</option>
              <option>Absolute Sword Sense</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Bob raqami
            </label>

            <input
              type="number"
              className="w-full rounded-lg border border-gray-700 bg-black p-3"
              placeholder="161"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              PDF yoki CBZ
            </label>

            <input
              type="file"
              accept=".pdf,.cbz,.zip"
              className="w-full rounded-lg border border-gray-700 bg-black p-3"
            />
          </div>

          <button className="w-full rounded-lg bg-yellow-500 py-3 font-bold text-black">
            Upload
          </button>

        </div>

      </div>
    </main>
  );
}