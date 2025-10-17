import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import type { Plugin, Processor } from "unified";
import type { Options as RemarkRehypeOptions } from "remark-rehype";
import type { Options as RehypeAutolinkOptions } from "rehype-autolink-headings";

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const processor = unified() as unknown as Processor;
  const file = await processor
    .use(remarkParse as unknown as Plugin<[]>)
    .use(remarkGfm as unknown as Plugin<[]>)
    .use(remarkRehype as unknown as Plugin<[RemarkRehypeOptions]>, { allowDangerousHtml: true } satisfies RemarkRehypeOptions)
    .use(rehypeRaw as unknown as Plugin<[]>)
    .use(rehypeSlug as unknown as Plugin<[]>)
    .use(
      rehypeAutolinkHeadings as unknown as Plugin<[RehypeAutolinkOptions]>,
      {
        behavior: "append",
        content: {
          type: "element",
          tagName: "span",
          properties: { className: ["heading-link"] },
          children: [{ type: "text", value: "#" }],
        },
      } satisfies RehypeAutolinkOptions
    )
    .use(rehypeStringify as unknown as Plugin<[]>)
    .process(markdown);

  let html = String(file);
  // Convert mermaid code blocks to <div class="mermaid"> for client rendering
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, (_m, code) => {
    const decoded = code
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
    return `<div class="mermaid">${decoded}</div>`;
  });
  return html;
}
