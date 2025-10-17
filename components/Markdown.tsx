import { renderMarkdownToHtml } from "@/lib/markdown";

export default async function Markdown({ source }: { source: string }) {
  const html = await renderMarkdownToHtml(source);
  return (
    <article
      className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
