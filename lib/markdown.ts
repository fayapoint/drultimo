import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  // Casts to any to avoid TS type conflicts between different unified/vfile versions
  const processor = unified() as any;
  const file = await processor
    .use(remarkParse as any)
    .use(remarkGfm as any)
    .use(remarkRehype as any, { allowDangerousHtml: true })
    .use(rehypeRaw as any)
    .use(rehypeSlug as any)
    .use(rehypeAutolinkHeadings as any, {
      behavior: "append",
      content: {
        type: "element",
        tagName: "span",
        properties: { className: ["heading-link"] },
        children: [{ type: "text", value: "#" }],
      },
    })
    .use(rehypeStringify as any)
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
