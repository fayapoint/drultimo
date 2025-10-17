import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "contatos.json");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }
    if (typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Mensagem muito curta." }, { status: 400 });
    }
    await ensureDataDir();
    let list: Array<{ name: string; email: string; message: string; ts: string }>;
    try {
      const buf = await fs.readFile(filePath, "utf8");
      list = JSON.parse(buf);
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
    list.push({ name, email, message, ts: new Date().toISOString() });
    await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf8");
    return NextResponse.json({ message: "Mensagem enviada com sucesso." });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao enviar mensagem." }, { status: 500 });
  }
}
