import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// PHOTOS — individual frames for the portfolio grid.
// Each frame is a small Markdoc file in src/content/photos. The frontmatter is
// the negative's edge data: camera, lens, film stock and exposure. The optional
// body becomes a caption. Drop the image in src/assets/photos and reference it
// relative to the file so Astro can optimize it. These files are managed through
// the Keystatic CMS (/keystatic), which writes .mdoc; hand-editing still works.
const photos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/photos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      camera: z.string().optional(),
      lens: z.string().optional(),
      film: z.string().optional(),
      shutter: z.string().optional(),
      aperture: z.string().optional(),
      iso: z.string().optional(),
      location: z.string().optional(),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
    }),
});

// PROJECTS — written pieces and photo essays. Cover image plus a Markdoc body
// you can interleave with more frames. This is the "share my projects" surface.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      cover: image(),
      location: z.string().optional(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { photos, projects };
