import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Music2, Podcast } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="font-semibold">Dr. Ultimo & Convidados</div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-prose">
            Debates polêmicos com produção de alto nível, tecnologia, direito e gastronomia.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">Navegação</div>
          <nav className="text-sm grid grid-cols-2 gap-2">
            <Link href="/docs" className="hover:underline">Documentos</Link>
            <Link href="/roteiros" className="hover:underline">Roteiros</Link>
            <Link href="/plano" className="hover:underline">Plano</Link>
            <Link href="/agenda" className="hover:underline">Agenda</Link>
            <Link href="/newsletter" className="hover:underline">Newsletter</Link>
            <Link href="/contato" className="hover:underline">Contato</Link>
          </nav>
        </div>
        <div>
          <div className="font-semibold mb-2">Redes</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="https://youtube.com" target="_blank" className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"><Youtube size={16}/>YouTube</a>
            <a href="https://instagram.com" target="_blank" className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"><Instagram size={16}/>Instagram</a>
            <a href="https://x.com" target="_blank" className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"><Twitter size={16}/>X</a>
            <a href="https://spotify.com" target="_blank" className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"><Music2 size={16}/>Spotify</a>
            <a href="https://podcasts.apple.com" target="_blank" className="inline-flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"><Podcast size={16}/>Apple</a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pb-6">© {year} Dr. Ultimo & Convidados</div>
    </footer>
  );
}
