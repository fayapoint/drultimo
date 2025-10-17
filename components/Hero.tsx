"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Workflow } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 p-8">
      <motion.div
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Dr. Ultimo & Convidados
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-prose">
            Debates polêmicos, justiça, tecnologia e gastronomia, ao vivo e com alto padrão de produção.
            Explore a documentação, os roteiros completos e o plano técnico com fluxos Mermaid.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/docs" className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
              <FileText size={16} /> Documentos
            </Link>
            <Link href="/roteiros" className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
              <BookOpen size={16} /> Roteiros
            </Link>
            <Link href="/plano" className="inline-flex items-center gap-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2">
              <Workflow size={16} /> Plano <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <motion.div
            className="aspect-[4/3] w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-tr from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-6">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Prévia Visual</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-24 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30" />
                <div className="h-24 rounded-lg bg-gradient-to-br from-rose-500/30 to-orange-500/30" />
                <div className="h-24 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/30" />
                <div className="col-span-3 h-20 rounded-lg bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
