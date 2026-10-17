# Sana Ullah — Portfolio

Personal portfolio for **Sana Ullah**, full-stack web developer and BS Computer
Science student at HITEC University.

A single-page React site: hero, four case studies, about, skills, process and a
contact form. Editorial dark/light design, scroll-driven motion via GSAP
ScrollTrigger, and a fully custom cursor. No page reloads, no router, no state
library — the content is data, the motion is declarative.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the built dist/ locally
npm run lint     # oxlint
```

Requires Node 20+.

---

## Editing your details

**`src/config/site.config.ts` is the only file you need to touch for personal
information.** Name, role, SEO metadata, email address, social profiles and
location all read from it.

The config is built so you cannot ship a dead link or a fake contact address.
Anything left as a placeholder degrades gracefully instead of pretending to
work:

| Field                        | While unconfigured                                  |
| ---------------------------- | --------------------------------------------------- |
| `contact.email`              | Contact section shows a "Placeholder — add your real address" note, the copy button is disabled, and the form falls back to opening a prefilled `mailto:` |
| `contact.emailConfigured`    | Set to `true` only once `email` is real              |
| `contact.formEndpoint`       | `null` → `mailto:` fallback. A URL (Formspree, Web3Forms, …) → real AJAX submit |
| `social.*.configured`        | The row renders as a dashed "Add your link" placeholder rather than a link that goes nowhere |

**`src/data/`** holds everything else that is content, not code:

| File                | Contents                                          |
| ------------------- | ------------------------------------------------- |
| `data/projects.ts`  | The four case studies, including their layout mode |
| `data/skills.ts`    | Skill groups and the hero marquee words           |
| `data/process.ts`   | The four process steps and the About details list |
| `data/navigation.ts`| Nav items — `id` must match a section `id`        |

### Adding a project

Append to `projects` in `src/data/projects.ts`. `layout` picks the art-directed
placement and cycles through the alternation:

- `wide` — copy left, media right
- `offset` — media left and dropped, copy right
- `compact` — copy left, media right and raised
- `bleed` — full-bleed media over a wide copy column

`mockup` selects which hand-drawn preview to render (`salon`, `technical`,
`agency`, `portal`). Add a new one by writing a new `*Art` component in
`src/components/ProjectMockup.tsx` — it is plain CSS and SVG, no images.

If you later drop a real screenshot into `public/shots/` and set
`screenshot: '/shots/your-file.webp'`, the frame renders that image instead and
the drawn artwork is skipped.

---

## Light & dark mode

Both schemes ship. The toggle sits in the header next to the menu button.

**How it works.** The palette lives in `--c-*` custom properties in
`src/styles/global.css`, declared once per scheme (`:root, [data-theme='dark']`
and `[data-theme='light']`). A Tailwind `@theme inline` block maps those onto
the `--color-*` scale *without* emitting a `:root` copy, so every utility —
including opacity modifiers like `bg-void/80` — resolves through the same
property and follows the active scheme at runtime.

Two consequences worth knowing:

1. **Hand-written CSS must reference `--c-*`, not `--color-*`.** Under
   `@theme inline`, `--color-*` does not exist in the cascade.
2. **Never hardcode a colour in a component.** Use a token (`text-bone-dim`,
   `bg-surface`, `text-lime`) or a `var(--c-…)` reference. The one deliberate
   exception is `ProjectMockup.tsx`, whose fixed palettes depict the *brands of
   the other four websites* and must not flip.

**No flash on load.** A small inline script in `<head>` (see `index.html`)
resolves the scheme before first paint from `localStorage`, falling back to
`prefers-color-scheme`, and writes it to `documentElement`. `useTheme` then
reads the value back off the document rather than re-deriving it, so React never
flickers or double-writes storage.

The choice is stored under `su-theme`, synced across open tabs, and the OS
preference is followed only while no explicit choice has been made. It also
updates `<meta name="theme-color">` and `color-scheme`, so the mobile browser
chrome matches.

**To adjust a colour**, edit the token in both scheme blocks. If you add a
token, add it to both, and map it in `@theme inline` if components should be
able to use it as a Tailwind class.

---

## Motion

Motion is a single system, not per-component timelines.

- `src/lib/animation.ts` owns the reveal pass. It collects every `[data-reveal]`
  in the document, groups them by their nearest `[data-reveal-group]` so lists
  stagger as a unit, and drives them with ScrollTrigger.
- `Reveal`, `RevealFade`, `RevealMask`, `RevealLine` and `RevealGroup` in
  `src/components/Reveal.tsx` are thin wrappers over the same data attributes
  for cases where a wrapper reads better than the raw attribute.
- `initReveals()` and `revealSafetyNet()` both return teardown functions, which
  is what keeps StrictMode's double-invoked effects from registering two sets of
  triggers.
- The safety net only rescues elements that are well above their trigger line
  *and* not currently being animated — invisible content is worse than a missing
  animation, but a truncated stagger is not.

**Reveal targets start hidden only under a `.js` class**, added by the bundle.
If JavaScript fails to run, the page renders fully visible rather than blank.

**`prefers-reduced-motion: reduce`** skips the preloader entirely, skips GSAP
animation, and disables the custom cursor and magnetic buttons. The native
cursor is left untouched.

### Custom cursor

Driven entirely by `data-cursor` attributes, so new interactive elements need no
wiring:

```html
data-cursor="link"               <!-- ring expands -->
data-cursor="view"               <!-- ring fills, shows data-cursor-label -->
data-cursor="hide"               <!-- ring hides -->
```

It only activates on fine pointers (`(hover: hover) and (pointer: fine)`) and
restores the native cursor over inputs, textareas and contenteditable regions.

---

## Accessibility

- Skip-to-content link, and a focus trap with Escape-to-close on the case-study
  modal that returns focus to the trigger
- Focus restored when the mobile menu closes; body scroll locked with a
  scrollbar-width offset so the page does not shift
- The contact form validates inline, wires `aria-invalid` / `aria-describedby`,
  moves focus to the first invalid field, and announces the result in a live
  region. It never reports "sent" unless a real endpoint confirmed it.
- Decorative SVGs are `aria-hidden`; the hero diagram has a text alternative
- `prefers-reduced-motion` fully honoured
- A `<noscript>` block carries the written content and all four project links

---

## Project structure

```
index.html              meta, fonts, JSON-LD, pre-paint theme script
public/                 favicon, og-image, robots.txt, sitemap.xml
src/
  main.tsx              entry; adds the .js / .js-mesh hooks
  App.tsx               composition + reveal system wiring
  components/           Navbar, Footer, HeroMesh, ProjectMockup, ProjectModal,
                        Preloader, CustomCursor, ThemeToggle, Button, Reveal,
                        SectionHeading
  sections/             Hero, Work, About, Skills, Process, Contact
  data/                 projects, skills, process, navigation
  config/site.config.ts your details — start here
  hooks/                useTheme, useMedia, useMagnetic, useActiveSection
  lib/                  animation (GSAP + ScrollTrigger), cn
  styles/global.css     design tokens, both colour schemes
```

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · GSAP 3 (ScrollTrigger) ·
Oxlint. No other runtime dependencies.

## Deployment

Vite builds to a static `dist/`, so any static host works. `vercel.json` is
included with an SPA rewrite and immutable caching for hashed assets. To deploy
elsewhere, build and publish `dist/`.

Node **20.19+** or **22.12+** is required (Vite 8); this is declared in
`package.json` under `engines`, so Vercel picks a compatible runtime.

### Deploying to Vercel

1. Push the project to a Git repository and import it at vercel.com/new, or run
   `npx vercel` from the project root.
2. Leave the detected settings alone — `vercel.json` pins them:
   build `npm run build`, output `dist`.
3. Set the real email in `src/config/site.config.ts` (see below) before the
   first deploy, otherwise the email link ships as "coming soon".

### Before you deploy: the domain

There is deliberately **no canonical URL, no `og:url`, and no advertised
sitemap** in this project right now. A canonical and a sitemap both require an
absolute URL, and a hostname you do not own would point search engines at
somebody else's page — worse than having neither.

It runs fine on `localhost` with none of this. When you get a domain, fill in
four places:

| File                                | What to change                                                    |
| ----------------------------------- | ----------------------------------------------------------------- |
| `index.html`                        | Uncomment the `<link rel="canonical">` in the head comment, and add back `og:url` |
| `public/sitemap.xml`                | Replace `https://YOUR-DOMAIN/` with your real origin                 |
| `public/robots.txt`                 | Uncomment the `Sitemap:` line                                       |
| `src/config/site.config.ts`         | `meta.url` — not read by the code yet, but it's the one place to record your origin |

`og:image` and `twitter:image` are already root-relative (`/og-image.svg`), so
they work on any host.

"# Sana-Ullah" 
