import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Busca | Dr. Ultimo & Convidados",
  description: "Pesquise em documentos e roteiros do podcast Dr. Ultimo & Convidados.",
  openGraph: {
    title: "Busca | Dr. Ultimo & Convidados",
    description: "Pesquise em documentos e roteiros do podcast Dr. Ultimo & Convidados.",
  },
};

export default function BuscaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
