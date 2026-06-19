// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output is the right call for a portfolio: every page is prerendered to
// flat HTML, which Cloudflare Pages serves directly with no adapter or Worker.
// Change `site` to your real domain before launch so canonical URLs and the
// sitemap are correct.
export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [sitemap()],
  image: {
    // Astro optimizes images at build time with sharp. Local images in
    // src/assets get hashed, resized and served as modern formats for free.
    responsiveStyles: true,
  },
});
