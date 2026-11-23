// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` is the address the finished site is served from. The deploy workflow
// overrides `site` and `base` on the command line, so the same source builds
// correctly both at https://<account>.github.io/<repository>/ and at the lab's own domain.
export default defineConfig({
  site: 'https://www.bioinfomics.org',
  trailingSlash: 'always',
  // `true` removes only whitespace that does not change how the page renders.
  // (The v7 default, 'jsx', also strips line breaks between inline elements.)
  compressHTML: true,
  integrations: [sitemap()],
});
