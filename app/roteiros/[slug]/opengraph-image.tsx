import { ImageResponse } from "next/og";
import { getBySlug } from "@/lib/content";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function hueSeed(id?: number, title?: string) {
  const base = id ?? Array.from(title || "").reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = base % 360;
  return { A: seed, B: (seed + 60) % 360, C: (seed + 180) % 360 };
}

export default function Image({ params }: { params: { slug: string } }) {
  const doc = getBySlug(params.slug);
  const title = doc?.title || "Roteiro";
  const episode = doc?.episode;
  const { A, B } = hueSeed(episode, title);

  const bg = `linear-gradient(135deg, hsl(${A} 80% 60%), hsl(${B} 80% 55%))`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage: bg,
          color: "#fff",
          padding: "48px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.9 }}>Roteiro {episode ? `• Ep. ${episode}` : ""}</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 24, opacity: 0.9 }}>Dr. Ultimo & Convidados</div>
          <div
            style={{
              width: 140,
              height: 140,
              background: "rgba(255,255,255,0.14)",
              borderRadius: 16,
              transform: "rotate(10deg)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
