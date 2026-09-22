"use client";

import { useEffect, useRef } from "react";
import type { SectionId } from "@/lib/sections";
import { useAppState } from "@/components/system/AppProviders";

interface SectionContainerProps {
  id: SectionId;
  children: React.ReactNode;
  className?: string;
  bare?: boolean; // skip default min-h/padding, for pinned sections that manage their own sizing
  domId?: string; // override the HTML id (for a second pinned block within the same story section)
}

/**
 * Common section shell: registers itself as the active section (drives the
 * progress indicator) when roughly centered in the viewport, and guarantees
 * every story beat fills at least one viewport.
 */
export function SectionContainer({
  id,
  children,
  className = "",
  bare = false,
  domId,
}: SectionContainerProps) {
  const ref = useRef<HTMLElement>(null);
  const { setActiveSection } = useAppState();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(id);
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveSection]);

  return (
    <section
      ref={ref}
      id={domId ?? id}
      data-section={id}
      className={
        bare
          ? className
          : `relative min-h-screen w-full px-6 py-24 md:px-16 lg:px-24 ${className}`
      }
    >
      {children}
    </section>
  );
}
