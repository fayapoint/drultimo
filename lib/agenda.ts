import fs from "fs";
import path from "path";
import { getAllRoteiros } from "@/lib/content";

export type AgendaItem = {
  episode?: number;
  title: string;
  slug: string;
  date: string; // ISO
};

const DATA_PATH = path.join(process.cwd(), "data", "agenda.json");

function readJsonSafe<T>(p: string): T | null {
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeHeaders(hs: string[]) {
  return hs.map((h) => h.trim().toLowerCase());
}

function idx(headers: string[], names: string[]) {
  for (const n of names) {
    const i = headers.indexOf(n);
    if (i !== -1) return i;
  }
  return -1;
}

function parseItems(rows: string[][]): AgendaItem[] {
  if (!rows.length) return [];
  const headers = normalizeHeaders(rows[0]);
  const iEpisode = idx(headers, ["episode", "episodio", "ep"]);
  const iTitle = idx(headers, ["title", "titulo"]);
  const iSlug = idx(headers, ["slug"]);
  const iDate = idx(headers, ["date", "data"]);
  const out: AgendaItem[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const episodeRaw = iEpisode >= 0 ? row[iEpisode] || "" : "";
    const episode = episodeRaw ? Number(String(episodeRaw).trim()) : undefined;
    const title = iTitle >= 0 ? String(row[iTitle] || "").trim() : "";
    const slug = iSlug >= 0 ? String(row[iSlug] || "").trim() : "";
    const date = iDate >= 0 ? String(row[iDate] || "").trim() : "";
    if (!title && !slug && !episode && !date) continue;
    const ep = typeof episode === "number" && Number.isFinite(episode) ? episode : undefined;
    out.push({ episode: ep, title, slug, date });
  }
  return out;
}

async function fetchCsv(url: string): Promise<AgendaItem[] | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (!lines.length) return [];
    const headerLine = lines[0];
    const delim = headerLine.includes(";") && !headerLine.includes(",") ? ";" : ",";
    const rows = lines.map((ln) => ln.split(delim));
    return parseItems(rows);
  } catch {
    return null;
  }
}

async function fetchSheets(spreadsheetId: string, range: string, apiKey: string): Promise<AgendaItem[] | null> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const rows = (json && json.values) as string[][] | undefined;
    if (!rows || !rows.length) return [];
    return parseItems(rows);
  } catch {
    return null;
  }
}

function coerceWithRoteiros(items: AgendaItem[], roteiros: ReturnType<typeof getAllRoteiros>): AgendaItem[] {
  return items
    .map((it) => {
      if (!it.slug) {
        const found = roteiros.find((r) => r.episode && it.episode && r.episode === it.episode);
        if (found) return { ...it, slug: found.slug, title: it.title || found.title };
      }
      return it;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getAgenda(): Promise<AgendaItem[]> {
  const roteiros = getAllRoteiros();
  const sheetsId = process.env.SHEETS_ID;
  const sheetsRange = process.env.SHEETS_RANGE || "Agenda!A:D";
  const sheetsKey = process.env.SHEETS_API_KEY;
  if (sheetsId && sheetsKey) {
    const items = await fetchSheets(sheetsId, sheetsRange, sheetsKey);
    if (items && items.length) return coerceWithRoteiros(items, roteiros);
  }
  const csvUrl = process.env.AGENDA_CSV_URL;
  if (csvUrl) {
    const items = await fetchCsv(csvUrl);
    if (items && items.length) return coerceWithRoteiros(items, roteiros);
  }
  const file = readJsonSafe<AgendaItem[]>(DATA_PATH);
  if (file && Array.isArray(file) && file.length) {
    return coerceWithRoteiros(file, roteiros);
  }
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const daysToSunday = (7 - day) % 7;
  const first = new Date(now);
  first.setDate(now.getDate() + daysToSunday);
  first.setHours(20, 0, 0, 0); // 20:00 local time
  const items: AgendaItem[] = [];
  roteiros.forEach((r, i) => {
    const d = new Date(first);
    d.setDate(first.getDate() + i * 7);
    items.push({ episode: r.episode, title: r.title, slug: r.slug, date: d.toISOString() });
  });
  return items.slice(0, 20);
}
