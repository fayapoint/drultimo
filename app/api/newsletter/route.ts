import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "newsletter.json");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }
    await ensureDataDir();
    let list: Array<{ email: string; ts: string }>; 
    try {
      const buf = await fs.readFile(filePath, "utf8");
      list = JSON.parse(buf);
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
    // Deduplicate by email
    const exists = list.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      list.push({ email, ts: new Date().toISOString() });
      await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf8");
    }
    return NextResponse.json({ message: "Inscrição realizada com sucesso." });
  } catch {
    return NextResponse.json({ error: "Falha ao processar inscrição." }, { status: 500 });
  }
}
