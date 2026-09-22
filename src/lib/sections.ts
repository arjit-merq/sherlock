export type SectionId =
  | "hero"
  | "challenge"
  | "connect"
  | "investigate"
  | "improve"
  | "accuracy"
  | "evidence"
  | "roadmap";

export interface SectionMeta {
  id: SectionId;
  navLabel: string;
  progressLabel: string;
}

// Challenges opens the deck, then the Sherlock intro (hero), then the rest.
export const SECTIONS: SectionMeta[] = [
  { id: "challenge", navLabel: "Challenge", progressLabel: "Challenge" },
  { id: "hero", navLabel: "Intro", progressLabel: "Intro" },
  { id: "connect", navLabel: "Connect", progressLabel: "Connect" },
  { id: "investigate", navLabel: "Investigate", progressLabel: "Investigate" },
  { id: "improve", navLabel: "Improve", progressLabel: "Improve" },
  { id: "accuracy", navLabel: "Accuracy", progressLabel: "Accuracy" },
  { id: "evidence", navLabel: "Evidence", progressLabel: "Evidence" },
  { id: "roadmap", navLabel: "Roadmap", progressLabel: "Roadmap" },
];

// The indicator itself only surfaces the six story beats (Hero is the intro).
export const PROGRESS_SECTIONS = SECTIONS.filter((s) => s.id !== "hero");
