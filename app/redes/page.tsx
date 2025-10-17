import Link from "next/link";
import { Youtube, Instagram, Twitter, Facebook, Music2, Podcast } from "lucide-react";

export const metadata = { title: "Redes | Dr. Ultimo & Convidados" };

export default function RedesPage() {
  const redes = [
    { href: "https://youtube.com", label: "YouTube", icon: <Youtube size={18}/> },
    { href: "https://instagram.com", label: "Instagram", icon: <Instagram size={18}/> },
    { href: "https://x.com", label: "X (Twitter)", icon: <Twitter size={18}/> },
    { href: "https://facebook.com", label: "Facebook", icon: <Facebook size={18}/> },
    { href: "https://spotify.com", label: "Spotify", icon: <Music2 size={18}/> },
    { href: "https://podcasts.apple.com", label: "Apple Podcasts", icon: <Podcast size={18}/> },
  ];
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Redes e Plataformas</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Acompanhe o podcast nas plataformas de vídeo, áudio e redes sociais.
        </p>
      </header>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {redes.map((r) => (
          <li key={r.href}>
            <a href={r.href} target="_blank" className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <span className="opacity-80">{r.icon}</span>
              <span className="font-medium">{r.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
