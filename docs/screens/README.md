# NIVORA — refinement screenshots

Captured from the running development server with headless Chromium at each
documented breakpoint, by `capture.mjs` in this folder.

```bash
npm run dev                     # one shell
node docs/screens/capture.mjs   # another
```

## Capture conditions (read before judging the imagery)

- **Photographs are stand-ins.** The sandbox can reach only npm/PyPI, so
  `images.unsplash.com` is unreachable. Those requests were answered during
  capture with local architectural photographs in `.stand-ins/` (git-ignored, not
  shipped), so cropping, layout and typography could be judged. The application
  still ships the original Unsplash URLs.
- **The map basemap is stubbed.** OpenStreetMap tiles are likewise unreachable,
  so tiles were answered with a neutral placeholder. Markers, popups, sync and
  zoom behaviour are the real implementation.
- **Motion is disabled** (`prefers-reduced-motion: reduce`) and the page is
  scrolled through in steps before capture, so IntersectionObserver reveals have
  fired and nothing below the fold photographs as a blank band.
- **Full-page captures are element captures of `<main>`.** Chrome's `fullPage`
  screenshot duplicates the fixed header and drops mid-page sections on this
  build; capturing the element is faithful and is what these files show.

## Brand pass — identity

| File | Viewport | Shows |
| --- | --- | --- |
| `header-desktop.png` | 1440 × 900 | Header with the horizontal lockup at 36px |
| `header-mobile.png` | 390 × 844 | The same lockup on a phone |
| `footer-desktop.png` | 1440 × 900 | White lockup on coal, footer links at 36px targets |
| `footer-mobile.png` | 390 × 844 | Footer, stacked |

The identity system itself is documented in `docs/brand/` — `logo-system.png`
(the whole system, clear space and minimum sizes) and `logo-size-test.png` (the
signed-off size and polarity test).

## Home and hero

| File | Viewport | Shows |
| --- | --- | --- |
| `home-1440.png` | 1440 × 900 | Full journey, desktop |
| `home-390.png` | 390 × 844 | Full journey, phone |
| `hero-desktop-1440.png` | 1440 × 900 | First viewport: headline, search, stats card |
| `hero-desktop-1366.png` | 1366 × 768 | Laptop width |
| `hero-tablet-1024.png` | 1024 × 768 | Two columns at the breakpoint |
| `hero-tablet-768.png` | 768 × 1024 | Single column |
| `hero-mobile-390.png` | 390 × 844 | Stacked: text → photo → stats → search |
| `hero-mobile-360.png` | 360 × 800 | Smallest supported width |

## Journey pages

`buy-1440/390.png`, `explore-1440/390.png`, `property-1440/390.png`,
`wizard-1440/390.png`, `dashboard-390.png`.

The search-result screenshots from the previous pass were removed rather than
left showing the retired logo; the search behaviour they illustrated is verified
by the checks in the delivery notes, and the old files remain in git history.
