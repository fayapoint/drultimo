import Hero from "@/components/Hero";
import Link from "next/link";
import { getAllDocs, getAllRoteiros } from "@/lib/content";

export default function Home() {
  const docs = getAllDocs().slice(0, 6);
  const roteiros = getAllRoteiros().slice(0, 6);
  return (
    <div className="space-y-10">
      <Hero />

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Documentos em destaque</h2>
          <Link href="/docs" className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline">Ver todos</Link>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((d) => (
            <li key={d.slug}>
              <Link href={`/docs/${d.slug}`} className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <h3 className="font-semibold leading-snug">{d.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Arquivo: {d.slug}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Roteiros</h2>
          <Link href="/roteiros" className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline">Ver todos</Link>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roteiros.map((r) => (
            <li key={r.slug}>
              <Link href={`/roteiros/${r.slug}`} className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <h3 className="font-semibold leading-snug">{r.episode ? `Ep. ${r.episode}: ` : ''}{r.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{r.slug}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Plano de Implementação</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Fluxos Mermaid, arquitetura e etapas com clareza visual.</p>
          </div>
          <Link href="/plano" className="inline-flex items-center gap-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2">Acessar plano →</Link>
        </div>
      </section>
    </div>
  );
}
