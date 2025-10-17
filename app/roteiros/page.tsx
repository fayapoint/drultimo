import Link from "next/link";
import { getAllRoteiros } from "@/lib/content";
import EpisodeCover from "@/components/EpisodeCover";

export const metadata = {
  title: "Roteiros | Dr. Ultimo & Convidados",
};

export default function RoteirosPage() {
  const roteiros = getAllRoteiros();
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Roteiros</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Todos os roteiros detalhados dos episódios, cada um com ilustração e página dedicada.
        </p>
      </header>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roteiros.map((r) => (
          <li key={r.slug} className="flex flex-col">
            <Link href={`/roteiros/${r.slug}`} className="group block">
              <EpisodeCover id={r.episode} title={r.title} />
              <h2 className="mt-3 font-semibold group-hover:underline leading-snug">
                {r.episode ? `Ep. ${r.episode}: ` : ""}
                {r.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
