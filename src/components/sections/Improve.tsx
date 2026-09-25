"use client";

import { ArrowLeftRight, CheckCircle2, XCircle, Sparkles, BookOpen } from "lucide-react";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { GlassPanel } from "@/components/shared/GlassPanel";
import {
  IMPROVE_HEADING,
  PLAYBOOK_INTRO,
  PLAYBOOK_POINTS,
  PLAYBOOK_EXAMPLE,
  DISTILL_INTRO,
  DISTILL_POINTS,
  DISTILL_EXAMPLE,
} from "@/lib/data";
import { useScrollProgress } from "@/lib/useScrollProgress";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function Improve() {
  const { containerRef, progress } = useScrollProgress<HTMLDivElement>({
    pin: true,
    start: "top top",
    end: "+=220%",
    scrub: 0.5,
  });

  // Nothing is on screen at progress 0 — the heading and both cards only
  // start appearing once the user actually scrolls into the section.
  const intro = clamp01((progress - 0.03) / 0.12);

  // Distill appears first as an empty pill, then its text fills in.
  const distillCardReveal = clamp01((progress - 0.1) / 0.1);
  const distillPoint = (i: number) => clamp01((progress - (0.22 + i * 0.045)) / 0.04);
  const distillExampleReveal = clamp01((progress - 0.4) / 0.06);
  const distillAdd = (i: number) => clamp01((progress - (0.46 + i * 0.05)) / 0.04);
  const distillClosingReveal = clamp01((progress - 0.56) / 0.05);

  // Playbook appears second, once Distill has settled in.
  const playbookCardReveal = clamp01((progress - 0.62) / 0.08);
  const playbookPoint = (i: number) => clamp01((progress - (0.67 + i * 0.04)) / 0.04);
  const pathStep = (i: number) => clamp01((progress - (0.87 + i * 0.03)) / 0.03);
  const crossOut = clamp01((progress - 0.97) / 0.03);

  return (
    <div ref={containerRef} className="relative snap-block h-[320vh]">
      <SectionContainer id="improve" bare className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 py-10 md:px-14">
        <div className="mb-4 max-w-full" style={{ opacity: intro }}>
          <h2 className="section-title text-text-primary md:whitespace-nowrap">
            {IMPROVE_HEADING}
          </h2>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden">

          <div className="relative grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-[1fr_auto_1fr] md:gap-8">
            {/* Distill card: appears first, then its text fills in */}
            <GlassPanel
              accent="cyan"
              className="relative flex flex-col overflow-y-auto p-5 transition-transform duration-300 md:p-7"
              style={{ opacity: distillCardReveal, transform: `translateY(${(1 - distillCardReveal) * 14}px) scale(${0.96 + distillCardReveal * 0.04})` }}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(8,145,178,0.16), transparent 70%)" }}
                aria-hidden
              />
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 shadow-sm">
                <Sparkles size={15} className="text-cyan" />
                <p className="mono-label text-sm text-cyan">Distill</p>
              </div>
              <p className="mt-3 text-base text-text-secondary md:text-lg">{DISTILL_INTRO}</p>
              <ul className="mt-3 space-y-1.5">
                {DISTILL_POINTS.map((p, i) => {
                  const r = distillPoint(i);
                  return (
                    <li key={p} className="flex items-start gap-2 text-base text-text-secondary transition-opacity duration-300 md:text-lg" style={{ opacity: 0.25 + r * 0.75 }}>
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan" aria-hidden />
                      {p}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 rounded-xl border border-line bg-white/40 p-4" style={{ opacity: distillExampleReveal }}>
                <p className="text-base text-text-secondary md:text-lg">{DISTILL_EXAMPLE.lead}</p>
                <p className="mono-label mt-3 text-[14px] text-text-tertiary">{DISTILL_EXAMPLE.addsLead}</p>
                <ul className="mt-1.5 space-y-1.5">
                  {DISTILL_EXAMPLE.adds.map((a, i) => {
                    const r = distillAdd(i);
                    return (
                      <li key={a} className="flex items-center gap-2.5 text-base transition-opacity duration-300 md:text-lg" style={{ opacity: 0.25 + r * 0.75 }}>
                        <CheckCircle2 size={16} className={`shrink-0 ${r > 0.5 ? "text-cyan" : "text-text-tertiary"}`} />
                        <span className="text-text-secondary">{a}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-base text-text-secondary md:text-lg" style={{ opacity: distillClosingReveal }}>
                  {DISTILL_EXAMPLE.closing}
                </p>
              </div>
            </GlassPanel>

            {/* loop connector */}
            <div className="flex items-center justify-center py-2 md:py-0" style={{ opacity: clamp01(playbookCardReveal * 2) }}>
              <div className="glass-panel flex h-14 w-14 items-center justify-center rounded-full md:h-16 md:w-16">
                <ArrowLeftRight size={24} className="text-green" style={{ opacity: 0.5 + Math.abs(Math.sin(progress * Math.PI * 2)) * 0.5 }} />
              </div>
            </div>

            {/* Playbook card: appears second, once Distill has settled in */}
            <GlassPanel
              accent="green"
              className="relative flex flex-col overflow-y-auto p-5 transition-transform duration-300 md:p-7"
              style={{ opacity: playbookCardReveal, transform: `translateY(${(1 - playbookCardReveal) * 14}px) scale(${0.96 + playbookCardReveal * 0.04})` }}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(15,157,88,0.16), transparent 70%)" }}
                aria-hidden
              />
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-green/30 bg-green/10 px-3 py-1.5 shadow-sm">
                <BookOpen size={15} className="text-green" />
                <p className="mono-label text-sm text-green">Playbook</p>
              </div>
              <p className="mt-3 text-base text-text-secondary md:text-lg">{PLAYBOOK_INTRO}</p>
              <ul className="mt-3 space-y-1.5">
                {PLAYBOOK_POINTS.map((p, i) => {
                  const r = playbookPoint(i);
                  return (
                    <li key={p} className="flex items-start gap-2 text-base text-text-secondary transition-opacity duration-300 md:text-lg" style={{ opacity: 0.25 + r * 0.75 }}>
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-green" aria-hidden />
                      {p}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 rounded-xl border border-line bg-white/40 p-4">
                <p className="text-base font-semibold text-text-primary md:text-lg">{PLAYBOOK_EXAMPLE.title}</p>
                <p className="mt-1 text-sm text-text-tertiary md:text-base">{PLAYBOOK_EXAMPLE.lead}</p>
                <ol className="mt-3 space-y-2">
                  {PLAYBOOK_EXAMPLE.steps.map((step, i) => {
                    const p = pathStep(i);
                    return (
                      <li key={step} className="flex items-center gap-2.5 text-base transition-opacity duration-300 md:text-lg" style={{ opacity: 0.3 + p * 0.7 }}>
                        <CheckCircle2 size={16} className={`shrink-0 ${p > 0.5 ? "text-green" : "text-text-tertiary"}`} />
                        <span className="text-text-secondary">{step}</span>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-4 flex flex-wrap gap-2">
                  {PLAYBOOK_EXAMPLE.skipped.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-all duration-300 md:text-base"
                      style={{
                        color: crossOut > 0.3 ? "var(--text-tertiary)" : "var(--text-secondary)",
                        textDecoration: crossOut > 0.3 ? "line-through" : "none",
                        opacity: crossOut > 0.3 ? 0.5 : 0.9,
                        background: "rgba(15,23,42,0.04)",
                      }}
                    >
                      <XCircle size={12} />
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-text-tertiary md:text-base" style={{ opacity: crossOut }}>
                  {PLAYBOOK_EXAMPLE.skipNote}
                </p>
              </div>
            </GlassPanel>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
