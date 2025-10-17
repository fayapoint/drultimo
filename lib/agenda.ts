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

export function getAgenda(): AgendaItem[] {
  const roteiros = getAllRoteiros();
  const file = readJsonSafe<AgendaItem[]>(DATA_PATH);
  if (file && Array.isArray(file) && file.length) {
    // Ensure items reference known slugs; if not, keep anyway
    return file
      .map((it) => {
        if (!it.slug) {
          // try find by episode
          const found = roteiros.find((r) => r.episode && r.episode === it.episode);
          if (found) return { ...it, slug: found.slug, title: found.title };
        }
        return it;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Fallback: auto-generate weekly schedule from next Sunday
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
