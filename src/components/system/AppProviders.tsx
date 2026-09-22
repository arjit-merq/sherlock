"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SectionId } from "@/lib/sections";

interface AppState {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  restart: () => void;
  presentationMode: boolean;
  togglePresentationMode: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const reducedMotion = userOverride ?? systemReduced;

  useEffect(() => {
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
  }, [reducedMotion]);

  const toggleReducedMotion = useCallback(() => {
    setUserOverride((prev) => !(prev ?? systemReduced));
  }, [systemReduced]);

  const restart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [reducedMotion]);

  const togglePresentationMode = useCallback(() => {
    setPresentationMode((v) => !v);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("presentation-mode", presentationMode);
  }, [presentationMode]);

  const value = useMemo(
    () => ({
      reducedMotion,
      toggleReducedMotion,
      activeSection,
      setActiveSection,
      restart,
      presentationMode,
      togglePresentationMode,
    }),
    [reducedMotion, toggleReducedMotion, activeSection, restart, presentationMode, togglePresentationMode],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProviders");
  return ctx;
}
