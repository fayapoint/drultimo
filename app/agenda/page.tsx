import Link from "next/link";
import { getAgenda } from "@/lib/agenda";

export const metadata = { title: "Agenda | Dr. Ultimo & Convidados" };

export default function AgendaPage() {
  const proximos = getAgenda().slice(0, 20);
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Calendário dos próximos episódios. Você pode alimentar pela planilha `data/agenda.json`. Se não houver dados, a agenda é gerada automaticamente (semanal, domingo 20:00).
        </p>
      </header>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {proximos.map((r) => (
          <li key={r.slug} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="text-xs text-zinc-500 mb-1">{r.episode ? `Ep. ${r.episode}` : ""}</div>
            <h3 className="font-semibold leading-snug">{r.title}</h3>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {new Date(r.date).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
            </div>
            <div className="mt-3 text-sm">
              <Link href={`/roteiros/${r.slug}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">Ver roteiro</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
