import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Dr. Ultimo & Convidados",
  description: "Envie sua mensagem para a equipe do podcast Dr. Ultimo & Convidados.",
  openGraph: {
    title: "Contato | Dr. Ultimo & Convidados",
    description: "Envie sua mensagem para a equipe do podcast Dr. Ultimo & Convidados.",
  },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
