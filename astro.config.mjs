import { defineConfig } from 'astro/config';

// Static output. Cloudflare Pages serves the built `dist/` directory,
// and `functions/` is picked up automatically as Pages Functions —
// no adapter needed, which is what keeps this on the free tier.
export default defineConfig({
  site: 'https://maisonnunu.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
