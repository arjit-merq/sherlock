"use client";

import { useEffect } from "react";
import { SECTIONS } from "@/lib/sections";

/** Arrow keys / Page Up / Page Down jump between major sections (presentation mode). */
export function KeyboardNav() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const forward = e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight";
      const backward = e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft";
      if (!forward && !backward) return;
      e.preventDefault();

      const positions = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        return el ? Math.abs(el.getBoundingClientRect().top) : Infinity;
      });
      const currentIndex = positions.indexOf(Math.min(...positions));
      const nextIndex = forward
        ? Math.min(currentIndex + 1, SECTIONS.length - 1)
        : Math.max(currentIndex - 1, 0);
      document.getElementById(SECTIONS[nextIndex].id)?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
