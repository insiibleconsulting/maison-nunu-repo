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

  vite: {
    server: {
      // DEV ONLY — has no effect on `astro build` or on what Cloudflare serves.
      //
      // Vite rejects requests whose Host header it doesn't recognise, as a
      // DNS-rebinding defence. A Cloudflare tunnel arrives with the tunnel's
      // hostname, so the dev server refuses it until that host is allowed.
      //
      // The leading dot is a subdomain wildcard. It is deliberate: a quick
      // tunnel mints a NEW random subdomain every restart, so pinning the
      // current one would break on the next `cloudflared` run.
      //
      // Scoped to the tunnel domain rather than `true`, which would disable
      // the check for every host.
      allowedHosts: ['.trycloudflare.com'],
    },
  },
});
