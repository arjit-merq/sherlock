"use client";

import { useMemo, useState } from "react";
import { SherlockLogo } from "@/components/shared/Logo";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { EvidenceConnection } from "@/components/shared/EvidenceConnection";
import { CAPABILITIES, ARCH_GROUPS, ARCH_STAGE_COPY, type ArchGroupId } from "@/lib/data";
import { useScrollProgress } from "@/lib/useScrollProgress";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

const ACCENT_VAR: Record<string, string> = {
  cyan: "var(--cyan)",
  green: "var(--green)",
  amber: "var(--amber)",
  red: "var(--red)",
};

// The four quadrants tile the full circle around Sherlock, each group's own
// pills fanning out within its slice — so evidence lines go in every
// direction (top-right, bottom-right, bottom-left, top-left), not just one
// corner.
const QUADRANT: Record<string, { centerDeg: number; isTop: boolean; isLeft: boolean }> = {
  "upper-left": { centerDeg: 225, isTop: true, isLeft: true },
  "upper-right": { centerDeg: 315, isTop: true, isLeft: false },
  "lower-right": { centerDeg: 45, isTop: false, isLeft: false },
  "lower-left": { centerDeg: 135, isTop: false, isLeft: true },
};

const PILL_RADIUS = 37;
const RADIUS_STAGGER = 9; // alternate near/far radius so neighboring pills never touch
const FLATTEN = 0.6; // compensate the wide, non-square canvas
const SPREAD_DEG = 64;
const LABEL_MARGIN = 8; // % clearance kept between a label and its pill cluster

// Small manual vertical nudges (% of canvas) to clear up a few pills that
// otherwise sit too close to a neighbor once real label widths are in play.
const NODE_Y_NUDGE: Record<string, number> = {
  localrepo: -8, // between the OpenLens and Grafana lines
  cloudwatch: 0,
  openlens: 2,
  notion: -3,
  airflow: 1,
  dataapi: -1.5,
  leankg: 5, // below Grafana's line, above CloudWatch's
};

// CloudWatch and Local repositories sit right at the boundary between the
// lower-right and lower-left quadrants, closest to Sherlock of anything in
// either cluster — push CloudWatch further out instead of nudging it
// vertically, so the bottom of the diagram has more room and it doesn't
// need to crowd (or cross paths with) its neighbor.
const NODE_RADIUS_NUDGE: Record<string, number> = {
  cloudwatch: 16,
  localrepo: 12, // stretch its line out a bit further from Sherlock
};

function polar(centerDeg: number, radius: number) {
  const rad = (centerDeg * Math.PI) / 180;
  return { x: 50 + Math.cos(rad) * radius, y: 50 + Math.sin(rad) * radius * FLATTEN };
}

// Capabilities finish accumulating before any evidence group appears.
const CAP_START = 0.06;
const CAP_STEP = 0.045;
const CAP_DURATION = 0.05;
const GROUP_PHASE_START = 0.4;
const GROUP_SPAN = 0.12;
const GROUP_PHASE_END = GROUP_PHASE_START + ARCH_GROUPS.length * GROUP_SPAN; // 0.88
const CLOSING_START = 0.92;

export function Connect() {
  const { containerRef, progress } = useScrollProgress<HTMLDivElement>({
    pin: true,
    start: "top top",
    end: "+=290%",
    scrub: 0.5,
  });
  const [selected, setSelected] = useState<ArchGroupId | null>(null);

  const headingReveal = clamp01(progress / 0.05);
  const capReveal = (i: number) => clamp01((progress - (CAP_START + i * CAP_STEP)) / CAP_DURATION);

  const groupReveal = (idx: number) => {
    const start = GROUP_PHASE_START + idx * GROUP_SPAN;
    return clamp01((progress - start) / GROUP_SPAN);
  };
  const closing = clamp01((progress - CLOSING_START) / (1 - CLOSING_START));

  let stageIdx = 0;
  if (progress >= GROUP_PHASE_END) stageIdx = 5;
  else if (progress >= GROUP_PHASE_START) stageIdx = 1 + Math.min(3, Math.floor((progress - GROUP_PHASE_START) / GROUP_SPAN));
  const caption = ARCH_STAGE_COPY[stageIdx];

  const scanRingScale = 1 + Math.sin(progress * Math.PI * 6) * 0.03;

  // Each group's nodes fan out as individual round pills around that
  // quadrant's center angle. Radius alternates near/far so neighboring pills
  // never crowd each other.
  const nodePositions = useMemo(() => {
    const map: Record<string, { x: number; y: number }[]> = {};
    ARCH_GROUPS.forEach((g) => {
      const { centerDeg } = QUADRANT[g.position];
      const n = g.nodes.length;
      map[g.id] = g.nodes.map((node, i) => {
        const deg = centerDeg + (i - (n - 1) / 2) * (SPREAD_DEG / Math.max(1, n - 1 || 1));
        const radius = PILL_RADIUS + (i % 2 === 0 ? 0 : RADIUS_STAGGER) + (NODE_RADIUS_NUDGE[node.id] ?? 0);
        const pos = polar(deg, radius);
        return { x: pos.x, y: pos.y + (NODE_Y_NUDGE[node.id] ?? 0) };
      });
    });
    return map;
  }, []);

  // Label sits outside the cluster's own bounding box (above/below it,
  // centered on its horizontal span) so it can never land on top of a pill,
  // regardless of how the pills inside that cluster are arranged. The two
  // top labels share one Y (clearing whichever cluster reaches furthest up),
  // the two bottom labels share another, and likewise the two left labels
  // share one X and the two right labels share another — so each row and
  // column starts from the same position instead of drifting with whatever
  // that quadrant's own pills happen to need.
  const labelPositions = useMemo(() => {
    const perGroupY: Record<string, number> = {};
    const perGroupX: Record<string, number> = {};
    ARCH_GROUPS.forEach((g) => {
      const { isTop, isLeft } = QUADRANT[g.position];
      const positions = nodePositions[g.id];
      perGroupY[g.id] = isTop ? Math.min(...positions.map((p) => p.y)) : Math.max(...positions.map((p) => p.y));
      perGroupX[g.id] = isLeft ? Math.min(...positions.map((p) => p.x)) : Math.max(...positions.map((p) => p.x));
    });
    const topGroups = ARCH_GROUPS.filter((g) => QUADRANT[g.position].isTop);
    const bottomGroups = ARCH_GROUPS.filter((g) => !QUADRANT[g.position].isTop);
    const leftGroups = ARCH_GROUPS.filter((g) => QUADRANT[g.position].isLeft);
    const rightGroups = ARCH_GROUPS.filter((g) => !QUADRANT[g.position].isLeft);
    const topY = Math.min(...topGroups.map((g) => perGroupY[g.id])) - LABEL_MARGIN;
    const bottomY = Math.max(...bottomGroups.map((g) => perGroupY[g.id])) + LABEL_MARGIN;
    const leftX = Math.min(...leftGroups.map((g) => perGroupX[g.id]));
    const rightX = Math.max(...rightGroups.map((g) => perGroupX[g.id]));

    const map: Record<string, { x: number; y: number }> = {};
    ARCH_GROUPS.forEach((g) => {
      const { isTop, isLeft } = QUADRANT[g.position];
      map[g.id] = { x: isLeft ? leftX : rightX, y: isTop ? topY : bottomY };
    });
    return map;
  }, [nodePositions]);

  return (
    <div ref={containerRef} className="relative snap-block h-[390vh]">
      <SectionContainer id="connect" bare className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 py-10 md:px-14">
        <h2
          className="section-title mb-4 text-text-primary transition-all duration-500"
          style={{ opacity: headingReveal, transform: `translateY(${(1 - headingReveal) * 10}px)` }}
        >
          Sherlock: An Agentic AI for PES Support
        </h2>

        <div className="relative flex flex-1 flex-col gap-4 md:flex-row">
          {/* Left column: capabilities accumulate into a growing list, first */}
          <div className="flex w-full flex-col justify-center gap-3 md:w-[32%]">
            <div className="mb-2 flex items-center gap-4">
              <SherlockLogo size={36} />
              <div className="h-8 w-px bg-gradient-to-b from-green to-transparent" aria-hidden />
            </div>
            {CAPABILITIES.map((cap, i) => {
              const r = capReveal(i);
              return (
                <p
                  key={cap.id}
                  className="section-heading flex items-start gap-2.5 text-base font-medium text-text-primary transition-all duration-500 md:text-xl"
                  style={{ opacity: r, transform: `translateY(${(1 - r) * 10}px)` }}
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green md:mt-2.5" aria-hidden />
                  {cap.label}
                </p>
              );
            })}
          </div>

          {/* Right column: Sherlock at the center, evidence pills radiating
              into all four quadrants once the capabilities are done */}
          <div className="relative flex-1 overflow-visible">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              {ARCH_GROUPS.map((g, idx) => {
                const p = groupReveal(idx);
                if (p <= 0) return null;
                const dim = selected !== null && selected !== g.id;
                const color = ACCENT_VAR[g.accent];
                return nodePositions[g.id].map((pos, ni) => (
                  <EvidenceConnection
                    key={`${g.id}-${ni}`}
                    d={`M 50 50 L 50 ${pos.y} L ${pos.x} ${pos.y}`}
                    progress={p}
                    color={color}
                    verified={p > 0.75}
                    dimmed={dim}
                  />
                ));
              })}
            </svg>

            {/* Sherlock hub */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <button onClick={() => setSelected(null)} className="group flex flex-col items-center gap-2" aria-label="Show all evidence groups">
                <div
                  className="glass-panel glow-green relative flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24"
                  style={{ transform: `scale(${scanRingScale})` }}
                >
                  <span className="absolute inset-0 animate-spin rounded-full border border-dashed border-green/40" style={{ animationDuration: "18s" }} aria-hidden />
                  <SherlockLogo size={40} />
                </div>
              </button>
            </div>

            {/* Quadrant purpose labels — anchored by their outer edge (not
                centered) so the two left labels start from the same X and
                the two right labels start from the same X, lined up like a
                column instead of drifting with each cluster's own center. */}
            {ARCH_GROUPS.map((g, idx) => {
              const p = groupReveal(idx);
              const lp = labelPositions[g.id];
              const { isLeft } = QUADRANT[g.position];
              const dim = selected !== null && selected !== g.id;
              return (
                <div
                  key={`label-${g.id}`}
                  className="absolute z-10 -translate-y-1/2 whitespace-nowrap"
                  style={{
                    left: `${lp.x}%`,
                    top: `${lp.y}%`,
                    opacity: dim ? 0.3 : p,
                    transform: `translateY(-50%) ${isLeft ? "translateX(0)" : "translateX(-100%)"}`,
                    textAlign: isLeft ? "left" : "right",
                  }}
                >
                  <button onClick={() => setSelected(selected === g.id ? null : g.id)}>
                    <p className="text-lg font-bold md:text-xl" style={{ color: ACCENT_VAR[g.accent] }}>
                      {g.title}
                    </p>
                  </button>
                </div>
              );
            })}

            {/* Individual evidence pills, each sitting at the tip of its own line */}
            {ARCH_GROUPS.map((g, idx) => {
              const p = groupReveal(idx);
              const dim = selected !== null && selected !== g.id;
              const color = ACCENT_VAR[g.accent];
              return g.nodes.map((n, ni) => {
                const pos = nodePositions[g.id][ni];
                const Icon = n.icon;
                return (
                  // Positioning (translate -50%/-50%) lives on this outer anchor
                  // only; the reveal scale is on the inner span, so scaling
                  // never composes with — and drifts off — the centering.
                  <div key={`${g.id}-${n.id}`} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                    <button onClick={() => setSelected(selected === g.id ? null : g.id)}>
                      <span
                        className="glass-panel flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 transition-transform duration-300"
                        style={{ borderColor: `${color}55`, opacity: dim ? 0.3 : p, transform: `scale(${0.85 + p * 0.15})` }}
                      >
                        <Icon size={13} color={color} strokeWidth={1.75} />
                        <span className="text-sm font-medium text-text-primary md:text-base">{n.label}</span>
                      </span>
                    </button>
                  </div>
                );
              });
            })}
          </div>
        </div>

        <p className="section-heading mt-3 text-center text-base text-text-secondary md:text-xl">
          {closing > 0.4
            ? "Sherlock connects case history, application behavior, platform state, and engineering context into one reviewable investigation."
            : caption}
        </p>
      </SectionContainer>
    </div>
  );
}
