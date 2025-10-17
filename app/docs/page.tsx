import Link from "next/link";
import { getAllDocs } from "@/lib/content";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Documentos | Dr. Ultimo & Convidados",
};

export default function DocsPage() {
  const docs = getAllDocs();
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Base técnica, orçamentos, pesquisas de equipamento e documentação operacional do podcast.
        </p>
      </header>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/docs/${d.slug}`}
              className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors h-full"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-900">
                  <FileText size={18} />
                </div>
                <h2 className="font-semibold leading-snug">{d.title}</h2>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                Arquivo: {d.slug}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
