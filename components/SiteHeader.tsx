"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, BookOpen, FileText, Workflow, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);
  function toggle() {
    const root = document.documentElement;
    const next = !isDark;
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
      window.dispatchEvent(new Event("themechange"));
    } catch {}
    setIsDark(next);
  }
  if (!mounted) return null;
  return (
    <button
      aria-label="Alternar tema"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">Tema</span>
    </button>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const links = [
    { href: "/", label: "Início", icon: <Home size={16} /> },
    { href: "/docs", label: "Documentos", icon: <FileText size={16} /> },
    { href: "/roteiros", label: "Roteiros", icon: <BookOpen size={16} /> },
    { href: "/plano", label: "Plano", icon: <Workflow size={16} /> },
    { href: "/agenda", label: "Agenda", icon: <span className="inline-block w-4 h-4 rounded-sm bg-emerald-500" /> },
    { href: "/newsletter", label: "Newsletter", icon: <span className="inline-block w-4 h-4 rounded-sm bg-indigo-500" /> },
    { href: "/redes", label: "Redes", icon: <span className="inline-block w-4 h-4 rounded-sm bg-pink-500" /> },
    { href: "/contato", label: "Contato", icon: <span className="inline-block w-4 h-4 rounded-sm bg-orange-500" /> },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Menu className="opacity-40" size={18} />
          <span>Dr. Ultimo & Convidados</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                pathname === l.href ? "bg-zinc-100 dark:bg-zinc-900" : ""
              }`}
            >
              {l.icon}
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) router.push(`/busca?q=${encodeURIComponent(q)}`);
            }}
            className="hidden md:flex items-center"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
