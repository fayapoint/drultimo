import { notFound } from "next/navigation";
import Link from "next/link";
import { getBySlug, getAllDocs } from "@/lib/content";
import Markdown from "@/components/Markdown";
import { ChevronLeft } from "lucide-react";

export function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = getBySlug(params.slug);
  if (!doc) return { title: "Documento" };
  return { title: `${doc.title} | Documentos` };
}

export default function DocDetailPage({ params }: { params: { slug: string } }) {
  const doc = getBySlug(params.slug);
  if (!doc) return notFound();
  return (
    <div className="space-y-6">
      <Link href="/docs" className="inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 hover:underline">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
      <Markdown source={doc.content} />
    </div>
  );
}
