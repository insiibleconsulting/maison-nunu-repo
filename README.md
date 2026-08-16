# Maison Nunu

Static Astro site that routes product enquiries into the client's **WhatsApp Business app** via
`wa.me` deep links, with a free Google Sheets + email lead log alongside.

- **Architecture doc:** https://claude.ai/code/artifact/f86e354d-f19d-4139-ac49-77f516b3a5d5
- **Stack:** Astro 7 (static) · Cloudflare Pages · Pages Functions · Google Apps Script · Google Sheets
- **Currency:** XAF (Central African CFA franc), formatted `fr-CM`. Prices are stored
  as whole francs — XAF is zero-decimal, so there is no minor-unit conversion.
- **Running cost:** the domain only. Every other component is on a permanent free tier.

## Why deep links and not the WhatsApp Cloud API

A number registered on the Cloud API **can no longer be used in the WhatsApp Business app**. The brief
requires the client to answer enquiries from their phone, so the API is off the table for this number.
Deep links also mean no Meta verification, no per-message billing, and no webhook server.

The tradeoff: no chatbot. Most of that gap is closed for free by the WhatsApp Business app's own
greeting message, away message, quick replies and labels — see "Client setup" below.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run check    # TypeScript + Astro diagnostics
```

`astro dev` runs as a background daemon. Use `npx astro dev status`, `npx astro dev logs`, and
`npx astro dev stop` to manage it.

## Configuration

### 1. The WhatsApp number — `PUBLIC_WA_NUMBER`

Set in Cloudflare Pages → Settings → Environment variables (Production **and** Preview).

**Format rules — these fail silently if you get them wrong.** WhatsApp opens with "phone number
shared via url is invalid" and the lead is simply lost:

- digits only — no `+`, no spaces, no dashes
- country code first
- **no leading zero** on the national part

```
+27 82 123 4567     ->  27821234567
0803 456 7890 (NG)  ->  2348034567890
```

**Until this is set, the site runs in placeholder mode:** every enquiry button renders as a disabled
control and a warning banner appears sitewide. This is deliberate — no fake fallback number is
shipped, because a plausible-looking placeholder would silently send every customer enquiry to a
stranger and nothing would visibly break.

### 2. The lead log — `SHEET_WEBHOOK_URL` and `SHEET_SECRET`

Encrypted secrets in Cloudflare Pages. Never prefix these `PUBLIC_` — that would publish them into
the client bundle. See `apps-script/Code.gs` for the full Google-side setup.

Generate the secret with `openssl rand -hex 24`.

If these are unset the site still works perfectly; leads reach WhatsApp and only the spreadsheet row
is skipped.

## Updating content

| To change | Edit |
|---|---|
| Products, prices, SKUs, photographs | `data/products.csv` — a spreadsheet |
| Collections, currency, helpers | `src/data/catalog.ts` — by hand, outside the generated block |
| Brand name, email, hours, tagline | `src/config/site.ts` |

`src/data/catalog.ts` is **generated** from the CSV plus the photographs on disk. Product pages, the
shop grid, the WhatsApp message text and the Pages Function's SKU allowlist all derive from it, so
none of them can drift out of sync with each other.

### Adding a piece

```bash
npm run product:add -- rings ~/Desktop/IMG_1234.jpg      # one photo
npm run product:add -- watches ~/Desktop/new-shoot/      # a whole shoot
```

This mints the next free SKU for the collection, re-encodes the photo to 800×1000 (the frame is
`aspect-ratio: 4/5`, `object-fit: cover`), writes it to `public/products/<sku>.jpg`, and appends a
**draft** row to the CSV.

Draft rows are invisible to the site. The SKU is reserved and the photo is in place, but nothing
renders until you fill in the price and copy and set `status` to `real`. That is what makes it safe
to empty a whole shoot into the repo before any of it has been written up.

Then:

```bash
npm run catalog        # CSV + photos -> catalog.ts
npm run catalog:check  # the gate; also runs automatically on npm run build
```

### The columns

| Column | Notes |
|---|---|
| `sku` | Minted for you. Never edit, never reuse — see below. |
| `slug` | The URL segment. **Frozen once set** — changing it breaks links already sent over WhatsApp. |
| `price` | Whole francs, digits only. XAF has no centime, so `1450.00` would render 100× too cheap. |
| `details` | Pipe-separated: `Face 11mm × 9mm \| Sizes G–U` |
| `featured` / `madeToOrder` | `yes`, or leave empty |
| `status` | `draft` (hidden) · `placeholder` (live, but invented copy) · `real` (client-confirmed) |
| `notes` | Never reaches the site. For you. |

Row order is the display order. Move a row in the spreadsheet and the shop grid follows.

**Photographs are matched by filename, not by a path in the CSV.** `RNG-01` ⇢ `rng-01.jpg`, always.
A published piece with no photo on disk gets `image: null` and renders the line-art placeholder
marked "IMAGE PENDING", so a missing photograph is visible rather than broken. Dropping the file in
later needs no edit anywhere.

**SKUs are permanent.** They are the reference the client reads in WhatsApp and the key in the lead
spreadsheet, so reusing one silently repoints historical lead data at the wrong product. Deleting a
row appends its SKU to `data/retired-skus.txt` automatically, and the gate refuses to build if a
retired code ever reappears.

### What the gate catches

`npm run catalog:check` runs before every build and blocks it on: a duplicate or retired SKU, a SKU
whose prefix contradicts its collection, a slug collision, a price that is not whole francs, missing
copy, a photograph with no row behind it, a collection missing its line art, and — the one that
makes the rest trustworthy — `catalog.ts` having drifted from the CSV.

It warns without blocking on states that are legitimately mid-workflow: a piece still awaiting its
photograph, copy not yet confirmed by the client, an oversized image.

## Deploying to Cloudflare Pages

1. Connect this repo in Cloudflare Pages.
2. **Build command `npm run build`, build output directory `dist`.** Both, not one.
3. Add the environment variables above.
4. `functions/` is picked up automatically as Pages Functions — no adapter, no config.
5. Run `git config core.hooksPath .githooks` in your clone — it activates the large-file guard,
   which git will not enable on its own.

**If step 2 is skipped the deploy fails with a misleading error.** With no build command, Pages
uploads the repository root instead of the built site and rejects it for containing a file over
25 MiB — naming `assets/Brand style guide.pdf`. The PDF is not the problem; the missing build
command is. A correct build produces `dist/` at ~8.5MB with no PDF in it.

**Do not add a `wrangler.toml`/`wrangler.jsonc` to fix this.** For Pages that file becomes the source
of truth and disables the dashboard fields it covers, including the encrypted secrets in step 3.

Free-tier limits that apply: unlimited static requests and bandwidth; 500 builds/month; Pages
Functions draw from the Workers quota of 100,000 requests/day.

## Before launch

- [ ] Set `PUBLIC_WA_NUMBER` and confirm the banner disappears
- [ ] **Test a deep link on a real iPhone, a real Android, and desktop.** This is the one failure
      mode that loses leads silently, and the cheapest to prevent
- [ ] Deploy the Apps Script web app (Execute as: Me · Who has access: Anyone) and run `setupSheet()`
- [ ] Confirm a test click writes a row and sends an email
- [ ] Add a Cloudflare Rate Limiting rule on `/api/lead` (one rule is included free)
- [ ] Turn on Cloudflare Web Analytics — cookieless, so no consent banner needed
- [ ] Replace placeholder catalog with the client's real pieces and prices
      (currency is set: XAF / fr-CM, rendering `145 000 FCFA`)
- [ ] Fill in the business details in `src/pages/privacy.astro`

## Client setup — free, inside the WhatsApp Business app

Configure with the client; this is what replaces the chatbot we deliberately didn't build.

- **Greeting message** — auto-sends on first contact, sets a reply-time expectation
- **Away message** — covers nights and weekends
- **Quick replies** — pricing, delivery, sizing
- **Labels** — New lead / Quoted / Paid, mirroring the sheet's Status column
- **Catalog** — send a product card instead of retyping details
- **Business profile** — hours, location, link back to this site

## Known limits

**A deep-link click captures no contact details.** The browser has no access to the customer's phone
number or name. The spreadsheet is an *intent log* — what was clicked, when, from which page — not a
contact database. The contact form (`/contact/`) is the only place a name is captured; it is
deliberately the only page with that friction.

**Email alerts cap at 100 recipients/day** on a consumer gmail.com account (1,500 on Workspace). If
the client approaches that, switch `notify_()` in `Code.gs` to a daily digest on a time-driven
trigger rather than paying for anything.
