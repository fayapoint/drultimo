"use client";

import { useMemo } from "react";

export default function EpisodeCover({ id, title }: { id?: number; title: string }) {
  const seed = useMemo(() => (id ?? Array.from(title).reduce((a, c) => a + c.charCodeAt(0), 0)) % 360, [id, title]);
  const hueA = seed;
  const hueB = (seed + 60) % 360;
  const hueC = (seed + 180) % 360;
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" className="h-full w-full">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${hueA} 80% 60%)`} stopOpacity="0.8" />
            <stop offset="100%" stopColor={`hsl(${hueB} 80% 55%)`} stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="g2" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0%" stopColor={`hsl(${hueC} 80% 60%)`} stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <pattern id="pDots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" opacity="0.08" />
          </pattern>
          <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <rect width="800" height="450" fill="url(#g1)" />
        <circle cx="650" cy="80" r="140" fill="url(#g2)" />
        <circle cx="80" cy="380" r="180" fill="url(#g2)" />
        <g fill="white" fillOpacity="0.12">
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={80 + i * 70} cy={80 + (i % 2) * 40} r={8 + (i % 4) * 4} />
          ))}
        </g>
        <rect width="800" height="450" fill="url(#pDots)" />
        <rect x="-100" y="0" width="300" height="450" fill="url(#shine)" transform="rotate(15 0 0)" />
        <foreignObject x="24" y="24" width="752" height="402">
          <div className="h-full w-full p-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-white text-[11px] uppercase tracking-wider backdrop-blur">
              <span>Roteiro {id ?? ""}</span>
            </div>
            <div className="mt-2 text-white font-extrabold leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" style={{ fontSize: 28 }}>
              {title}
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
