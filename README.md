# Field Register — a custom Astro photography portfolio

A hand-built Astro theme for a personal photography site. No page builder, no
theme engine to fight. Every layout and component is plain code you own and can
change. Static output, so it deploys to Cloudflare Pages as flat HTML with no
adapter or Worker.

## The design, in one paragraph

Direction is a *quiet darkroom*: paper-white ground, warm graphite ink, the
images carry the page. Display type is **Fraunces** (self-hosted, no Google
Fonts call), body is the system grotesque, captions and data are monospace. The
one signature is the **film-edge strip** under each frame — camera, lens, film
stock and exposure printed in spaced monospace caps with a single Leica-red
registration dot, the way a lab prints the rebate edge of a negative. That red
dot is the only color on the site and never gets used for anything larger than a
marker. Light and dark are both handled via `prefers-color-scheme`.

All of it is a starting point. It is meant to be retuned.

## Run it

```bash
npm install
npm run dev      # local at http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # serve the built site
```

Node 22 (see `.nvmrc`).

## How content works

Two collections, defined in `src/content.config.ts`.

### Add a photo

Create a markdown file in `src/content/photos/`, drop the image in
`src/assets/photos/`, and reference it relative to the markdown file:

```md
---
title: First light, Tre Cime
image: ../../assets/photos/frame-01.jpg
camera: Leica M6
lens: Summicron 35mm
film: Kodak Portra 400
shutter: 1/250
aperture: "2.8"
iso: "400"
location: Dolomites, Italy
date: 2026-06-02
featured: true        # the featured frame leads the home page
---
```

Only `title`, `image` and `date` are required. Anything you leave off the
film-edge strip simply omits — a digital frame with no film stock just shows
fewer tokens. Images in `src/assets` are optimized at build (resized, hashed,
served as WebP). That is why the placeholders compress from ~160kB down to a few
kB per size.

### Add a project

A markdown file in `src/content/projects/`. Frontmatter holds the cover and
summary, the markdown body is the piece itself. Set `draft: true` to keep one
out of the build.

```md
---
title: The Dolomites, on foot and on film
summary: Eight days, two bodies, a pannier of Portra.
cover: ../../assets/photos/proj-dolomites.jpg
location: Italy
date: 2026-06-10
---

Body text in markdown. Drop images inline and they get optimized too.
```

## Pointing images somewhere else later

The scaffold keeps images local so the build is self-contained, but you are not
locked in:

- **Cloudflare R2 / external URLs.** Swap the `image: image()` field for a
  `z.string().url()` and render with a plain `<img src={...}>` instead of
  `<Image>`. You lose build-time optimization but gain a CDN-hosted library. Or
  keep `<Image>` and configure a remote image domain in `astro.config.mjs`
  under `image.domains` / `image.remotePatterns`.
- **An existing gallery API.** Fetch it at build time inside a page's
  frontmatter (`const frames = await fetch(...)`) and feed the result into the
  `Gallery` component. Because the site is static, the fetch runs once at build,
  not on every visit.

## Make it yours (fast edits)

- **Name:** `src/components/Header.astro`, `Footer.astro`, and the default title
  in `src/layouts/BaseLayout.astro`. Search the repo for `Your Name`.
- **Color and type:** all tokens live at the top of `src/styles/global.css`.
  Change `--accent`, the paper/ink values, or the font stacks in one place.
- **Domain:** set `site` in `astro.config.mjs` to your real URL before launch so
  canonical tags and the sitemap are correct.

## Deploying to Cloudflare Pages — kept separate from work

You asked to keep this fully separate from the Camera West infrastructure. Two
levels of separation, strongest first:

**Recommended — a separate Cloudflare account.** Cloudflare lets one login hold
multiple accounts. From the dashboard account switcher, create a new account
(e.g. "Personal"). This gives you isolated billing, isolated API tokens, and a
dashboard where a personal deploy can never sit next to CW production Workers,
Pages or DNS zones. Then: **Workers & Pages → Create → Pages → Connect to Git**,
authorize the same GitHub login, pick the new repo, and set:

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION = 22`

Put the personal custom domain's DNS in this same personal account so everything
personal lives in one place.

**Simpler — a separate Pages project in your existing account.** Isolated per
project (its own build, domain and settings) but shares billing and dashboard
with Camera West. Fine if you would rather not manage two logins, but it does
not isolate access the way a separate account does.

Either way: the repo is a **new, separate GitHub repository** under the same
GitHub login. Nothing here touches the Camera West repos.

Every push to the connected branch triggers a build and deploy. Static output
means cold loads are just HTML and cached images.
