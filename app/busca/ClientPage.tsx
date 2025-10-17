"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type Result = {
  slug: string;
  title: string;
  type: "doc" | "roteiro";
  episode?: number;
  href: string;
  excerpt: string;
  excerptHtml?: string;
};

export default function BuscaClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") || "");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(query: string) {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initial = sp.get("q");
    if (initial) runSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(`/busca?q=${encodeURIComponent(q)}`);
    runSearch(q);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Busca</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Pesquise em documentos e roteiros.</p>
      </header>

      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Digite um termo..."
          className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2">Buscar</button>
      </form>

      {loading && <div className="text-sm text-zinc-500">Buscando...</div>}
      {results && (
        <ul className="space-y-3">
          {results.length === 0 && <li className="text-sm text-zinc-500">Nada encontrado.</li>}
          {results.map((r) => (
            <li key={r.slug} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="text-xs text-zinc-500 mb-1">{r.type === "roteiro" ? `Roteiro${r.episode ? ` • Ep. ${r.episode}` : ""}` : "Documento"}</div>
              <Link href={r.href} className="font-semibold hover:underline">
                {r.title}
              </Link>
              {r.excerptHtml ? (
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: r.excerptHtml }} />
              ) : (
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-3">{r.excerpt}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
