import { notFound } from "next/navigation";
import Link from "next/link";
import { getBySlug, getAllRoteiros } from "@/lib/content";
import Markdown from "@/components/Markdown";
import EpisodeCover from "@/components/EpisodeCover";
import { ChevronLeft } from "lucide-react";

export function generateStaticParams() {
  return getAllRoteiros().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = getBySlug(params.slug);
  if (!doc) return { title: "Roteiro" };
  const prefix = doc.episode ? `Ep. ${doc.episode}: ` : "";
  return { title: `${prefix}${doc.title} | Roteiros` };
}

export default function RoteiroDetailPage({ params }: { params: { slug: string } }) {
  const doc = getBySlug(params.slug);
  if (!doc) return notFound();
  return (
    <div className="space-y-6">
      <Link href="/roteiros" className="inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 hover:underline">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <div className="space-y-4">
        <EpisodeCover id={doc.episode} title={doc.title} />
        <h1 className="text-3xl font-bold tracking-tight">
          {doc.episode ? `Ep. ${doc.episode}: ` : ""}
          {doc.title}
        </h1>
      </div>
      <Markdown source={doc.content} />
    </div>
  );
}
