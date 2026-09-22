"use client";

import { ArrowRight, History } from "lucide-react";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { ACCURACY_HEADLINE, ACCURACY_SOURCES, ACCURACY_STAGES, ACCURACY_TREND, type AccuracyPoint } from "@/lib/data";
import { useScrollProgress } from "@/lib/useScrollProgress";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 shrink-0 rounded-sm bg-green" aria-hidden />
      <p className="mono-label text-sm text-text-secondary md:text-base">{children}</p>
    </div>
  );
}

function AccuracyGauge({ value, reveal }: { value: number; reveal: number }) {
  const r = 76;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[150px]" role="img" aria-label={`Accuracy ${value} percent`}>
      <circle cx="100" cy="100" r={r} fill="none" stroke="var(--line)" strokeWidth={17} />
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="var(--green)"
        strokeWidth={17}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        strokeDashoffset={dash * (1 - reveal)}
        transform="rotate(-90 100 100)"
      />
      <text x="100" y="98" textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--text-primary)" opacity={reveal}>
        {value.toFixed(1)}%
      </text>
      <text x="100" y="122" textAnchor="middle" fontSize="11" fill="var(--text-tertiary)" opacity={reveal}>
        accuracy now
      </text>
    </svg>
  );
}

function AccuracyTrend({ points, reveal }: { points: AccuracyPoint[]; reveal: number }) {
  const gridValues = [60, 70, 80, 90];
  const yFor = (v: number) => 181 - ((v - 60) / 10) * 42;
  const xs = [100, 262, 424];
  const coords = points.map((p, i) => ({ ...p, x: xs[i], y: yFor(p.value) }));
  const linePoints = coords.map((pt) => `${pt.x},${pt.y}`).join(" ");
  const areaPoints = `${coords[0].x},202 ${linePoints} ${coords[coords.length - 1].x},202`;

  return (
    <svg viewBox="0 0 500 260" className="h-auto w-full max-w-[460px]" role="img" aria-label="Accuracy by 15-day window" style={{ opacity: reveal }}>
      {gridValues.map((v) => (
        <g key={v}>
          <line x1={46} y1={yFor(v)} x2={478} y2={yFor(v)} stroke="var(--line)" />
          <text x={36} y={yFor(v) + 4} textAnchor="end" fontSize="12" fill="var(--text-tertiary)">
            {v}%
          </text>
        </g>
      ))}
      <polygon points={areaPoints} fill="var(--green)" opacity={0.12} />
      <polyline points={linePoints} fill="none" stroke="var(--green)" strokeWidth={3} strokeLinejoin="round" />
      {coords.map((pt, i) => (
        <g key={pt.label}>
          <circle
            cx={pt.x}
            cy={pt.y}
            r={i === coords.length - 1 ? 7 : 5.5}
            fill={i === coords.length - 1 ? "var(--green)" : "#fff"}
            stroke="var(--green)"
            strokeWidth={3}
          />
          <text x={pt.x} y={pt.y - 16} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text-primary)">
            {pt.value.toFixed(1)}%
          </text>
          <text x={pt.x} y={226} textAnchor="middle" fontSize="12" fill="var(--text-tertiary)">
            {pt.label}
          </text>
          <text x={pt.x} y={242} textAnchor="middle" fontSize="11" fill="var(--text-tertiary)" opacity={0.75}>
            {pt.sub}
          </text>
          {pt.gain && i > 0 && (
            <text
              x={(coords[i - 1].x + pt.x) / 2}
              y={(coords[i - 1].y + pt.y) / 2 - 8}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="var(--green)"
            >
              {pt.gain}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function Accuracy() {
  const { containerRef, progress } = useScrollProgress<HTMLDivElement>({
    pin: true,
    start: "top top",
    end: "+=260%",
    scrub: 0.5,
  });

  const titleReveal = clamp01(progress / 0.1);
  const panel1Reveal = clamp01((progress - 0.08) / 0.08);
  const leftReveal = clamp01((progress - 0.16) / 0.14);
  const rightReveal = clamp01((progress - 0.34) / 0.14);
  const panel2Reveal = clamp01((progress - 0.5) / 0.08);
  const cardReveal = (i: number) => clamp01((progress - (0.56 + i * 0.08)) / 0.12);

  return (
    <div ref={containerRef} className="relative snap-block h-[360vh]">
      <SectionContainer id="accuracy" bare className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 py-10 md:px-14">
        <div
          className="radial-glow pointer-events-none absolute left-[85%] top-[15%] h-[45vh] w-[45vh] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(closest-side, rgba(15,157,88,0.14), transparent 70%)" }}
          aria-hidden
        />

        <div className="relative z-10 mb-4" style={{ opacity: titleReveal, transform: `translateY(${(1 - titleReveal) * 14}px)` }}>
          <h2 className="section-title text-text-primary">
            Accuracy against real ticket resolutions
          </h2>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1100px] grid-cols-1 items-stretch gap-4">

          <GlassPanel className="flex min-h-[320px] flex-col p-4" style={{ opacity: panel1Reveal }}>
            <PanelHeading>Where accuracy stands</PanelHeading>
            <div className="mt-6 flex w-full flex-1 translate-y-1 flex-col items-center justify-center gap-6 md:mx-auto md:max-w-[940px] md:flex-row md:gap-14">
              <div
                className="flex shrink-0 flex-col items-center text-center md:w-[28%]"
                style={{ opacity: leftReveal, transform: `scale(${0.9 + leftReveal * 0.1})` }}
              >
                <AccuracyGauge value={ACCURACY_HEADLINE.value} reveal={leftReveal} />
              </div>
              <div className="flex w-full md:flex-1 md:justify-center" style={{ opacity: rightReveal, transform: `translateY(${(1 - rightReveal) * 10}px)` }}>
                <AccuracyTrend points={ACCURACY_TREND} reveal={rightReveal} />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="flex min-h-[262px] flex-col p-2" style={{ opacity: panel2Reveal }}>
            <PanelHeading>How it improved</PanelHeading>
            <div className="mt-3 flex flex-1 items-stretch gap-1.5">
              {ACCURACY_STAGES.map((stage, i) => {
                const r = cardReveal(i);
                return (
                  <div key={stage.era} className="flex min-w-0 flex-1 items-stretch gap-1.5">
                    <article
                      className="flex min-w-0 flex-1 flex-col items-center justify-between rounded-xl border p-1.5 text-center"
                      style={{
                        borderColor: stage.final ? "var(--green-dim)" : "var(--line)",
                        background: stage.final ? "rgba(15,157,88,0.06)" : "var(--panel)",
                        opacity: r,
                        transform: `translateY(${(1 - r) * 14}px)`,
                      }}
                    >
                      <span className="mono-label text-[9px] text-text-tertiary">{stage.era}</span>

                      <div className="mt-1.5 grid w-full grid-cols-3 gap-1">
                        {ACCURACY_SOURCES.map((s) => {
                          const on = stage.activeSources.includes(s);
                          return (
                            <span
                              key={s}
                              className="rounded px-1 py-0.5 text-[9px] font-semibold"
                              style={{
                                background: on ? "var(--text-primary)" : "var(--line)",
                                color: on ? "#fff" : "var(--text-tertiary)",
                              }}
                            >
                              {s}
                            </span>
                          );
                        })}
                      </div>

                      <div
                        className="mt-1 flex w-full items-center justify-center gap-1 rounded px-1 py-0.5 text-[9px] font-semibold"
                        style={{
                          background: stage.memoryActive ? "var(--green)" : "var(--line)",
                          color: stage.memoryActive ? "#fff" : "var(--text-tertiary)",
                        }}
                      >
                        <History size={11} />
                        Past cases &amp; playbooks
                      </div>

                      <h3 className="mt-1 flex items-center text-[12px] font-bold leading-tight text-text-primary md:text-[13px]">
                        {stage.title}
                      </h3>
                      <span
                        className="mt-1 text-lg font-bold tabular-nums md:text-xl"
                        style={{
                          color: stage.final ? "var(--green)" : "var(--text-tertiary)",
                          opacity: r,
                          transform: `scale(${0.7 + r * 0.3})`,
                          display: "inline-block",
                        }}
                      >
                        {stage.accuracy.toFixed(1)}%
                      </span>
                    </article>

                    {i < ACCURACY_STAGES.length - 1 && (
                      <div
                        className="flex shrink-0 flex-col items-center justify-center gap-1 self-stretch px-0.5"
                        style={{ opacity: cardReveal(i + 1) }}
                      >
                        <ArrowRight size={16} className="text-text-tertiary" />
                        <span className="whitespace-nowrap text-[11px] font-bold text-green">
                          {ACCURACY_STAGES[i + 1].gain}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      </SectionContainer>
    </div>
  );
}
