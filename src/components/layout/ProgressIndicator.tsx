"use client";

import clsx from "clsx";
import { PROGRESS_SECTIONS } from "@/lib/sections";
import { useAppState } from "@/components/system/AppProviders";

export function ProgressIndicator() {
  const { activeSection } = useAppState();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Presentation progress"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex lg:right-6"
    >
      {PROGRESS_SECTIONS.map((s) => {
        const active = activeSection === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="group flex items-center gap-2"
            aria-current={active ? "step" : undefined}
            aria-label={s.progressLabel}
          >
            <span
              className={clsx(
                "block rounded-full transition-all duration-300",
                active ? "h-2.5 w-2.5 bg-green glow-green" : "h-1.5 w-1.5 bg-text-tertiary/50 group-hover:bg-text-secondary",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
