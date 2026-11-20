# Minor Mass — studio website

Marketing site for Minor Mass, an architecture & interiors studio. Built with [Astro](https://astro.build), with no UI framework. Interactions are written in small TypeScript modules. Smooth scrolling uses [Lenis](https://lenis.darkroom.engineering/); all other motion is CSS driven by IntersectionObserver (no animation library).

## Requirements

- Node.js **22.23.4 or newer** (Astro 7 requirement; Node 24 LTS recommended)

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start the dev server at `localhost:4321`     |
| `npm run build`   | Build the production site to `./dist/`       |
| `npm run preview` | Preview the production build locally         |

## Structure

```text
src/
├── assets/images/      Photography (optimised at build time by astro:assets)
├── components/         One component per page section, plus Header, Footer, ProjectCard, Icon, BackToTop
├── data/site.ts        All copy and content: studio details, services, process, projects, testimonials
├── layouts/Layout.astro
├── pages/              index.astro (one-page site) and 404.astro
├── scripts/            Client-side behaviour: smooth scroll, header + pill nav, hero annotations,
│                       reveals/parallax/magnetic buttons, process accordion, work, testimonials, form
└── styles/global.css   Design tokens and all styles
```

To change copy, projects or contact details, edit `src/data/site.ts`. To add a project, add an entry to `projects`. Set `featured: true` to show it in the large grid as well as in the index.

## Motion system

- **Tokens:** durations (`--dur-micro` 150ms, `--dur-std` 250ms, `--dur-section` 500ms, `--dur-hero` 700ms), three spring curves (`--spring-gentle`, `--spring-standard`, `--spring-expressive`) and stagger limits are defined at the top of `src/styles/global.css`, and mirrored for JS in `src/scripts/motion.ts`.
- **Scroll reveals:** add `data-reveal` (fade + rise), `data-reveal="mask"` (image wipe), `data-reveal="lines"` (heading lines), `data-reveal="rule"` (frame lines) and stagger with `style="--i:n"`. Each element animates once.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, nothing is hidden or moved, and Lenis and the parallax are off.
- **Fail-safe:** if the script fails to load, an inline guard in `Layout.astro` shows all content after 2.5s.
- **Haptics:** `haptic()` in `motion.ts`, only after a contact form submit, and only on touch devices with the Vibration API.

## Cinematic footer

`src/components/Footer.astro` is an Astro port of a React/Tailwind "motion footer": the footer is fixed underneath the page and revealed like a curtain as you scroll to the end. Its contents reveal once, together, via `data-reveal-scope` (see `src/scripts/reveal.ts`). The marquee text comes from the services list in `src/data/site.ts`.

## Hero annotations

The hotspots on the hero photo are set as fractions of the image (`spots` in `src/components/Hero.astro`). If you replace the hero photo, update those coordinates and `IMG_RATIO` in `src/scripts/hero.ts`.

## Contact form

The form validates in the browser. Where it sends depends on `PUBLIC_CONTACT_ENDPOINT` (see `.env.example`):

- **Set**: the form POSTs JSON to that URL. This works with Formspree, Web3Forms, Basin or your own API.
- **Not set**: the form opens the visitor's email app with the enquiry already filled in, addressed to `studio.email`.

## Photography

The photographs come from Unsplash and are used under the [Unsplash License](https://unsplash.com/license). Replace them with the studio's own project photography before launch.
