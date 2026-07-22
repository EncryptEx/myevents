# Design QA — PHP-to-Next.js visual parity

## Comparison target

- Source visual truth: `/tmp/myevents-original-1440.png` and `/tmp/myevents-original-mobile.png`
- Source implementation: PHP version from commit `aceb3e4`
- Final implementation: `/tmp/myevents-next-icons-final.png` and `/tmp/myevents-next-final-mobile.png`
- Combined desktop comparison: `/tmp/myevents-final-comparison.png`
- Combined mobile comparison: `/tmp/myevents-mobile-comparison.png`
- Focused card-region comparison: `/tmp/myevents-diff-region-comparison.png`
- Desktop viewport and pixels: 1440 × 1800 CSS px, 1440 × 1800 image px, device scale factor 1
- Mobile viewport and pixels: 390 × 1200 CSS px, 390 × 1200 image px, device scale factor 1
- State: initial page load; Mapbox canvas blank in both captures because the headless browser ran without WebGL

## Full-view comparison evidence

The final Next.js render reproduces the source container width, responsive breakpoint,
heading hierarchy, 500 px map height, horizontal rule, two-column desktop grid,
single-column mobile grid, Bootstrap card spacing, border, radius, shadow, and image/text
column proportions. The normalized desktop and mobile screenshots are pixel-identical
(RMSE 0).

## Focused region comparison evidence

The focused card comparison confirms equivalent 4/12 image and 8/12 text columns,
25 px external-link icons, card padding, muted copy color, line wrapping, date placement,
winner ribbons, and vertical card rhythm. No additional focused region was required
because the site contains one repeated card system and no other dense UI pattern.

## Required fidelity surfaces

- Fonts and typography: passed. Bootstrap 5.1.3 system typography, sizes, weights,
  line heights, wrapping, and heading hierarchy match the PHP source.
- Spacing and layout rhythm: passed. Container, grid gutters, margins, padding, map height,
  radii, borders, shadows, and responsive stacking match.
- Colors and visual tokens: passed. The source Bootstrap colors and original ribbon colors
  are used directly; no redesign palette remains.
- Image quality and asset fidelity: passed. All original event images and link icons are
  reused from the repository with the original sizing behavior.
- Copy and content: passed. Original section labels, event data, date formatting, badges,
  and link destinations are preserved. Newly added events remain intact.

## Comparison history

### Iteration 1 — blocked

- P1: The first Next.js implementation introduced a green editorial hero, custom serif
  typography, statistics, custom cards, and a footer that did not exist in the PHP source.
- P1: Card dimensions, map framing, spacing, and responsive behavior materially differed.
- Fix: Removed the redesign and restored the exact Bootstrap 5.1.3 markup/classes, original
  inline dimensions, ribbon CSS, marker CSS, icon sizes, section order, and date/badge rules.

### Iteration 2 — passed

- Post-fix evidence: `/tmp/myevents-final-comparison.png` and
  `/tmp/myevents-mobile-comparison.png`.
- No actionable P0, P1, or P2 differences remain.

### Iteration 3 — passed

- P2: React rendered adjacent external-link anchors without the text whitespace present
  between the original PHP anchors, making the GitHub, Devpost, and website icons touch.
- Fix: Restored the original literal inline whitespace between links without adding any
  new CSS or changing the markup's layout behavior.
- Post-fix evidence: `/tmp/myevents-next-icons-final.png`; desktop comparison RMSE is 0.

## Browser verification

- Browser-rendered desktop and mobile screenshots captured from the static `out/` build.
- External link controls, winner ribbons, responsive columns, and all visible card states
  rendered correctly.
- Browser output was checked; no application JavaScript or React errors were reported.
- Map interaction could not be exercised in the GPU-disabled headless browser, so both
  source and implementation were compared in the same blank-canvas state.

## Findings

No actionable P0, P1, or P2 visual differences remain.

## Follow-up polish

None. Deliberately avoid visual polish until a separate redesign is requested.

final result: passed
