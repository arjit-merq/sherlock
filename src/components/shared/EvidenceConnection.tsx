"use client";

interface EvidenceConnectionProps {
  d: string;
  progress?: number; // 0..1 draw-on progress, driven by scroll
  verified?: boolean;
  color?: string;
  strokeWidth?: number;
  dimmed?: boolean;
}

/**
 * A single evidence line inside a parent <svg>. Pass `progress` from a scroll
 * timeline (GSAP scrub or IntersectionObserver ratio) to draw/retract the
 * line in both scroll directions — never a one-shot entrance.
 */
export function EvidenceConnection({
  d,
  progress = 1,
  verified = false,
  color = "var(--green)",
  strokeWidth = 0.9,
  dimmed = false,
}: EvidenceConnectionProps) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={verified ? 1 : "0.02 0.035"}
      style={{
        strokeDashoffset: 1 - progress,
        opacity: dimmed ? 0.12 : 0.35 + progress * 0.55,
        transition: "opacity 0.4s ease, stroke-dashoffset 0.05s linear",
      }}
      className="evidence-path"
      data-progress={progress}
    />
  );
}
