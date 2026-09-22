"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export type NodeState = "dormant" | "active" | "verified";

interface AnimatedNodeProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  state?: NodeState;
  accent?: "green" | "cyan" | "amber" | "red";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const accentVar: Record<string, string> = {
  green: "var(--green)",
  cyan: "var(--cyan)",
  amber: "var(--amber)",
  red: "var(--red)",
};

const sizeMap = {
  sm: { box: 44, icon: 18 },
  md: { box: 60, icon: 24 },
  lg: { box: 92, icon: 36 },
};

export function AnimatedNode({
  icon: Icon,
  label,
  sublabel,
  state = "dormant",
  accent = "green",
  size = "md",
  pulse = false,
  className,
}: AnimatedNodeProps) {
  const dims = sizeMap[size];
  const color = accentVar[accent];

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-2 text-center transition-opacity duration-500",
        state === "dormant" && "opacity-40",
        state !== "dormant" && "opacity-100",
        className,
      )}
      data-node-state={state}
    >
      <div
        className="relative flex items-center justify-center rounded-full glass-panel"
        style={{
          width: dims.box,
          height: dims.box,
          borderColor:
            state === "verified" ? color : "var(--line)",
          boxShadow:
            state === "active"
              ? `0 0 0 1px ${color}55, 0 0 24px -4px ${color}88`
              : state === "verified"
                ? `0 0 0 1px ${color}, 0 0 16px -2px ${color}66`
                : undefined,
        }}
      >
        {pulse && state !== "dormant" && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: `1px solid ${color}`,
              animationDuration: "2.4s",
              opacity: 0.35,
            }}
            aria-hidden
          />
        )}
        <Icon size={dims.icon} color={state === "dormant" ? "var(--text-tertiary)" : color} strokeWidth={1.75} />
        {state === "verified" && (
          <span
            className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[13px] font-bold"
            style={{ background: color, color: "#04140c" }}
            aria-hidden
          >
            ✓
          </span>
        )}
      </div>
      <div>
        <div className="text-sm font-medium text-text-primary md:text-base">{label}</div>
        {sublabel && (
          <div className="mono-label text-[13px] text-text-tertiary md:text-[14px]">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
