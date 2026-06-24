import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each entry across both collections is a plain Markdown file: frontmatter for
// the metadata + carousel images, and the Markdown body for the scrollable text
// shown beneath the carousel. Drop images in src/assets/photos and reference
// them relative to the file so Astro optimizes them at build time.

// PORTFOLIOS — image-led galleries. The carousel is the point; text is optional.
const portfolios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolios' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().optional(),
      date: z.coerce.date(),
      // Lower numbers sort first in the sidebar; falls back to date.
      order: z.number().optional(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().optional(),
          }),
        )
        .default([]),
    }),
});

// PROJECTS — text-led pieces. Optional carousel up top, then the writing.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().optional(),
      date: z.coerce.date(),
      order: z.number().optional(),
      draft: z.boolean().default(false),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().optional(),
          }),
        )
        .default([]),
    }),
});

export const collections = { portfolios, projects };
