import { NextResponse } from "next/server";
import { getAllEntries, getBySlug } from "@/lib/content";

function normalize(s: string) {
  return s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function normalizeWithMap(s: string) {
  const map: number[] = [];
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const norm = ch.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    for (let j = 0; j < norm.length; j++) {
      out += norm[j].toLowerCase();
      map.push(i);
    }
  }
  return { out, map };
}

function htmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildMultiExcerpts(content: string, q: string, maxSnippets = 3) {
  const nq = normalize(q);
  const { out: hay, map } = normalizeWithMap(content);
  const windowBefore = 60;
  const windowAfter = 100;
  const occurrences: Array<{ start: number; end: number }> = [];
  let p = 0;
  while (true) {
    const found = hay.indexOf(nq, p);
    if (found === -1) break;
    const startNorm = Math.max(0, found - windowBefore);
    const endNorm = Math.min(hay.length, found + nq.length + windowAfter);
    const start = map[startNorm] ?? 0;
    const end = (map[endNorm - 1] ?? content.length - 1) + 1;
    occurrences.push({ start, end });
    p = found + nq.length;
  }
  if (!occurrences.length) return { excerpt: "", excerptHtml: "" };
  // Merge overlapping windows and cap
  occurrences.sort((a, b) => a.start - b.start);
  const merged: typeof occurrences = [];
  for (const curr of occurrences) {
    const prev = merged[merged.length - 1];
    if (!prev || curr.start > prev.end) merged.push({ ...curr });
    else prev.end = Math.max(prev.end, curr.end);
  }
  const clips = merged.slice(0, maxSnippets);

  const parts: string[] = [];
  const plainParts: string[] = [];
  for (const clip of clips) {
    const excerpt = content.slice(clip.start, clip.end);
    // within this excerpt, highlight all occurrences
    const { out: normExcerpt, map: subMap } = normalizeWithMap(excerpt);
    const marks: Array<{ s: number; e: number }> = [];
    let sp = 0;
    while (true) {
      const f = normExcerpt.indexOf(nq, sp);
      if (f === -1) break;
      const sOrig = subMap[f] ?? 0;
      const eOrig = ((subMap[f + nq.length - 1] ?? excerpt.length - 1) + 1);
      marks.push({ s: Math.max(0, sOrig), e: Math.min(excerpt.length, eOrig) });
      sp = f + nq.length;
    }
    marks.sort((a, b) => a.s - b.s);
    const mergedMarks: typeof marks = [];
    for (const m of marks) {
      const last = mergedMarks[mergedMarks.length - 1];
      if (!last || m.s > last.e) mergedMarks.push({ ...m });
      else last.e = Math.max(last.e, m.e);
    }
    let html = "";
    let cursor = 0;
    for (const m of mergedMarks) {
      if (m.s > cursor) html += htmlEscape(excerpt.slice(cursor, m.s));
      html += `<mark>` + htmlEscape(excerpt.slice(m.s, m.e)) + `</mark>`;
      cursor = m.e;
    }
    if (cursor < excerpt.length) html += htmlEscape(excerpt.slice(cursor));
    parts.push(html);
    plainParts.push(excerpt);
  }
  const excerptHtml = (clips.length > 1 ? "… " : "") + parts.join(" … ") + (clips.length > 1 ? " …" : "");
  const excerpt = (clips.length > 1 ? "… " : "") + plainParts.join(" … ") + (clips.length > 1 ? " …" : "");
  return { excerpt, excerptHtml };
}

function tokenize(s: string): string[] {
  return normalize(s).split(/[^a-z0-9]+/i).filter((t) => t.length > 1);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ results: [] });
  const nq = normalize(q);

  const entries = getAllEntries();

  // Build BM25 corpus
  const docs = entries.map((m) => {
    const d = getBySlug(m.slug)!;
    const titleTokens = tokenize(d.title);
    const contentTokens = tokenize(d.content);
    const tf = new Map<string, number>();
    for (const t of contentTokens) tf.set(t, (tf.get(t) || 0) + 1);
    const dl = contentTokens.length || 1;
    return { meta: m, title: d.title, content: d.content, titleTokens, tf, dl };
  });
  const avgdl = docs.reduce((a, d) => a + d.dl, 0) / (docs.length || 1);

  const queryTokens = Array.from(new Set(tokenize(q)));
  const df = new Map<string, number>();
  for (const term of queryTokens) {
    let count = 0;
    for (const d of docs) if (d.tf.has(term)) count++;
    df.set(term, count);
  }
  const N = docs.length || 1;
  const idf = (term: string) => {
    const n = df.get(term) || 0;
    return Math.log(1 + (N - n + 0.5) / (n + 0.5));
  };
  const k = 1.2;
  const b = 0.75;

  const results = docs
    .map((d) => {
      // BM25 over content
      let score = 0;
      for (const term of queryTokens) {
        const f = d.tf.get(term) || 0;
        if (f === 0) continue;
        const w = idf(term);
        score += w * ((f * (k + 1)) / (f + k * (1 - b + (b * d.dl) / avgdl)));
      }
      // Title boost
      const titleBoost = d.titleTokens.reduce((acc, t) => acc + (queryTokens.includes(t) ? 1 : 0), 0);
      score += titleBoost * 0.25;

      const { excerpt, excerptHtml } = buildMultiExcerpts(d.content, q, 3);
      if (!excerpt) return null;
      return {
        slug: d.meta.slug,
        title: d.title,
        type: d.meta.type,
        episode: d.meta.episode,
        href: d.meta.type === "roteiro" ? `/roteiros/${d.meta.slug}` : `/docs/${d.meta.slug}`,
        excerpt: excerpt.replace(/\s+/g, " ").trim(),
        excerptHtml,
        score,
      };
    })
    .filter(Boolean) as any[];

  results.sort((a, b) => b.score - a.score);
  return NextResponse.json({ results: results.slice(0, 20) });
}
