import { Suspense } from "react";
import BuscaClient from "./ClientPage";

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Carregando…</div>}>
      <BuscaClient />
    </Suspense>
  );
}

