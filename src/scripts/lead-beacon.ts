/**
 * Fire-and-forget lead logging.
 *
 * THE RULE: this must never block or delay the WhatsApp handoff. Every CTA is
 * a real <a href> pointing at wa.me, rendered at build time. We do not call
 * preventDefault, we do not await anything, and we never navigate manually.
 * If this entire file fails to load, leads still reach WhatsApp — only the
 * spreadsheet row is lost.
 *
 * sendBeacon is the right primitive here specifically because the browser is
 * about to background the page to open WhatsApp: a normal fetch() would be
 * cancelled on unload, whereas the browser guarantees a queued beacon is sent.
 */

interface LeadPayload {
  sku: string;
  label: string;
  page: string;
  referrer: string;
}

function send(payload: LeadPayload): void {
  const body = JSON.stringify(payload);

  // Same-origin, so the application/json content type triggers no preflight.
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/lead', new Blob([body], { type: 'application/json' }));
    return;
  }

  // Older Safari. keepalive gives fetch beacon-like unload survival.
  void fetch('/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    /* telemetry is best-effort — never surface this to the customer */
  });
}

// One delegated listener for the whole site, so CTAs added later are covered
// without registering anything per element.
document.addEventListener('click', (event) => {
  const target = event.target as Element | null;
  const cta = target?.closest<HTMLAnchorElement>('[data-wa-cta]');
  if (!cta) return;

  const sku = cta.dataset.sku;
  if (!sku) return; // general enquiry CTAs carry no SKU — nothing to log

  send({
    sku,
    label: cta.dataset.label ?? '',
    page: window.location.pathname,
    referrer: document.referrer,
  });

  // Intentionally no preventDefault. The browser opens WhatsApp as normal.
});
