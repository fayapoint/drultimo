"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: data.message || "Inscrição realizada com sucesso." });
        setEmail("");
      } else {
        setStatus({ ok: false, msg: data.error || "Não foi possível inscrever." });
      }
    } catch (err) {
      setStatus({ ok: false, msg: "Erro inesperado." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Receba novidades dos episódios, bastidores e agenda.</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm">Seu e-mail</label>
          <input
            id="email"
            type="email"
            required
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Inscrever"}
        </button>
      </form>

      {status && (
        <div className={`text-sm ${status.ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
          {status.msg}
        </div>
      )}
    </div>
  );
}
