// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';

// The public site is still prerendered to flat HTML — every page in src/pages is
// static. The only on-demand routes are Keystatic's admin UI (/keystatic) and its
// GitHub auth API (/api/keystatic/*), which must run server-side. The Cloudflare
// adapter builds those two routes into a Worker while leaving the rest static.
//
// `imageService: 'compile'` keeps Astro's build-time sharp optimization for the
// prerendered <Image> pages and disables the runtime image endpoint (sharp can't
// run on Workers) — exactly right here, since every image lives in a static page.
//
// Change `site` to your real domain before launch so canonical URLs and the
// sitemap are correct.
export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [markdoc(), sitemap(), react(), keystatic()],
  adapter: cloudflare({
    imageService: 'compile',
  }),
  image: {
    // Local images in src/assets get hashed, resized and served as modern formats
    // at build time. Keystatic writes uploads into src/assets/photos, so anything
    // added through the CMS is optimized the same way.
    responsiveStyles: true,
  },
});
