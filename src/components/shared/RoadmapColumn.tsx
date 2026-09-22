"use client";

import { GlassPanel } from "./GlassPanel";
import type { RoadmapPhase } from "@/lib/data";

interface RoadmapColumnProps {
  phase: RoadmapPhase;
  active: boolean;
  reveal: number; // 0..1
  visual: React.ReactNode;
}

export function RoadmapColumn({ phase, active, reveal, visual }: RoadmapColumnProps) {
  return (
    <GlassPanel
      accent={active ? "green" : "none"}
      className="group flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-6"
      style={{ opacity: 0.4 + reveal * 0.6, transform: `translateY(${(1 - reveal) * 14}px)` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-semibold transition-transform duration-300 group-hover:scale-110"
          style={{ background: active ? "var(--green)" : "var(--panel)", color: active ? "#04140c" : "var(--text-tertiary)", border: "1px solid var(--line)" }}
        >
          {phase.phase}
        </span>
        <h3 className="section-heading text-lg font-semibold text-text-primary md:text-xl">{phase.title}</h3>
      </div>

      <div className="mb-4 h-44 overflow-hidden rounded-lg border border-line transition-transform duration-500 group-hover:scale-[1.03]">
        {visual}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {phase.points.map((p, i) => (
          <span
            key={p}
            className="rounded-full border px-2.5 py-1 text-center text-[14px] font-medium transition-all duration-300 md:text-sm"
            style={{
              opacity: reveal > (i + 1) / (phase.points.length + 1) ? 1 : 0.25,
              borderColor: active ? "var(--green-dim)" : "var(--line)",
              color: active ? "var(--green)" : "var(--text-secondary)",
              background: active ? "rgba(15,157,88,0.08)" : "transparent",
            }}
          >
            {p}
          </span>
        ))}
      </div>
    </GlassPanel>
  );
}
