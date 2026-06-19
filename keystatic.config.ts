import { config, fields, collection } from '@keystatic/core';

// Keystatic admin config. This drives the form-based editor at /keystatic and is
// the single source of truth for what fields each entry has. It is deliberately a
// mirror of src/content.config.ts: every field here maps to the same frontmatter
// key Astro reads, and the rich body maps to the file's Markdoc content. Edit one,
// keep the other in step.
//
// Storage is GitHub mode: saves in the admin UI become commits/PRs on this repo,
// which is what lets the hosted admin work without a database. The GitHub App
// credentials live in environment variables (see .env.example), never in git.
//
// Images: uploads are written into src/assets/photos and referenced with a path
// relative to the entry file (../../assets/photos/...), the exact shape Astro's
// content `image()` helper expects — so anything added through the CMS still gets
// build-time optimization, just like the originals.

export default config({
  storage: {
    kind: 'github',
    repo: 'bvcarpenter/bvcarpenter',
  },
  ui: {
    brand: { name: 'Field Register' },
  },
  collections: {
    photos: collection({
      label: 'Photos',
      path: 'src/content/photos/*',
      slugField: 'title',
      format: { contentField: 'caption' },
      columns: ['title', 'date'],
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { length: { min: 1 } },
          },
        }),
        image: fields.image({
          label: 'Image',
          directory: 'src/assets/photos',
          publicPath: '../../assets/photos/',
          validation: { isRequired: true },
        }),
        camera: fields.text({ label: 'Camera' }),
        lens: fields.text({ label: 'Lens' }),
        film: fields.text({ label: 'Film stock' }),
        shutter: fields.text({ label: 'Shutter speed' }),
        aperture: fields.text({ label: 'Aperture', description: 'Just the number, e.g. 2.8' }),
        iso: fields.text({ label: 'ISO' }),
        location: fields.text({ label: 'Location' }),
        date: fields.date({
          label: 'Date',
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({
          label: 'Featured',
          description: 'The featured frame leads the home page.',
        }),
        caption: fields.markdoc({ label: 'Caption' }),
      },
    }),
    projects: collection({
      label: 'Projects',
      path: 'src/content/projects/*',
      slugField: 'title',
      format: { contentField: 'content' },
      columns: ['title', 'date'],
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { length: { min: 1 } },
          },
        }),
        summary: fields.text({
          label: 'Summary',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'src/assets/photos',
          publicPath: '../../assets/photos/',
          validation: { isRequired: true },
        }),
        location: fields.text({ label: 'Location' }),
        date: fields.date({
          label: 'Date',
          validation: { isRequired: true },
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts are kept out of the build.',
        }),
        content: fields.markdoc({ label: 'Body' }),
      },
    }),
  },
});
