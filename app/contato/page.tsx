"use client";

import { useState } from "react";

export default function ContatoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: data.message || "Mensagem enviada." });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus({ ok: false, msg: data.error || "Não foi possível enviar." });
      }
    } catch {
      setStatus({ ok: false, msg: "Erro inesperado." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contato</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Fale conosco para convites, parcerias e sugestões de temas.</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm">Nome</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm">Mensagem</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-60">
          {loading ? "Enviando..." : "Enviar"}
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
