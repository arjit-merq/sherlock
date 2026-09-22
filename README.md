# Sherlock — Presentation Website

A scroll-driven, presentation-mode website for showing "Sherlock" (an agentic AI
for PES Support investigations) to management on a large screen. Built as a
Next.js (App Router) + TypeScript + Tailwind CSS site, with GSAP ScrollTrigger
driving every animation from scroll position (so every animation reverses
cleanly on scroll-up).

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. This repo's `.npmrc` pins the public npm registry
(`registry.npmjs.org`) for this project only, in case your global npm config
points at a private registry (e.g. CodeArtifact) that this project doesn't
need.

## Production build

```bash
npm run build
npm run start
```

`npm run build` also type-checks (`tsc`) and runs ESLint as part of the Next.js
build; both must be clean for the build to succeed.

## Project structure

```
src/
  app/
    layout.tsx        Root layout: fonts, metadata/viewport, AppProviders
    page.tsx           Assembles the eight sections in order
    globals.css         Design tokens (colors, grid bg, glass panel, etc.)
  components/
    system/
      AppProviders.tsx  Global state: reduced motion, presentation mode,
                         active section (for the progress indicator), restart
    layout/
      Nav.tsx                Sticky top nav: logo, section jump menu,
                              reduced-motion / presentation-mode / restart controls
      ProgressIndicator.tsx  The six-stage progress rail (Challenge → Roadmap)
      KeyboardNav.tsx         Arrow keys / Page Up/Down section jumps
      BackgroundField.tsx     Fixed blueprint-grid background
    shared/
      SectionContainer.tsx   Common section shell; registers the active
                              section via IntersectionObserver
      GlassPanel.tsx          Reusable glass-panel surface
      AnimatedNode.tsx        Reusable evidence/system node (icon + label + state)
      EvidenceConnection.tsx  A single SVG evidence line with scroll-driven
                              draw-on/retract and a verified/dotted state
      RoadmapColumn.tsx       Reusable roadmap phase card
      Logo.tsx                Sherlock + MerQube logo components
    sections/
      Hero.tsx                Opening sequence (Page 0)
      Challenges.tsx          Page 1 — Challenges for PE Support
      Connect.tsx             Page 2 — capabilities + system map overview
      ArchitectureDiagram.tsx Page 2 — dedicated 4-quadrant evidence ecosystem diagram
      Workflow.tsx            Page 3 — pinned 7-stage investigation pipeline
      Improve.tsx              Page 4 — Playbook + Distill loop
      Cases.tsx                Page 5 — three PES case studies
      Roadmap.tsx               Page 6 — three-phase roadmap
      Final.tsx                 Closing screen
  lib/
    data.ts               All on-screen copy/content (challenges, capabilities,
                           ecosystem nodes, workflow stages, cases, roadmap) —
                           edit this file to change wording without touching
                           animation code
    sections.ts            Section id list + progress-indicator labels
    useScrollProgress.ts    The core animation primitive (see below)
    gsap.ts                 GSAP + ScrollTrigger registration
public/
  assets/
    sherlock-logo.png    Sherlock mark (real logo, background removed)
    merqube-logo.svg     Official MerQube cube mark
    ASSETS_README.md     Notes on both assets and how to swap them later
```

## Where the animation timelines live

Every scroll-driven section follows the same pattern, implemented once in
[`src/lib/useScrollProgress.ts`](src/lib/useScrollProgress.ts):

1. A section renders a tall wrapper `<div>` (e.g. `h-[320vh]`) and, inside it,
   an inner `SectionContainer` with `position: sticky; top: 0`. Plain CSS
   sticky positioning does the actual "pinning" — **not** GSAP — while the
   wrapper's height reserves the scroll distance the section needs.
2. `useScrollProgress()` attaches one `ScrollTrigger` (with `scrub`, no pin) to
   that wrapper and turns scroll position into a single `progress` number from
   0 to 1.
3. The section derives every other animated value (opacity, transform,
   stroke-dashoffset, which stage is "active", etc.) from that one `progress`
   number with plain arithmetic (`clamp01((progress - start) / (end - start))`
   for staggered reveals). Because it's a pure function of scroll position,
   scrolling up always retraces the same path — nothing is a one-shot
   animation.
4. `reducedMotion` (from `AppProviders`) short-circuits `progress` to `1`, so
   `prefers-reduced-motion` (or the manual toggle in the nav) shows the final,
   settled state of each section as a static screen instead of animating.

If you need to retime a section, look for the `clamp01(...)` calls near the
top of that section's component — the fractions there are the whole timeline.

## Fallback / static presentation state

- The nav's pause icon (or the OS `prefers-reduced-motion` setting) forces
  `progress = 1` everywhere, which renders every section in its fully-revealed
  end state — a complete, readable static version of the whole deck.
- If GSAP/ScrollTrigger fails to load for any reason, sections still render
  their end-state content (nothing is hidden behind JavaScript-only markup),
  since all copy is present in the DOM immediately; only the scroll-scrubbed
  motion would be missing.

## Brand assets

Both logos are the real, official marks:

- `public/assets/sherlock-logo.png` — the Sherlock Slack workspace avatar,
  with its flat cream background chroma-keyed out to transparency (no other
  edits).
- `public/assets/merqube-logo.svg` — the official MerQube cube mark, fetched
  as-is (transparent background, original colors: near-black cube body, green
  top face).

That MerQube mark was drawn for a light background, so on this site's dark
theme `MerQubeLogo` (in `src/components/shared/Logo.tsx`) wraps the untouched
SVG in a small light backing chip for legibility, rather than recoloring it.
See [`public/assets/ASSETS_README.md`](public/assets/ASSETS_README.md) for
details and how to swap either file later.

## Known scope notes

- Content and copy (challenge cards, capability list, workflow stage text,
  case details, roadmap phases) match the brief's supplied facts and case IDs
  exactly — see `src/lib/data.ts`. No metrics, time savings, or outcomes were
  invented.
- The site is tuned primarily for 1920×1080 presentation and common laptop
  widths; below `md` (768px) the four-quadrant architecture diagram and the
  two-column layouts stack, per the responsive requirement, though the exact
  mobile-stacked layout described in the brief (separate stacked evidence
  groups) is a simplified single-column version rather than a bespoke mobile
  diagram.
