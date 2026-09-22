"use client";

import { useMemo } from "react";
import { UserRound } from "lucide-react";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { EvidenceConnection } from "@/components/shared/EvidenceConnection";
import { CHALLENGES } from "@/lib/data";
import { useScrollProgress } from "@/lib/useScrollProgress";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

const RADIUS = 38; // % of container
const STAGGER_START = 0.05;
const STAGGER_END = 0.62;
const FREEZE_START = 0.68;
const STATEMENT_START = 0.82;

export function Challenges() {
  const { containerRef, progress } = useScrollProgress<HTMLDivElement>({
    pin: true,
    start: "top top",
    end: "+=180%",
    scrub: 0.5,
  });

  // Cards sit at the full radius; lines stop just short of that (LINE_END_FACTOR)
  // so the line's tip lands right at the card's near edge, not its middle.
  const LINE_END_FACTOR = 0.86;
  const positions = useMemo(
    () =>
      CHALLENGES.map((_, i) => {
        const angle = (i / CHALLENGES.length) * 2 * Math.PI - Math.PI / 2;
        return {
          x: 50 + Math.cos(angle) * RADIUS,
          y: 50 + Math.sin(angle) * RADIUS * 0.72, // flatten for widescreen
        };
      }),
    [],
  );
  const lineEnds = useMemo(
    () =>
      positions.map((p) => ({
        x: 50 + (p.x - 50) * LINE_END_FACTOR,
        y: 50 + (p.y - 50) * LINE_END_FACTOR,
      })),
    [positions],
  );

  // Intro beats play out first: heading, then the PE Support hub, then the
  // existing card-reveal timeline plays inside whatever progress remains.
  const headingReveal = clamp01(progress / 0.1);
  const hubReveal = clamp01((progress - 0.14) / 0.12);
  const contentProgress = clamp01((progress - 0.26) / (1 - 0.26));

  const cardReveal = (i: number) => {
    const span = STAGGER_END - STAGGER_START;
    const start = STAGGER_START + (i / CHALLENGES.length) * span;
    const end = start + span / CHALLENGES.length + 0.06;
    return clamp01((contentProgress - start) / (end - start));
  };

  const pressure = clamp01((contentProgress - FREEZE_START) / (STATEMENT_START - FREEZE_START - 0.02));
  const overallActivity = clamp01(contentProgress / STAGGER_END);

  return (
    <div ref={containerRef} className="relative snap-block h-[280vh]">
      <SectionContainer id="challenge" bare className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 py-10 md:px-14">
        <div className="radial-glow absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2" aria-hidden />

        <div
          className="relative z-10 mb-4 max-w-xl transition-all duration-500"
          style={{ opacity: headingReveal, transform: `translateY(${(1 - headingReveal) * 12}px)` }}
        >
          <h2 className="section-title text-text-primary">
            Challenges for PE Support
          </h2>
        </div>

        <div className="relative mx-auto h-full w-full max-w-5xl flex-1">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {lineEnds.map((p, i) => (
              <EvidenceConnection
                key={i}
                d={`M 50 50 L ${p.x} ${p.y}`}
                progress={cardReveal(i)}
                dimmed={cardReveal(i) < 0.05}
              />
            ))}
            {/* small cap dot where each line meets its pill */}
            {lineEnds.map((p, i) => (
              <circle
                key={`cap-${i}`}
                cx={p.x}
                cy={p.y}
                r={0.8}
                fill="var(--green)"
                opacity={cardReveal(i)}
              />
            ))}
            {/* duplicated particles representing repeated work, visible as activity increases */}
            {overallActivity > 0.4 &&
              lineEnds.map((p, i) => (
                <circle
                  key={`p-${i}`}
                  r={0.6}
                  fill="var(--cyan)"
                  opacity={0.5 * cardReveal(i)}
                >
                  <animateMotion
                    dur="2.4s"
                    repeatCount="indefinite"
                    path={`M ${p.x} ${p.y} L 50 50`}
                  />
                </circle>
              ))}
          </svg>

          {/* center node: appears after the heading has settled in. Positioning
              (translate -50%/-50%) lives on the outer wrapper only — the reveal
              scale is applied on an inner wrapper so it scales around the
              already-centered point instead of composing with the centering
              translate and drifting off-center. */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div
              className="flex flex-col items-center gap-2 transition-all duration-500"
              style={{ opacity: hubReveal, transform: `scale(${0.7 + hubReveal * 0.3})` }}
            >
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-full glass-panel md:h-24 md:w-24"
              style={{
                boxShadow: `0 0 0 1px var(--green-dim), 0 0 ${20 + pressure * 50}px ${pressure * 8}px rgba(15,157,88,${0.25 + pressure * 0.3})`,
              }}
            >
              <span
                className="absolute inset-0 rounded-full border border-green/40"
                style={{
                  transform: `scale(${1 + pressure * 0.5})`,
                  opacity: pressure > 0 ? 0.6 - pressure * 0.5 : 0,
                  transition: "transform 0.2s linear, opacity 0.2s linear",
                }}
                aria-hidden
              />
              <UserRound size={32} className="text-green" strokeWidth={1.75} />
            </div>
            </div>
          </div>

          {/* challenge cards */}
          {CHALLENGES.map((c, i) => {
            const r = cardReveal(i);
            const p = positions[i];
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="absolute w-36 -translate-x-1/2 -translate-y-1/2 md:w-44"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <div
                  className="glass-panel flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-center transition-transform duration-300"
                  style={{ opacity: r, transform: `scale(${0.85 + r * 0.15})` }}
                >
                  <Icon size={18} className="text-cyan" strokeWidth={1.75} />
                  <span className="text-sm font-medium text-text-primary md:text-base">{c.title}</span>
                  <span className="mono-label text-[12px] text-text-tertiary md:text-[13px]">{c.sublabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </SectionContainer>
    </div>
  );
}
