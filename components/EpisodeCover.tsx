"use client";

import { useMemo } from "react";

export default function EpisodeCover({ id, title }: { id?: number; title: string }) {
  const seed = useMemo(() => (id ?? Array.from(title).reduce((a, c) => a + c.charCodeAt(0), 0)) % 360, [id, title]);
  const hueA = seed;
  const hueB = (seed + 60) % 360;
  const hueC = (seed + 180) % 360;
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
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
        </defs>
        <rect width="800" height="450" fill="url(#g1)" />
        <circle cx="650" cy="80" r="140" fill="url(#g2)" />
        <circle cx="80" cy="380" r="180" fill="url(#g2)" />
        <g fill="white" fillOpacity="0.12">
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={80 + i * 70} cy={80 + (i % 2) * 40} r={8 + (i % 4) * 4} />
          ))}
        </g>
        <foreignObject x="24" y="24" width="752" height="402">
          <div className="h-full w-full p-3">
            <div className="text-white/90 text-xs uppercase tracking-wider">Roteiro {id ?? ""}</div>
            <div className="text-white font-extrabold leading-tight" style={{ fontSize: 28 }}>
              {title}
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
