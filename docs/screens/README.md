# NIVORA — refinement screenshots

Captured from the running development server at the end of the refinement pass,
using headless Chromium at each documented breakpoint.

## Capture conditions (read before judging the imagery)

- **Photographs are stand-ins.** The sandbox can only reach npm/PyPI, so
  `images.unsplash.com` is unreachable. Requests for Unsplash images were
  intercepted during capture and answered with temporary local architectural
  photographs (not committed to this repository), so that layout, cropping and
  typography could be judged.
  The application itself still ships the original Unsplash URLs in
  `src/data/demo-properties.ts` and `src/app/page.tsx`.
- **The map basemap is stubbed.** OpenStreetMap tiles are likewise unreachable,
  so tiles were answered with a neutral placeholder. Markers, clustering,
  popups, sync and zoom behaviour are the real implementation; the streets
  underneath are not.
- **Motion is disabled.** Captures emulate `prefers-reduced-motion: reduce`, so
  scroll reveals start visible and full-page screenshots are complete. The
  animation path was verified separately by scrolling the live page.

## Files

| File | Viewport | Page |
| --- | --- | --- |
| `home-1440.png` | 1440 × 900, full page | Homepage |
| `home-1366.png` | 1366 × 768 | Homepage |
| `home-1024.png` | 1024 × 768 | Homepage (tablet) |
| `home-768.png` | 768 × 1024 | Homepage (tablet portrait) |
| `home-390.png` | 390 × 844, full page | Homepage (mobile) |
| `home-360.png` | 360 × 800 | Homepage (small mobile) |
| `buy-1440.png`, `buy-390.png` | desktop / mobile | Discovery: properties for sale |
| `explore-1440.png`, `explore-390.png` | desktop / mobile | Map exploration with clustered markers |
| `property-1440.png`, `property-390.png` | desktop / mobile | Property detail page |
| `wizard-1440.png`, `wizard-390.png` | desktop / mobile | Listing wizard |
| `dashboard-390.png` | mobile | Dashboard |
