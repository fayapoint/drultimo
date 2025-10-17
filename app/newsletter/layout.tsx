import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter | Dr. Ultimo & Convidados",
  description: "Assine para receber novidades e agenda do podcast Dr. Ultimo & Convidados.",
  openGraph: {
    title: "Newsletter | Dr. Ultimo & Convidados",
    description: "Assine para receber novidades e agenda do podcast Dr. Ultimo & Convidados.",
  },
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
