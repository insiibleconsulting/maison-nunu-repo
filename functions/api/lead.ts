/**
 * POST /api/lead — Cloudflare Pages Function
 *
 * Receives the fire-and-forget beacon fired when someone taps a WhatsApp CTA,
 * validates it, and forwards it to the Apps Script web app that writes the row
 * and sends the alert email.
 *
 * Its real job is to be the trust boundary. The browser is untrusted, so this
 * is where we (a) reject SKUs that aren't ours, (b) cap field lengths, and
 * (c) attach the shared secret — which must never reach the client bundle.
 *
 * NOTE: SKUS is imported from the same catalog the pages are built from, so the
 * allowlist cannot drift out of sync with what's actually on the site. The
 * catalog module deliberately has no imports of its own — pulling in anything
 * that touches import.meta.env would break this in the Workers runtime.
 */
import { SKUS } from '../../src/data/catalog';

interface Env {
  SHEET_WEBHOOK_URL?: string;
  SHEET_SECRET?: string;
}

/** The contact form submits this instead of a product SKU. */
const ENQUIRY_SKU = 'ENQUIRY';

/**
 * Trim to length and neutralise anything that could break a spreadsheet cell.
 * Control characters are replaced rather than stripped so that a newline in a
 * customer note cannot forge what looks like an extra row.
 */
function clean(value: unknown, max: number): string {
  let out = '';
  for (const ch of String(value ?? '')) {
    const code = ch.codePointAt(0) ?? 0;
    out += code < 0x20 || code === 0x7f ? ' ' : ch;
  }
  return out.trim().slice(0, max);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // 204 on every path below. The client never reads this response, and a
  // descriptive error would tell an abuser which payloads get through.
  const ok = () => new Response(null, { status: 204 });

  if (!env.SHEET_WEBHOOK_URL || !env.SHEET_SECRET) {
    // Not configured yet — the site still works and leads still reach WhatsApp.
    console.warn('lead: SHEET_WEBHOOK_URL / SHEET_SECRET not set; dropping');
    return ok();
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return ok();
  }

  const sku = clean(body.sku, 24);
  if (sku !== ENQUIRY_SKU && !SKUS.includes(sku)) {
    console.warn(`lead: rejected unknown sku "${sku}"`);
    return ok();
  }

  const payload = {
    secret: env.SHEET_SECRET,
    sku,
    label: clean(body.label, 120),
    page: clean(body.page, 200),
    referrer: clean(body.referrer, 200),
    // Present only on contact-form submissions; blank for deep-link clicks.
    name: clean(body.name, 80),
    note: clean(body.note, 600),
    country: request.headers.get('cf-ipcountry') ?? '',
    userAgent: clean(request.headers.get('user-agent'), 200),
  };

  try {
    await fetch(env.SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Logging failing must never surface to the customer — by this point they
    // are already in WhatsApp. Cloudflare's logs are where we find out.
    console.error('lead: forward to Apps Script failed', error);
  }

  return ok();
};
