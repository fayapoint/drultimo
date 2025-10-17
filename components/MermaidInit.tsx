"use client";

import { useEffect } from "react";

export default function MermaidInit() {
  useEffect(() => {
    let active = true;
    async function render() {
      const mermaid = (await import("mermaid")).default;
      const isDark = document.documentElement.classList.contains("dark");
      mermaid.initialize({ startOnLoad: false, theme: isDark ? "dark" : "default", securityLevel: "loose" });
      const nodes = Array.from(document.querySelectorAll(".mermaid"));
      for (const n of nodes) {
        try {
          if (!active) return;
          await mermaid.run({ nodes: [n as unknown as HTMLElement] });
        } catch {}
      }
    }
    render();
    const onThemeChange = () => render();
    window.addEventListener("themechange", onThemeChange);
    window.addEventListener("storage", onThemeChange);
    return () => {
      active = false;
      window.removeEventListener("themechange", onThemeChange);
      window.removeEventListener("storage", onThemeChange);
    };
  }, []);
  return null;
}
