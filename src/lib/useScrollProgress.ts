"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAppState } from "@/components/system/AppProviders";

interface Options {
  pin?: boolean;
  start?: string;
  end?: string;
  scrub?: number | boolean;
}

/**
 * Drives a single 0..1 progress value from a ScrollTrigger bound to
 * `containerRef`. Because progress comes straight from scroll position
 * (scrub), every animation derived from it plays forward on scroll-down and
 * reverses cleanly on scroll-up — no one-shot entrance timelines.
 */
export function useScrollProgress<T extends HTMLElement>(
  options: Options = {},
) {
  const containerRef = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const { reducedMotion } = useAppState();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;

    // The visual "pin" is done with plain CSS `position: sticky` on the inner
    // section (see SectionContainer), not GSAP — the wrapper's own explicit
    // height (100vh + scroll distance) already reserves the scroll range.
    // GSAP is only used here to turn scroll position into a 0..1 progress
    // value; asking it to *also* pin/reserve space would double-reserve
    // scroll distance and leave blank gaps between sections.
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: options.start ?? "top top",
      end: options.end ?? "bottom top",
      pin: false,
      scrub: options.scrub ?? 0.4,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => {
      trigger.kill();
    };
  }, [reducedMotion, options.start, options.end, options.scrub]);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.refresh());
    };
  }, []);

  return { containerRef, progress: reducedMotion ? 1 : progress };
}

export { gsap, ScrollTrigger };
