# BioinfOMICS Lab website

Source code of the website of the BioinfOMICS Lab, China Medical University, Taiwan.

Website: https://bioinfomics.github.io/lab-website/

## Built with

- [Astro](https://astro.build/), generating a static site
- GitHub Pages, deployed by GitHub Actions

## Getting started

Requires Node.js 22.23.4 or later.

```bash
npm install
npm run dev
```

Open http://localhost:4321. Pages reload as files are saved.

| Command | Action |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Serve the built site locally |

## Editing content

All content lives in JSON files under `src/data/`; pages read from them at build time.

| File | Content |
|---|---|
| `site.json` | Lab name, contact details, address |
| `research.json` | Lab overview and research fields |
| `tools.json` | Databases and web tools, with their releases |
| `publications.json` | Publications |
| `people.json` | Members (photos in `src/assets/people/`) |
| `photos.json` | Lab photos (images in `src/assets/lab/`) |

The data is validated against the schemas in `src/data/index.ts`; `npm run build` fails and names the entry if a file does not match.

Remove embedded metadata (camera, location, software) from photos before committing them.

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages. Progress is shown in the [Actions](https://github.com/BioinfOMICS/lab-website/actions) tab.

## Project structure

```text
src/
  data/         content (JSON) and its schemas
  pages/        one file per page
  components/   shared components
  layouts/      page frame
  lib/          helpers
  styles/       global styles and design tokens
  assets/       images, optimized at build time
public/         files copied as-is (icons)
.github/        deployment workflow
```
