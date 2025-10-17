"use client";
import { ReactNode, useEffect } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const root = document.documentElement;
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldDark = stored ? stored === "dark" : prefersDark;
      root.classList.toggle("dark", shouldDark);
    } catch {}
  }, []);
  return <>{children}</>;
}
