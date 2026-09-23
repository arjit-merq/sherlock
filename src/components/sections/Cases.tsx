"use client";

import {
  ArrowDown,
  CheckCircle2,
  Ticket,
  MessageSquare,
  BookOpen,
  Workflow as WorkflowIcon,
  Box,
  Network,
  ShieldAlert,
  Database,
  FileCog,
  FolderGit2,
  type LucideIcon,
} from "lucide-react";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { CASES } from "@/lib/data";
import { useScrollProgress } from "@/lib/useScrollProgress";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

const SYSTEM_ICON: Record<string, LucideIcon> = {
  Jira: Ticket,
  Slack: MessageSquare,
  Notion: BookOpen,
  Airflow: WorkflowIcon,
  S3: Box,
  DataAPI: Network,
  SecAPI: ShieldAlert,
  Databases: Database,
  Manifests: FileCog,
  Manifest: FileCog,
  "Source code": FolderGit2,
};

const CASE_COUNT = CASES.length;
const INTRO_SPAN = 0.22; // The opening statement gets a distinct beat before cases appear.
const CASE_SPAN = (1 - INTRO_SPAN) / CASE_COUNT;

export function Cases() {
  const { containerRef, progress } = useScrollProgress<HTMLDivElement>({
    pin: true,
    start: "top top",
    end: "+=300%",
    scrub: 0.5,
  });

  const intro = clamp01(progress / (INTRO_SPAN * 0.2));
  const introExit = clamp01((progress - INTRO_SPAN * 0.72) / (INTRO_SPAN * 0.18));
  const casesProgress = clamp01((progress - INTRO_SPAN) / (1 - INTRO_SPAN));
  const casesReveal = clamp01((progress - INTRO_SPAN) / (INTRO_SPAN * 0.18));
  const activeIndex = Math.min(CASE_COUNT - 1, Math.floor(casesProgress / CASE_SPAN));
  const localProgress = clamp01((casesProgress - activeIndex * CASE_SPAN) / CASE_SPAN);

  const scrollToCase = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const caseProgress = i * CASE_SPAN + CASE_SPAN * 0.5;
    const targetProgress = INTRO_SPAN + caseProgress * (1 - INTRO_SPAN);
    const scrollDistance = Math.max(0, el.offsetHeight - window.innerHeight);
    const target = el.offsetTop + scrollDistance * targetProgress;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="relative snap-block h-[400vh]">
      <SectionContainer id="evidence" bare className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 py-10 md:px-14">
        {/* intro statement, plays before any case appears */}
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8"
          style={{ opacity: Math.min(intro, 1 - introExit) }}
        >
          <p className="section-heading max-w-3xl text-center text-2xl font-medium text-text-primary md:text-4xl">
            Sherlock can investigate <span className="font-semibold text-green">broadly</span>, draw on{" "}
            <span className="font-semibold text-green">institutional knowledge</span>, and recommend a narrowly scoped{" "}
            <span className="font-semibold text-green">engineering change</span>.
          </p>
        </div>

        <div className="mb-4" style={{ opacity: casesReveal }}>
          <h2 className="section-title text-text-primary">
            Production Cases
          </h2>
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden">
        <div style={{ opacity: casesReveal }}>
          {/* case selector */}
          <div className="mb-4 flex gap-2">
            {CASES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => scrollToCase(i)}
                className="rounded-full px-3 py-1.5 text-[14px] font-medium transition-all duration-300"
                style={{
                  background: i === activeIndex ? "var(--green)" : "rgba(15,23,42,0.05)",
                  color: i === activeIndex ? "#ffffff" : "var(--text-secondary)",
                  border: "1px solid var(--line)",
                }}
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* case stories, cross-fade by proximity to active index */}
          {CASES.map((c, i) => {
            const visible = i === activeIndex;
            const sectionOpacity = casesReveal;
            return (
              <div
                key={c.id}
                className="absolute inset-0 grid grid-cols-1 gap-6 transition-opacity duration-300 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
                style={{ opacity: visible ? sectionOpacity : 0, pointerEvents: visible ? "auto" : "none" }}
              >
                <div className="flex flex-col justify-center gap-3">
                  <p className="mono-label text-[14px] text-green">{c.headline}</p>
                  <p className="text-base text-text-secondary md:text-lg">{c.issue}</p>

                  <div className="mt-2 space-y-1.5">
                    <p className="mono-label text-[14px] text-text-tertiary">Sherlock contribution</p>
                    {c.contribution.map((line) => (
                      <p key={line} className="text-base text-text-secondary md:text-lg">
                        · {line}
                      </p>
                    ))}
                  </div>

                  <div className="mt-3">
                    <GlassPanel accent="green" className="inline-block px-3 py-2">
                      <p className="text-base text-text-primary md:text-lg">{c.outcome}</p>
                    </GlassPanel>
                  </div>

                  <p
                    className="section-heading mt-3 text-base font-medium text-gradient-green md:text-lg"
                    style={{ opacity: clamp01((localProgress - 0.7) * 3) }}
                  >
                    {c.transformation}
                  </p>
                  <span className="mono-label inline-block w-fit rounded-full border border-line px-2 py-0.5 text-[13px] text-cyan">
                    {c.mode}
                  </span>
                </div>

                {/* the main visual: what was found at each system, as a growing chain */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white/40 p-6 md:p-8">
                  <p className="mono-label mb-5 text-base text-text-tertiary">
                    What Sherlock found, system by system
                  </p>
                  <div className="mx-auto flex w-fit flex-col gap-0">
                    {c.checks.map((check, si) => {
                      const reveal = clamp01((localProgress - 0.1) * 3.2 - si * 0.22);
                      const Icon = SYSTEM_ICON[check.system] ?? CheckCircle2;
                      return (
                        <div key={check.system}>
                          <div
                            className="flex items-center gap-3 transition-all duration-300"
                            style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 10}px)` }}
                          >
                            <span className="glass-panel flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                              <Icon size={17} className="text-green" strokeWidth={1.75} />
                            </span>
                            <span className="w-24 shrink-0 text-base font-semibold text-text-primary md:w-28 md:text-lg">
                              {check.system}
                            </span>
                            <span className="text-base text-text-secondary md:text-lg">{check.finding}</span>
                          </div>
                          {si < c.checks.length - 1 && (
                            <div className="py-1.5 pl-4" style={{ opacity: reveal }}>
                              <ArrowDown size={14} className="text-text-tertiary" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p
                    className="mt-5 text-center text-base text-text-tertiary md:text-lg"
                    style={{ opacity: clamp01((localProgress - 0.75) * 4) }}
                  >
                    {c.checks.length} systems checked before a recommendation was made.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </SectionContainer>
    </div>
  );
}
