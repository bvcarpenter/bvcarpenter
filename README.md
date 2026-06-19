# A minimal photography portfolio

A hand-built Astro theme. A slim nav rail on the left holds your **Portfolios**
and **Projects**; the right side is a large image **carousel** with scrollable
text beneath it. Near-monochrome, lots of whitespace, one accent used only as a
marker. Light and dark are both handled via `prefers-color-scheme`.

Pure static output — every page is prerendered to flat HTML and images are
optimized at build time, so it deploys anywhere that serves static files
(Cloudflare Pages, Netlify, GitHub Pages…). No CMS, no adapter, no Worker.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # serve the built site
```

Node 22 (see `.nvmrc`).

## How content works

Two collections, defined in `src/content.config.ts`:

- **`src/content/portfolios/`** — image-led galleries (the carousel is the point).
- **`src/content/projects/`** — text-led pieces (optional carousel, then writing).

Both show up as their own group in the left sidebar. Each entry is a plain
Markdown file: frontmatter holds the metadata and the carousel images, and the
Markdown **body** becomes the scrollable text under the carousel.

### Add a portfolio

Create `src/content/portfolios/my-gallery.md`, drop the images in
`src/assets/photos/`, and list them in order:

```md
---
title: Coastlines
summary: Long mornings where the land runs out.
date: 2026-04-02
order: 2                       # lower sorts first in the sidebar (optional)
images:
  - src: ../../assets/photos/frame-04.jpg
    alt: Low tide, flat light  # alt is optional; falls back to the title
  - src: ../../assets/photos/frame-05.jpg
---

Optional description. This Markdown shows below the carousel.
```

`title` and `date` are required; everything else is optional. Images in
`src/assets` are resized, hashed and served as WebP at build time.

### Add a project

Same shape, in `src/content/projects/`. The carousel is optional here — lead with
an image or two, then write. Set `draft: true` to keep one out of the build.

```md
---
title: A small darkroom in a small bathroom
summary: What it costs, what it saves, and why the wait is the best part.
date: 2026-02-14
images:
  - src: ../../assets/photos/proj-developing.jpg
---

The chemistry is easier than people tell you. The discipline is harder.

## The setup

Markdown body, with `##` headings, links and inline images all rendered.
```

## Make it yours

- **Name & tagline:** `src/components/Sidebar.astro` (the `brand` + `tagline`),
  and the default title in `src/layouts/BaseLayout.astro`. Search for `Your Name`.
- **Color & type:** all tokens live at the top of `src/styles/global.css` —
  `--paper`, `--ink`, `--accent`, the sidebar width (`--sidebar-w`) and the font
  stacks. Change them in one place.
- **Carousel:** `src/components/Carousel.astro` (CSS scroll-snap + a little JS for
  the arrows and dots).
- **Domain:** set `site` in `astro.config.mjs` to your real URL before launch so
  canonical tags and the sitemap are correct.

## Deploy

It's a static site, so any static host works. For Cloudflare Pages: connect the
repo, framework preset **Astro**, build command `npm run build`, output directory
`dist`. Every push to the connected branch rebuilds and redeploys.
