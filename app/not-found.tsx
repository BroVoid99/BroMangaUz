import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-32 text-center">
      <span className="hanko mb-6">YO'QOLDI</span>
      <h1 className="font-display text-6xl tracking-wide text-parchment">404</h1>
      <p className="mt-4 max-w-md font-body text-parchment/60">
        Bu sahifa yoki bob mavjud emas — ehtimol o'chirilgan yoki hali chop etilmagan.
      </p>
      <Link
        href="/"
        className="mt-8 border-2 border-gold px-6 py-2.5 font-display text-lg tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
      >
        Katalogga qaytish
      </Link>
    </div>
  );
}
