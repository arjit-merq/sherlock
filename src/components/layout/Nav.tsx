"use client";

import { useState } from "react";
import { Menu, X, Pause, Play, RotateCcw, LayoutPanelTop } from "lucide-react";
import { SherlockLogo, MerQubeLogo } from "@/components/shared/Logo";
import { SECTIONS } from "@/lib/sections";
import { useAppState } from "@/components/system/AppProviders";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { reducedMotion, toggleReducedMotion, restart, presentationMode, togglePresentationMode, activeSection } = useAppState();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const showBrand = activeSection !== "challenge";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 md:px-8">
      <div
        className="flex items-center gap-3 transition-opacity duration-500"
        style={{ opacity: showBrand ? 1 : 0, pointerEvents: showBrand ? "auto" : "none" }}
      >
        <SherlockLogo size={28} />
        <span className="section-heading text-base font-medium tracking-tight text-text-primary md:text-lg">
          Sherlock
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleReducedMotion}
          className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition hover:text-green"
          aria-pressed={reducedMotion}
          title={reducedMotion ? "Enable animation" : "Disable animation"}
        >
          {reducedMotion ? <Play size={15} /> : <Pause size={15} />}
        </button>
        <button
          onClick={togglePresentationMode}
          className="glass-panel hidden h-9 w-9 items-center justify-center rounded-full transition hover:text-green md:flex"
          style={{ color: presentationMode ? "var(--green)" : "var(--text-secondary)" }}
          aria-pressed={presentationMode}
          title={presentationMode ? "Exit presentation mode" : "Enable presentation mode (snap between sections)"}
        >
          <LayoutPanelTop size={15} />
        </button>
        <button
          onClick={restart}
          className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition hover:text-green"
          title="Restart presentation"
        >
          <RotateCcw size={15} />
        </button>
        <div className="hidden sm:flex">
          <MerQubeLogo width={26} />
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition hover:text-green"
          aria-expanded={open}
          aria-label="Section navigation"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {open && (
        <div className="glass-panel absolute right-5 top-14 flex w-56 flex-col gap-1 rounded-xl p-2 md:right-8">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="rounded-lg px-3 py-2 text-left text-base text-text-secondary transition hover:bg-white/5 hover:text-text-primary"
            >
              {s.navLabel}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
