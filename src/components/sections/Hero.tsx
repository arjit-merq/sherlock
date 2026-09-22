"use client";

import { useMemo } from "react";
import { motion, useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { FileText, MessageSquare, Ticket, Database, Code2, BookOpen } from "lucide-react";
import { SherlockLogo } from "@/components/shared/Logo";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useAppState } from "@/components/system/AppProviders";

const SIGNALS = [
  { icon: Ticket, angle: -140, dist: 260 },
  { icon: MessageSquare, angle: -70, dist: 300 },
  { icon: FileText, angle: -20, dist: 260 },
  { icon: Database, angle: 40, dist: 290 },
  { icon: Code2, angle: 110, dist: 260 },
  { icon: BookOpen, angle: 165, dist: 300 },
];

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function Hero() {
  const { containerRef, progress } = useScrollProgress<HTMLDivElement>({
    pin: true,
    start: "top top",
    end: "+=115%",
    scrub: 0.5,
  });
  const { reducedMotion } = useAppState();
  const prefersReduced = useFramerReducedMotion() || reducedMotion;

  // phase 0-0.45: signals converge + scan line; 0.4-0.65: logo resolves + title;
  // 0.65-0.9: hold steady on the resolved logo so it reads clearly;
  // 0.9-1: whole scene shrinks/fades to hand off to the next section
  const convergence = clamp01(progress / 0.45);
  const resolve = clamp01((progress - 0.4) / 0.25);
  const handoff = clamp01((progress - 0.9) / 0.1);

  const scanY = `${clamp01(progress / 0.4) * 100}%`;

  const positions = useMemo(
    () =>
      SIGNALS.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        return { x: Math.cos(rad) * s.dist, y: Math.sin(rad) * s.dist };
      }),
    [],
  );

  return (
    <div ref={containerRef} className="relative snap-block h-[215vh]">
      <SectionContainer id="hero" bare className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        {!prefersReduced && (
          <div
            className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green to-transparent opacity-70"
            style={{ top: scanY, boxShadow: "0 0 24px 2px var(--green)" }}
            aria-hidden
          />
        )}

        <div
          className="relative flex flex-col items-center justify-center"
          style={{
            opacity: 1 - handoff * 0.9,
            transform: `scale(${1 - handoff * 0.55}) translateY(${handoff * -120}px)`,
          }}
        >
          {/* signal fragments */}
          {!prefersReduced &&
            SIGNALS.map((s, i) => {
              const Icon = s.icon;
              const p = positions[i];
              const travel = 1 - convergence;
              return (
                <div
                  key={i}
                  className="absolute flex h-10 w-10 items-center justify-center rounded-lg glass-panel"
                  style={{
                    transform: `translate(${p.x * travel}px, ${p.y * travel}px)`,
                    opacity: 0.15 + convergence * 0.5 * (1 - resolve),
                  }}
                  aria-hidden
                >
                  <Icon size={16} className="text-cyan" />
                </div>
              );
            })}

          {/* Sherlock logo resolving */}
          <div
            className="relative z-10 flex flex-col items-center gap-6"
            style={{
              filter: `blur(${(1 - resolve) * 6}px)`,
            }}
          >
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                boxShadow: `0 0 ${40 + resolve * 40}px ${resolve * 10}px rgba(15,157,88,${0.15 + resolve * 0.2})`,
              }}
            >
              <SherlockLogo size={104} />
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: resolve, y: (1 - resolve) * 12 }}
              className="text-center"
            >
              <h1 className="section-heading text-4xl font-semibold tracking-tight text-text-primary md:text-5xl">
                Sherlock
              </h1>
              <p className="mt-2 text-base text-text-secondary md:text-lg">
                Agentic AI for PES Support
              </p>
              <p className="mono-label mt-4 text-[14px] text-green/80 md:text-sm">
                From scattered information to one clear conclusion
              </p>
            </motion.div>
          </div>
        </div>

        <div
          className="absolute bottom-10 flex flex-col items-center gap-2 text-text-tertiary"
          style={{ opacity: clamp01(resolve) * (1 - handoff) }}
        >
          <span className="mono-label text-[14px]">Scroll to investigate</span>
          <span className="h-8 w-px animate-pulse bg-text-tertiary/60" />
        </div>
      </SectionContainer>
    </div>
  );
}
