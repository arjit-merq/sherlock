"use client";

import { SectionContainer } from "@/components/shared/SectionContainer";
import { RoadmapColumn } from "@/components/shared/RoadmapColumn";
import { CentralizedSystemVisual, ChatbotVisual, ScalabilityVisual } from "@/components/sections/RoadmapVisuals";
import { ROADMAP_PHASES } from "@/lib/data";
import { useScrollProgress } from "@/lib/useScrollProgress";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function Roadmap() {
  const { containerRef, progress } = useScrollProgress<HTMLDivElement>({
    pin: true,
    start: "top top",
    end: "+=180%",
    scrub: 0.5,
  });

  const reveal1 = clamp01(progress / 0.3);
  const reveal2 = clamp01((progress - 0.28) / 0.34);
  const reveal3 = clamp01((progress - 0.6) / 0.35);
  const activeIndex = progress < 0.32 ? 0 : progress < 0.65 ? 1 : 2;

  return (
    <div ref={containerRef} className="relative snap-block h-[280vh]">
      <SectionContainer id="roadmap" bare className="sticky top-0 flex h-screen flex-col overflow-hidden px-4 py-10 md:px-14">
        <h2 className="section-title mb-4 text-text-primary">
          Roadmap
        </h2>

        <div className="relative flex flex-1 flex-col justify-center">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            <RoadmapColumn
              phase={ROADMAP_PHASES[0]}
              active={activeIndex >= 0}
              reveal={reveal1}
              visual={
                <div style={{ opacity: 0.5 + reveal1 * 0.5 }} className="h-full w-full">
                  <CentralizedSystemVisual progress={reveal1} />
                </div>
              }
            />
            <RoadmapColumn
              phase={ROADMAP_PHASES[1]}
              active={activeIndex >= 1}
              reveal={reveal2}
              visual={
                <div style={{ opacity: 0.5 + reveal2 * 0.5 }} className="h-full w-full">
                  <ChatbotVisual progress={reveal2} />
                </div>
              }
            />
            <RoadmapColumn
              phase={ROADMAP_PHASES[2]}
              active={activeIndex >= 2}
              reveal={reveal3}
              visual={
                <div style={{ opacity: 0.5 + reveal3 * 0.5 }} className="h-full w-full">
                  <ScalabilityVisual progress={reveal3} />
                </div>
              }
            />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
