"use client";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Database,
  FileText,
  Infinity as InfinityIcon,
  Search,
  Ticket,
} from "lucide-react";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { WORKFLOW_STAGES, DECISION_CLASSES } from "@/lib/data";
import { useScrollProgress } from "@/lib/useScrollProgress";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

const STAGE_COUNT = WORKFLOW_STAGES.length;

const STAGE_ICON: Record<string, typeof Ticket> = {
  intake: Ticket,
  prepare: Database,
  route: Search,
  investigate: BarChart3,
  output: FileText,
  learn: BookOpen,
};

export function Workflow() {
  const { containerRef, progress } = useScrollProgress<HTMLDivElement>({
    pin: true,
    start: "top top",
    end: "+=360%",
    scrub: 0.5,
  });

  // Each stage gets a full [i, i+1) dwell slot, so the final stage also
  // reaches local() === 1 by the time progress hits 1.
  const rawIndex = progress * STAGE_COUNT;
  const activeIndex = Math.min(STAGE_COUNT - 1, Math.floor(rawIndex));

  // How far scroll has carried us through stage i's own dwell slot: 0 before
  // it's this column's turn, 1 once it's fully filled in. It only ever
  // grows — a column never fades or resets once it has been discussed, so
  // the map on the left keeps everything that came before.
  const local = (i: number) => clamp01(rawIndex - i);

  const decisionStageIndex = WORKFLOW_STAGES.findIndex((s) => s.decisionGrid);
  const decisionLocal = decisionStageIndex >= 0 ? local(decisionStageIndex) : 0;
  const litClassIndex = Math.min(
    DECISION_CLASSES.length - 1,
    Math.floor(clamp01((decisionLocal - 0.5) / 0.5) * DECISION_CLASSES.length),
  );

  const learnStage = WORKFLOW_STAGES[STAGE_COUNT - 1];
  const finaleReveal = clamp01((local(STAGE_COUNT - 1) - 0.55) / 0.35);
  const loopReveal = clamp01((local(STAGE_COUNT - 1) - 0.25) / 0.4);

  const routeStageIndex = WORKFLOW_STAGES.findIndex((s) => s.id === "route");
  const columnCenter = (i: number) => `${((i + 0.5) / STAGE_COUNT) * 100}%`;
  const loopFromX = columnCenter(STAGE_COUNT - 1);
  const loopToX = columnCenter(routeStageIndex);

  return (
    <div ref={containerRef} className="relative snap-block h-[460vh]">
      <SectionContainer id="investigate" bare className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 py-10 md:px-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(rgba(15,23,42,0.05) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          aria-hidden
        />
        <div
          className="radial-glow pointer-events-none absolute left-[58%] top-[30%] h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(closest-side, rgba(242,184,75,0.16), transparent 70%)" }}
          aria-hidden
        />

        <div className="relative z-10 mb-4 flex items-start justify-between pr-16 md:pr-20">
          <div>
            <h2 className="section-title text-text-primary">
              Workflow map
            </h2>
            <p className="mono-label mt-2 text-sm text-text-tertiary md:text-base">How Sherlock Runs</p>
            <p className="mt-1 text-sm text-text-secondary md:text-base">
              From a new case to reusable investigation knowledge
            </p>
          </div>
          <span className="mono-label shrink-0 text-[14px] text-text-tertiary md:text-sm">
            {activeIndex + 1} / {STAGE_COUNT}
          </span>
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col">
        <div className="flex flex-1 flex-col justify-center">

        <div className="flex items-start gap-1.5 md:gap-2">
          {WORKFLOW_STAGES.map((s, i) => {
            const l = local(i);
            const slotCount = s.steps.length + (s.branch ? 1 : 0) + (s.decisionGrid ? 1 : 0);
            const slotReveal = (slot: number) => clamp01((l - slot / slotCount) * slotCount * 1.5);
            const headerLit = clamp01(l * 6);
            const Icon = STAGE_ICON[s.id];
            const isInvestigate = s.id === "investigate";

            return (
              <div key={s.id} className="flex min-w-0 flex-1 items-start gap-1.5 md:gap-2">
                <div className="relative mt-4 min-w-0 flex-1">
                  <span
                    className="absolute left-1/2 top-0 z-20 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[14px] font-bold text-white shadow-sm md:h-8 md:w-8 md:text-sm"
                    style={{ background: s.accent, opacity: 0.3 + headerLit * 0.7 }}
                  >
                    {s.index}
                  </span>

                  <div
                    className="glass-panel flex flex-col items-center rounded-2xl border px-3 pb-2 pt-4 text-center transition-colors duration-300 md:px-4"
                    style={{
                      borderColor: l > 0.02 ? `${s.accent}55` : "var(--line)",
                      borderWidth: isInvestigate && l > 0.02 ? 2 : 1,
                      boxShadow: isInvestigate && l > 0.02 ? `0 0 32px -8px ${s.accent}55` : undefined,
                    }}
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full md:h-9 md:w-9"
                      style={{ background: `${s.accent}1a`, opacity: 0.3 + headerLit * 0.7 }}
                    >
                      <Icon size={15} style={{ color: s.accent }} />
                    </div>
                    <p
                      className="mt-1.5 text-[15px] font-semibold leading-tight text-text-primary md:text-base"
                      style={{ opacity: 0.3 + headerLit * 0.7 }}
                    >
                      {s.title}
                    </p>

                    {isInvestigate && s.steps[0].tags && (
                      <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
                        {s.steps[0].tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded border px-2 py-1 text-[12px] font-medium"
                            style={{ borderColor: `${s.accent}55`, color: s.accent, background: `${s.accent}0f`, opacity: 0.3 + headerLit * 0.7 }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-1.5 flex w-full flex-col divide-y divide-dotted divide-line gap-2 text-left">
                      {s.steps.map((step, si) => {
                        const r = slotReveal(si);
                        if (r <= 0.02) return null;
                        return (
                          <div key={step.title} className="flex items-start gap-2 pt-2 first:pt-0" style={{ opacity: 0.25 + r * 0.75 }}>
                            <span
                              className="mt-1 h-[6px] w-[6px] shrink-0 rounded-full"
                              style={{ background: r > 0.5 ? s.accent : "var(--line)" }}
                            />
                            <div className="min-w-0">
                              <p className={`text-[14px] font-semibold leading-tight text-text-primary ${step.mono ? "font-mono" : ""}`}>
                                {step.title}
                              </p>
                              <p className="mt-0.5 text-[13px] leading-snug text-text-tertiary">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}

                      {s.decisionGrid &&
                        (() => {
                          const r = slotReveal(s.steps.length);
                          if (r <= 0.02) return null;
                          return (
                            <div style={{ opacity: 0.25 + r * 0.75 }}>
                              <div className="flex items-start gap-2">
                                <span className="mt-1 h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: r > 0.5 ? s.accent : "var(--line)" }} />
                                <p className="text-[14px] font-semibold leading-tight text-text-primary">Decision gate</p>
                              </div>
                              <div className="mt-1.5 flex flex-wrap gap-1.5 pl-3.5">
                                {DECISION_CLASSES.map((d, di) => {
                                  const lit = di === litClassIndex && r > 0.4;
                                  return (
                                    <span
                                      key={d.label}
                                      className="rounded border font-medium transition-all duration-300"
                                      style={{
                                        borderColor: lit ? d.accent : `color-mix(in srgb, ${d.accent} 55%, transparent)`,
                                        borderWidth: lit ? 2 : 1,
                                        background: lit
                                          ? `color-mix(in srgb, ${d.accent} 22%, transparent)`
                                          : `color-mix(in srgb, ${d.accent} 14%, transparent)`,
                                        color: d.accent,
                                        padding: lit ? "3px 7px" : "4px 8px",
                                        fontSize: 12,
                                      }}
                                    >
                                      {d.label}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}

                      {s.branch &&
                        (() => {
                          const r = slotReveal(s.steps.length);
                          if (r <= 0.02) return null;
                          return (
                            <div
                              className="rounded-lg border-2 px-2 py-1.5"
                              style={{ opacity: 0.25 + r * 0.75, borderColor: `${s.accent}55` }}
                            >
                              <p className="text-[14px] font-semibold leading-tight text-text-primary">{s.branch.question}</p>
                              <div className="mt-1.5 flex flex-col gap-1.5">
                                <div className="rounded border border-line bg-white/70 px-1.5 py-1">
                                  <p className="flex items-baseline gap-1">
                                    <span className="mono-label text-[11px] text-text-tertiary">Yes</span>
                                    <span className="text-[13px] font-semibold text-text-primary">{s.branch.yes.title}</span>
                                  </p>
                                  <p className="text-[12px] leading-snug text-text-tertiary">{s.branch.yes.desc}</p>
                                </div>
                                <div className="rounded border border-line bg-white/70 px-1.5 py-1">
                                  <p className="flex items-baseline gap-1">
                                    <span className="mono-label text-[11px] text-text-tertiary">No</span>
                                    <span className="text-[13px] font-semibold text-text-primary">{s.branch.no.title}</span>
                                  </p>
                                  <p className="text-[12px] leading-snug text-text-tertiary">{s.branch.no.desc}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                    </div>
                  </div>
                </div>

                {i < STAGE_COUNT - 1 && (
                  <div className="mt-4 flex w-4 shrink-0 flex-col md:w-6" style={{ opacity: clamp01((l - 0.5) / 0.4) }}>
                    <div className="h-4" aria-hidden />
                    <div className="flex h-8 items-center justify-center md:h-9">
                      <ArrowRight size={14} className="text-text-tertiary" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* dashed feedback loop: what Learn / backtrack finds routes future
            cases back into Route first, closing the cycle */}
        <div className="relative mt-2" style={{ height: 46, opacity: loopReveal }} aria-hidden>
          <div
            className="absolute top-0"
            style={{ left: loopFromX, height: 26, borderLeft: `2px dashed ${learnStage.accent}`, opacity: 0.55 }}
          />
          <div
            className="absolute"
            style={{ left: loopToX, top: 26, width: `calc(${loopFromX} - ${loopToX})`, borderTop: `2px dashed ${learnStage.accent}`, opacity: 0.55 }}
          />
          <div
            className="absolute"
            style={{ left: loopToX, top: 8, height: 18, borderLeft: `2px dashed ${learnStage.accent}`, opacity: 0.55 }}
          />
          <div
            className="absolute"
            style={{
              left: loopToX,
              top: 8,
              transform: "translate(-50%, -100%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: `7px solid ${learnStage.accent}`,
              opacity: 0.7,
            }}
          />
          <span
            className="mono-label absolute rounded-full border bg-white px-2 py-1 text-[13px] shadow-sm"
            style={{
              left: `calc(${loopToX} + (${loopFromX} - ${loopToX}) / 2)`,
              top: 26,
              transform: "translate(-50%, -50%)",
              borderColor: `${learnStage.accent}55`,
              color: learnStage.accent,
            }}
          >
            Back to Route first
          </span>
        </div>

        <div
          className="mt-3 flex flex-col items-center gap-1 text-center"
          style={{ opacity: finaleReveal, transform: `translateY(${(1 - finaleReveal) * 8}px)` }}
        >
          <InfinityIcon size={18} className="text-text-tertiary" />
          <p className="text-base font-semibold text-text-primary md:text-lg">The cycle continues</p>
          <p className="mono-label text-[14px] text-text-tertiary">Every case makes the next one faster</p>
        </div>
        </div>
        </div>
      </SectionContainer>
    </div>
  );
}
