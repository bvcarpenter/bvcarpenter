# Field Register — a custom Astro photography portfolio

A hand-built Astro theme for a personal photography site. No page builder, no
theme engine to fight. Every layout and component is plain code you own and can
change. The public site is fully prerendered to static HTML; a built-in CMS
(**Keystatic**) adds a small Cloudflare Worker for the `/keystatic` admin and its
GitHub sign-in, so you can edit photos and projects from a browser and every save
lands as a commit on this repo.

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
npm run dev      # site at http://localhost:4321, CMS at /keystatic
npm run build    # static pages -> dist/client, CMS worker -> dist/server
npm run preview  # serve the built output
```

Node 22 (see `.nvmrc`).

## How content works

Two collections, defined in `src/content.config.ts`: **photos** and
**projects**. Each entry is a [Markdoc](https://markdoc.dev) file (`.mdoc`) —
frontmatter plus an optional body. The easiest way to add or edit entries is the
[CMS](#editing-content--the-cms-keystatic); the file format below is what it
writes, and you can always hand-edit the same files.

### Add a photo

Create a `.mdoc` file in `src/content/photos/`, drop the image in
`src/assets/photos/`, and reference it relative to that file:

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

A `.mdoc` file in `src/content/projects/`. Frontmatter holds the cover and
summary, the body is the piece itself (standard markdown works — it is valid
Markdoc). Set `draft: true` to keep one out of the build.

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

## Editing content — the CMS (Keystatic)

The site ships with [Keystatic](https://keystatic.com) wired up as a forms-based
editor at **`/keystatic`**. It runs in **GitHub mode**: you sign in with GitHub,
edit photos and projects in a UI, and pressing *Save* writes a commit to this
repo — which triggers a rebuild and deploy. No separate database or server to
run; the repo is the content store.

It edits the *same* files described above — `src/content/photos/*.mdoc` and
`src/content/projects/*.mdoc`. Uploaded images go into `src/assets/photos/` with
a path relative to the entry, so CMS-added photos get the same build-time
optimization as the originals. The field definitions live in
`keystatic.config.ts` and mirror `src/content.config.ts`; if you add a field to
one, add it to the other.

### One-time setup: the GitHub App

Keystatic authenticates through a GitHub App that you create once via its wizard:

1. Run `npm run dev` and open <http://localhost:4321/keystatic>.
2. Follow the **“Set up Keystatic”** prompt. It opens a pre-filled GitHub App
   creation page — create the app and install it on the `bvcarpenter/bvcarpenter`
   repo.
3. GitHub redirects back and Keystatic shows four values. Copy `.env.example` to
   `.env` and paste them in (`KEYSTATIC_GITHUB_CLIENT_ID`,
   `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`,
   `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`). `.env` is gitignored.
4. Restart `npm run dev`. `/keystatic` now signs you in and saves to GitHub.

For the **deployed** admin, set those same four variables on the Cloudflare
Worker (see below) and add your production URL to the GitHub App’s callback URLs
(`https://your-domain.com/api/keystatic/github/oauth/callback`). One app can list
both the localhost and production callbacks.

> Prefer to skip all the app setup and just edit on your own machine? Change
> `storage` in `keystatic.config.ts` to `{ kind: 'local' }`. The admin then reads
> and writes your local files directly with no GitHub App and no env vars — but
> it only works in `npm run dev`, not on the deployed site.

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

## Deploying to Cloudflare — kept separate from work

Because the CMS needs server-side routes, the build now targets a **Cloudflare
Worker** (via `@astrojs/cloudflare`) rather than a plain Pages upload. The Worker
serves the static pages straight from assets and only runs code for `/keystatic`
and `/api/keystatic/*`. `npm run build` produces both halves: `dist/client/`
(static HTML + images) and `dist/server/` (the Worker).

You asked to keep this fully separate from the Camera West infrastructure.
**Recommended: a separate Cloudflare account.** Cloudflare lets one login hold
multiple accounts; from the account switcher, create a new one (e.g. "Personal")
for isolated billing, tokens and dashboard, so a personal deploy never sits next
to CW production Workers or DNS zones. The repo is also a **new, separate GitHub
repository** under the same login — nothing here touches the Camera West repos.

Connect and configure (**Workers & Pages → Create → Workers → Connect to Git**,
pick this repo):

- **Build command:** `npm run build`
- **Deploy/config:** uses the adapter-generated `dist/server/wrangler.json`
- **`NODE_VERSION = 22`** build variable

Then set the runtime pieces the Worker needs (these are account-specific, which
is why they are not committed — see `wrangler.example.jsonc` for the shape):

- **Compatibility flag `nodejs_compat`** and a recent `compatibility_date` —
  Keystatic's GitHub auth uses Node APIs.
- **KV namespace bound as `SESSION`** — create one and add its binding (Astro's
  session store on Cloudflare).
- **Encrypted variables** — the same four Keystatic values from your `.env`
  (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
  `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`).

Put the personal custom domain's DNS in this same personal account so everything
personal lives in one place, and add that domain to the GitHub App's callback
URLs (see the CMS section).

Every push to the connected branch triggers a build and deploy — and so does
every *Save* in the CMS, since those are commits. Static pages mean cold loads
are just HTML and cached images; only the admin touches the Worker.
