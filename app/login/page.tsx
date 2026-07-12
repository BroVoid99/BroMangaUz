"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    login(name, email);
    router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20">
      <span className="hanko mb-4">KIRISH</span>
      <h1 className="font-display text-4xl tracking-wide text-parchment">Xush kelibsiz</h1>
      <p className="mt-2 font-body text-sm text-parchment/50">
        Bu demo profil — o'qish tarixingizni saqlash uchun.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wide text-parchment/60">
            Ism
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-line bg-panel px-4 py-2.5 font-body text-parchment outline-none focus:border-gold"
            placeholder="Salom"
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wide text-parchment/60">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line bg-panel px-4 py-2.5 font-body text-parchment outline-none focus:border-gold"
            placeholder="salom@example.com"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full border-2 border-gold py-2.5 font-display text-lg tracking-wide text-gold transition-colors hover:bg-gold hover:text-ink"
        >
          Kirish
        </button>
      </form>
    </div>
  );
}
