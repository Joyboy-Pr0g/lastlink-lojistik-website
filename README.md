# LastLink

Single-page site for LastLink, a final-mile delivery company operating across Canada.
Dark theme, bilingual (EN/FR), built around 3D video and WebGL.

**Stack:** Vite · React 18 · TypeScript · Tailwind · Framer Motion · React Three Fiber · GSAP ScrollTrigger · Lenis · lucide-react

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the build
```

## Brand

Both colours are sampled directly from `public/logo.svg` and defined in `tailwind.config.js`:

| Token | Hex | Use |
|---|---|---|
| `navy` | `#031E3B` | Surfaces, panels, the logo's own shapes |
| `navy-950` | `#01090F` | Page background |
| `green` | `#65AF02` | CTAs, accents, every glow |

`public/logo.svg` is the client's artwork and is **never recoloured or cropped**. Its navy would
disappear against the dark page, so `components/ui/Logo.tsx` sets it on a light chip instead.

## Video assets

The three journey/hero clips live in `public/vid/`. They are 3D CGI renders generated with Google
Flow — the exact prompts, negative prompts and encoding commands are in [VIDEO_PROMPTS.md](VIDEO_PROMPTS.md).

| File | Used by |
|---|---|
| `hero.mp4` | Hero background, and journey step 2 (cross-Canada transit) |
| `pickup.mp4` | Journey step 1 |
| `dropoff.mp4` | Journey step 3 |
| `logo.mp4` | *Optional.* Animated logo in the header/footer; falls back to the static logo if absent |

**The site is silent by design.** Source clips ship with an audio track, so `VideoPanel` and
`Logo` force `muted`/`volume = 0` imperatively as well as via the attribute — React can attach
the `muted` attribute after the element exists, which would otherwise let a frame of audio
through. Videos also pause when scrolled off screen.

Missing video files degrade gracefully: `VideoPanel` swaps in a gradient, `Logo` swaps in the SVG.

## Structure

```
src/
├── components/
│   ├── hero/          Hero (video parallax + 3D headline) and the live NetworkPanel readout
│   ├── journey/       Scroll-driven "how it works", plus the MediaHud instrument overlay
│   ├── coverage/      CoverageScene — the R3F Canada map with animated lanes
│   ├── layout/        Header, Footer
│   ├── sections/      Track, Stats, Services, Coverage, About, Contact
│   └── ui/            Tilt, GlowButton, Reveal, VideoPanel, NetworkBackdrop, Logo
├── i18n/              English and French copy — no other locales
├── lib/               motion tokens, capability detection, smooth scroll, SEO, media queries
└── styles/global.css  Tailwind layers, .glass / .shell / .scene-3d primitives
```

## Motion notes

- **`ui/Tilt` and `ui/GlowButton`** own the 3D interaction. Buttons roll a two-faced label block
  on hover: the front face carries label + icon, the underside carries the icon alone, so the
  text turns away and the icon arrives centred.
- **`ui/NetworkBackdrop`** drifts two parallax node fields behind most sections. The drift is
  applied to HTML wrappers, not SVG `<g>` elements — Framer Motion writes `x`/`y` as *attributes*
  on an SVG group, which a `<g>` ignores, so it would never move.
- **Journey step sync** is driven by an `IntersectionObserver` on each step block, not by raw
  scroll progress. The pinned media and the taller text column scroll at different rates, so a
  progress-ratio approach drifts out of sync and shows the wrong clip.
- **Reduced motion** is honoured throughout via `useReducedMotion`. Note that Windows'
  *Settings → Accessibility → Visual effects → Animation effects* toggle sets
  `prefers-reduced-motion: reduce`; with it off, animations are intentionally disabled.
- `lib/capabilities.ts` additionally gates WebGL scenes off on low-power and handheld devices.

## Performance

- three.js/R3F/drei is a separate chunk, lazily loaded behind `Suspense`, so it never blocks first paint
- Only one of the journey's two layouts mounts (`useIsDesktop`), so each video downloads once
- Brotli + gzip precompression via `vite-plugin-compression2`
- Fonts load in a single Google Fonts request with `display=swap`

Consider re-encoding `hero.mp4` (~9 MB) below 3 MB before going live; see the ffmpeg commands in
[VIDEO_PROMPTS.md](VIDEO_PROMPTS.md).

## Contact form

`components/sections/Contact.tsx` posts to a `CONTACT_ENDPOINT` placeholder. Point it at a real
Formspree form (or your own endpoint) before launch.

---

Developed by [InjazDev](https://injazdev.com/)
