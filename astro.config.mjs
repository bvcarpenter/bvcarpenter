// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pure static output: every page is prerendered to flat HTML and images are
// optimized at build time with sharp. No adapter, no Worker — deploys anywhere
// that serves static files (Cloudflare Pages, Netlify, GitHub Pages, ...).
//
// Set `site` to your real domain before launch so canonical URLs and the
// sitemap are correct.
export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [sitemap()],
  image: {
    responsiveStyles: true,
  },
});
