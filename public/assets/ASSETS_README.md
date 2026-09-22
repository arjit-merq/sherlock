# Brand assets

## Sherlock logo
`sherlock-logo.png` is the real Sherlock mark (the Slack workspace avatar —
bowler hat, mustache, monocle, pipe). The source image had a flat opaque
cream background; it was processed (chroma-keyed) to a transparent PNG so it
sits cleanly on the dark UI. No other edits were made to the artwork itself.

## MerQube logo
`merqube-logo.svg` is the official MerQube cube mark, fetched from
logosandtypes.com, unmodified (transparent background, original colors:
near-black cube body, green top face).

That dark-on-transparent mark was designed for a light background. On this
site's dark theme it would otherwise nearly disappear (only the green top
face would read). Rather than recolor or redraw the logo — which the brief
explicitly rules out — `src/components/shared/Logo.tsx`'s `MerQubeLogo`
wraps the untouched SVG in a small light backing chip (`#f4f1ea`), the same
way a dark logo gets a light lockup card in any dark-themed product. If a
light-background or white-cube variant of the MerQube logo becomes available,
drop it in as `merqube-logo.svg` and remove the backing-chip wrapper in
`Logo.tsx`.

## Replacing either asset later
Both components live in `src/components/shared/Logo.tsx` — swap the file in
`public/assets/` and, if the filename changes, update the `src` there.
