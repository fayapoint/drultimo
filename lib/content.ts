import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type DocMeta = {
  slug: string;
  title: string;
  filePath: string;
  type: "doc" | "roteiro";
  episode?: number;
};

export type Doc = DocMeta & {
  content: string;
};

const DOC_DIR = path.join(process.cwd(), "doc");

function ensureDocDir() {
  if (!fs.existsSync(DOC_DIR)) {
    throw new Error(`Diretório de documentos não encontrado: ${DOC_DIR}`);
  }
}

export function slugify(input: string): string {
  const noExt = input.replace(/\.md$/i, "");
  // Normalize and strip diacritics
  const normalized = noExt.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export function isRoteiroFile(filename: string): boolean {
  // normalize by removing diacritics to make checks accent-insensitive
  const lower = filename
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return lower.startsWith("roteiro detalhado do episodio") ||
    lower.startsWith("roteiro_detalhado do episodio") ||
    lower.startsWith("roteiro_episodio_");
}

function extractEpisode(filename: string, content?: string): number | undefined {
  // Try patterns in filename first
  const m1 = filename.match(/epis[íi]odio\s*(\d+)/i);
  if (m1) return parseInt(m1[1], 10);
  const m2 = filename.match(/roteiro_episodio_(\d+)/i);
  if (m2) return parseInt(m2[1], 10);
  // Fallback: look for H1 with number
  if (content) {
    const h1 = content.match(/^#\s*.*?(\d+)/m);
    if (h1) return parseInt(h1[1], 10);
  }
  return undefined;
}

function extractTitle(filename: string, content: string): string {
  const fm = matter(content);
  if (fm.data && typeof fm.data.title === "string") return fm.data.title;
  const m = fm.content.match(/^#\s+(.+)$/m);
  if (m) return m[1].trim();
  return filename.replace(/\.md$/i, "");
}

export function listAllMarkdownFiles(): string[] {
  ensureDocDir();
  const files = fs.readdirSync(DOC_DIR).filter((f) => f.toLowerCase().endsWith(".md"));
  return files.map((f) => path.join(DOC_DIR, f));
}

export function getAllEntries(): DocMeta[] {
  const files = listAllMarkdownFiles();
  const metas: DocMeta[] = files.map((filePath) => {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, "utf8");
    const title = extractTitle(filename, content);
    const type: DocMeta["type"] = isRoteiroFile(filename) ? "roteiro" : "doc";
    const episode = type === "roteiro" ? extractEpisode(filename, content) : undefined;
    const s = slugify(filename);
    return { slug: s, title, filePath, type, episode };
  });
  // For roteiros, sort by episode number if present; else by title
  const roteiros = metas
    .filter((m) => m.type === "roteiro")
    .sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0));
  const docs = metas
    .filter((m) => m.type === "doc")
    .sort((a, b) => a.title.localeCompare(b.title));
  return [...docs, ...roteiros];
}

export function getAllDocs(): DocMeta[] {
  return getAllEntries().filter((m) => m.type === "doc");
}

export function getAllRoteiros(): DocMeta[] {
  return getAllEntries().filter((m) => m.type === "roteiro");
}

export function getBySlug(slug: string): Doc | null {
  const metas = getAllEntries();
  const meta = metas.find((m) => m.slug === slug);
  if (!meta) return null;
  const raw = fs.readFileSync(meta.filePath, "utf8");
  const { content } = matter(raw);
  return { ...meta, content };
}
