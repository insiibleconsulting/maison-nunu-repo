# CLAUDE.md — session handoff

Read this before touching anything. It records **why** the code is the way it is, which is the part
that isn't recoverable from reading the source.

`README.md` covers setup, deployment and configuration — don't duplicate it here. This file covers
decisions, invariants, current state, and what's still unknown.

---

## What this is

A static Astro site for **Maison Nunu**, an independent jewelry and accessories retailer in
**Cameroon**. There is no checkout. Every piece links straight into the client's **WhatsApp Business
app** via a `wa.me` deep link, with a free Google Sheets + email lead log running alongside.

Client repo: `insiibleconsulting/maison-nunu-repo`
Architecture doc: https://claude.ai/code/artifact/f86e354d-f19d-4139-ac49-77f516b3a5d5

**Everything runs on permanent free tiers.** The domain is the only cost. Any proposal that
introduces a paid service needs to be flagged as a change of premise, not slipped in.

---

## Status as of 31 July 2026

**Merged to `main`** via PR #1. `main` is the working branch — `build/astro-whatsapp-site` is spent
and can be deleted.

Built and verified:

- 73 pages — home, shop (category + price filter), 65 product pages, gifts, guide, about, contact, privacy, 404
- Deep-link generation, lead beacon, Pages Function, Apps Script lead logger
- Full visual identity, WCAG-checked
- `astro check` clean across 29 files · `npm audit` 0 vulnerabilities

**Never deployed.** No Cloudflare Pages project exists yet.

### Second session, 31 July 2026 — what changed

- **Real WhatsApp number received:** `+237 6 79 47 18 81` -> `237679471881`. It lives in a
  gitignored `.env` for local work and is **not** in any tracked file. Cloudflare Pages still needs
  it set separately.
- **Eight real collections confirmed by the client** and wired in — see "Collections" below.
- **Fixed: the hero conversation played backwards.** See "The nth-of-type trap".
- **`/api/lead` executed for the first time**, under `wrangler pages dev`. Previously the Function
  had never actually run. Results under "Verifying the Pages Function".
- **`vite.server.allowedHosts` added** to `astro.config.mjs` so a Cloudflare tunnel can reach the
  dev server for phone testing.

**Still untested against a real handset.** Everything below confirms the link is *built* correctly;
only a phone confirms WhatsApp *opens* correctly. That remains the top pre-launch risk.

### Third session, 1 August 2026 — the catalog pipeline

The catalog stopped being hand-written. `data/products.csv` + the photographs on disk now generate
the `PRODUCTS` array, and a gate runs before every build. See invariant 5a.

- `scripts/lib/catalog-lib.mjs` · `build-catalog.mjs` · `check-catalog.mjs` · `add-product.mjs` ·
  `bootstrap-csv.mjs` (one-time, already run)
- `data/products.csv` — 65 rows, all `status: placeholder`
- `data/retired-skus.txt` — `ACC-01`, `ACC-02`, appended to automatically from here on
- `npm run build` is now `catalog:check && astro build`
- `sharp` added as a devDependency. It was already present as an Astro transitive, which would have
  vanished on a clean `npm ci`; the scripts degrade gracefully if it is missing but the pipeline
  wants it.

**The bootstrap reproduced all 65 hand-written product literals byte for byte** — the only diff was
two commentary blocks, which moved into the doc comment above `PRODUCTS`. That equality is the
evidence the generator is faithful; if you ever change the emitter, reproduce that check against
`git show` of this commit before trusting it.

Also: `bro-04.jpg` (275KB) and `rfh-07.jpg` (268KB) were re-encoded to 800×1000/q75 — the new weight
check found them. Product photography is now 5.9MB across 65 files.

### Fourth session, 14 August 2026 — the brief changed underneath the copy

**Maison Nunu resells; it does not manufacture.** The client said so directly, reversing the premise
the first build was written on. Every "we make / hand-finished by us / if we made it" claim is gone —
see **invariant 5c**, which records the exact phrases that must not come back and the ones that
legitimately survived. This was not a tone pass: *"if we made it, we'll help you repair it"* is a
promise a customer can hold the business to.

The rest of the session, in the order it happened:

- **Real logo pack installed.** `assets/Final logo/` arrived with four lockups. Header and footer both
  use `logo-horizontal.webp`; favicons are generated from the square icon. See "Brand assets" below.
- **The site switched to American spelling** — `jewelry`, not `jewellery` — because the logo artwork
  reads `JEWELRY & ACCESSORIES` and the two sat inches apart in the header. 44 replacements across
  10 files, including `data/products.csv` (WCH-02's description) which had to go through the pipeline
  rather than being hand-edited in `catalog.ts`. **This reversed the previous house convention**,
  which was British throughout. `polarised` (21×) and `grey` (2×) are still British — deliberately
  left, flagged to the user, not yet decided.
- **Footer build credit** added: "Powered by Insiible Consulting", burgundy, the site's only
  outbound link.
- **`Made to order` renamed to `Ordered in`** everywhere it renders. The `madeToOrder` field name is
  unchanged — see invariant 5c for why.

Then, after reading the client's **brand style guide** (`assets/Brand style guide.pdf`) and taking
structural cues from Pandora:

- **The dark half of the identity was built and then reverted.** The footer moved onto the guide's
  midnight blue with the guide's real gold as its accent; the user preferred the oyster ground and it
  was put back. The analysis that came out of it still stands and is the useful part — see "The brand
  guide, and why the site only half-followed it". The five tokens (`--midnight`, `--gold`, `--beige`
  and two support tones) remain defined in `global.css` but are **referenced by nothing**.
- **A collections bar** under the masthead, listing all eight collections. Sixty-five products behind
  one "Shop" link meant the range was invisible. No JavaScript; scrolls sideways under 700px.
- **Two new pages**: `/gifts/` (budget-first, for people buying for someone else) and `/guide/`
  (care & sizing, drawn from the materials actually in the catalog).
- **`/shop/` gained a price filter** — `?p=under-75|under-120|under-200|over-200`, combinable with
  `?c=`. Added because the gift bands linked somewhere that didn't filter, which is worse than not
  linking at all. Bands hold 11 / 22 / 21 / 11 of the 65.
- **Homepage category links became image tiles**, and "This season" now shows **one featured piece
  per collection** rather than all thirteen flagged rows — it had become a second shop page.

---

## Invariants — do not break these

These each encode a decision that cost real thought. Changing one is a conversation with the user,
not a refactor.

### 1. Never ship a fallback WhatsApp number

`IS_PLACEHOLDER_NUMBER` in `src/config/site.ts` disables every CTA and shows a sitewide banner when
`PUBLIC_WA_NUMBER` is unset. **Do not "helpfully" add a default number to make the buttons work.** A
plausible-looking placeholder can ship silently and route every customer enquiry to a stranger, with
nothing visibly broken. Failing loudly is the whole point.

### 2. Deep links, not the WhatsApp Cloud API

A number registered on the Cloud API **can no longer be used in the WhatsApp Business app**. The
client answers from their phone, so the API is ruled out for this number. This is settled — don't
re-propose a chatbot or Cloud API integration without raising the tradeoff explicitly.

What replaces the chatbot is free and lives in the WhatsApp Business app itself: greeting message,
away message, quick replies, labels, catalog. See README "Client setup".

### 3. Logging must never block the handoff

Every CTA is a real `<a href>` with the `wa.me` URL rendered at build time, so it works with
JavaScript disabled. `src/scripts/lead-beacon.ts` fires `navigator.sendBeacon` and **never calls
`preventDefault`**. If the Function, Apps Script or Sheet is down, the lead still reaches WhatsApp
and only the spreadsheet row is lost. Priority is: handoff first, telemetry second, always.

The one exception is the contact form, which awaits the log for up to 1.2s because it's the only
place a name is captured — and even that is `Promise.race`d against a timeout so a dead endpoint
can't strand anyone.

### 4. `encodeURIComponent`, never `URLSearchParams`

`URLSearchParams` form-encodes spaces as `+`, which WhatsApp renders as literal plus signs in the
message box. `encodeURIComponent` gives `%20`. This appears in `src/lib/whatsapp.ts` and again in
the inline script in `src/pages/contact.astro` — both must stay correct.

### 5. `src/data/catalog.ts` is the single source of truth *for the site*

Product pages, shop grid, WhatsApp message text **and the Pages Function's SKU allowlist** all derive
from it. `functions/api/lead.ts` imports `SKUS` from it directly so the allowlist cannot drift.

That import is why **`catalog.ts` must have no imports of its own**. Pulling in anything that touches
`import.meta.env` (e.g. `config/site.ts`) breaks the Function in the Workers runtime. The generated
block emits plain literals for exactly this reason — keep it that way.

### 5a. The `PRODUCTS` array is GENERATED — don't hand-edit it

Added 1 August 2026. Source of truth moved up one level:

```
data/products.csv  +  public/products/<sku>.jpg   ->   src/data/catalog.ts
```

Everything between `// <<< generated from data/products.csv` and `// >>> end generated` is written by
`scripts/build-catalog.mjs`. Everything outside those markers — `Category`, `Product`, `CATEGORIES`,
`formatPrice` — is still hand-written, because that is where the decisions live.

`npm run catalog:check` runs before `astro build` and **fails the build if the block has drifted from
the CSV**, so a hand-edit inside it cannot ship. If you find yourself editing a product literal, you
want the CSV instead.

Why a CSV and not a CMS: the client answers enquiries from a phone and everything runs on permanent
free tiers. A spreadsheet needs no service, no account and no build minutes, and it hands over to a
non-technical editor without a rewrite. The scripts are deliberately dependency-free apart from
`sharp` (image re-encoding), which Astro already pulled in.

**The photo filename IS the link.** `image` is derived from the SKU, never stored — `RNG-01` ⇢
`/products/rng-01.jpg` if that file exists, `null` if it does not. `null` renders the "IMAGE PENDING"
line art, so a missing photograph is visible rather than broken, and dropping the file in later needs
no edit anywhere. Do not reintroduce a hand-written image path.

`status` gates publication: `draft` rows are held out of the generated block entirely (SKU reserved,
photo in place, site unaffected), `placeholder` means the copy is still invented, `real` means the
client confirmed it. The check prints the placeholder count on every run — that number reaching zero
is the content half of launch readiness.

### 5b. Collections

The client's eight, confirmed 31 July 2026, in the order they wrote them — that order drives the
shop filter row and the footer:

**Earrings · Bracelets · Necklaces · Watches · Rings · Raffia bags & hats · Sunglasses · Brooches**

`accessories` was a placeholder bucket from the first build and is **retired**, along with its two
invented pieces. Category ids are `earrings, bracelets, necklaces, watches, rings, raffia,
sunglasses, brooches` — `raffia` is deliberately short because it appears in URLs as `/shop/?c=raffia`.

Adding a category is a **compile error** until you also add its line art to `ART` in
`src/components/ProductImage.astro`, which is typed `Record<Category, string>`. That coupling is
intentional: a category with no art renders an empty frame. Let the typechecker tell you.

### 5c. Maison Nunu sells; it does not manufacture

Confirmed by the client 14 August 2026, and it **reversed the original brief**. The first build was
written as a maker — "hand-finished by us", "made in small runs", "if we made it, we'll help you
repair it". All of that was false and has been rewritten.

The line to hold: **describing how a piece was made is fine; claiming Maison Nunu made it is not.**
"Hand stamped", "hand-enamelled", "woven by hand" all describe the product and stay true whoever
sells it. "Our house signet", "every stone we set", "the cheapest thing we make" are authorship
claims and must not come back.

Things a retailer legitimately does, and which therefore survived the rewrite: *we recommend*, *we
photograph each one before it ships*, *we choose*, *we can source it*.

`madeToOrder` is still the field name in `data/products.csv` and `Product`, but it renders as
**"Ordered in"** — the wait is a supplier lead time, not bench time. The field wasn't renamed
because that would cost a CSV column change and a regeneration for one label in `ProductCard.astro`.

This is a promise-shaped invariant, not a style one: provenance claims about jewelry are the kind of
thing a customer can hold the business to.

### 6. SKUs are permanent

The SKU is the ref code the client reads in WhatsApp and the key in the lead spreadsheet. Reusing one
for a different piece silently repoints historical lead data at the wrong product.

This is now enforced rather than remembered. `data/retired-skus.txt` is the register;
`build-catalog.mjs` appends to it automatically whenever a row leaves the CSV, `product:add` skips
retired numbers when minting, and `catalog:check` fails the build if a retired code reappears. **Never
delete a line from that file** — it is the only record that a number was ever spent.

**Retired, never to be reissued:** `ACC-01` (Silk Hair Scarf), `ACC-02` (Travel Jewelry Roll).
Prefixes in use: `EAR BRC NCK WCH RNG RFH SUN BRO`. The prefix→collection map lives in
`scripts/lib/catalog-lib.mjs` and is checked against `CATEGORIES` and against `ART` in
`ProductImage.astro`, so a collection can no longer exist in one of the three and not the others.

### 7. XAF is zero-decimal

`price` is stored as **whole francs**, not minor units. There is no `/100` anywhere and there must
not be — XAF has no centime in circulation, and ICU already supplies 0 fraction digits. Adding a
minor-unit conversion would render every price 100× too low.

Locale is `fr-CM` deliberately: it renders `145 000 FCFA` with the unit trailing, which is how prices
are written in Cameroon. `en-CM` gives `FCFA 145,000`, which nobody there writes.

### 8. Secrets are never `PUBLIC_`

`PUBLIC_WA_NUMBER` is public by design (it ends up in every link). `SHEET_WEBHOOK_URL` and
`SHEET_SECRET` are runtime-only, read inside the Pages Function. Prefixing either `PUBLIC_` would
publish it into the client bundle.

---

## Design system

Direction: **the jeweler's bench, not the jewelry advertisement.**

> **The premise shifted, the direction survived.** This was originally justified by Maison Nunu
> being a maker. They are not — they resell other manufacturers' pieces (confirmed by the client,
> 14 August 2026). The restraint still earns its place, but for a different reason: an independent
> reseller competes on *taste and advice*, and a quiet, considered ground is what makes a curated
> selection read as chosen rather than merely listed. Don't re-justify it with craft language.

- **Accent is burgundy** — jeweler's rouge, the polishing compound worked at the bench. The user
  chose this over an earlier verdigris green.
- **Ground is a neutral oyster**, deliberately *not* cream. Cream + serif + warm accent is the most
  templated palette on the web; the brief deserves better. It's also not the cool grey-green an
  earlier pass used — under a red accent that reads as a complementary clash.
- **No gold.** Gold product photography reads *as gold* against a neutral ground and vanishes against
  a gold-toned one. Maison Nunu is an independent shop, not a luxury house.
- **Type:** Fraunces (variable, `WONK`/`SOFT` dialled up so it reads hand-cut) + Archivo.
  **Self-hosted via Fontsource, never Google's CDN** — that would leak visitor IPs to a third party
  and drag the privacy page into territory it doesn't need to cover.
- **Signature element:** `src/components/MessagePreview.astro` renders the literal message about to
  be sent, as a chat bubble. The hero is a three-bubble exchange. This is the one thing the site is
  meant to be remembered by — keep everything around it quiet.
- **Single committed light theme.** Product photography needs one consistent ground. `color-scheme:
  light` is declared so native controls don't render dark on a dark OS.

### The brand guide, and why the site only half-followed it

`assets/Brand style guide.pdf` (10 pages, Aug 2026) is the client's real identity. The site was built
before anyone read it, and matched it by luck in one place and missed it in three:

| | Guide | Site | |
|---|---|---|---|
| Burgundy | `#7a2036` | `#7a2036` | identical — lucky |
| Soft beige | `#ede9e4` | `--oyster` `#eae7e5` | near-identical |
| Gold | `#c89a6a` | `--brass` `#755417` | much darker |
| Midnight blue | `#1a222d` | **absent** | tried as a footer 14 Aug, reverted |
| Typeface | Playfair Display | Fraunces + Archivo | **still divergent** |

**The gold is the important one, and the drift was not laziness.** `#c89a6a` scores **2.06:1** on the
oyster ground — it fails even the 3:1 bar for interface elements, let alone body text. `--brass`
exists as the accessible stand-in for gold on light surfaces, and it should stay.

But look at how the guide uses gold: on the midnight-blue business card and letterhead, never on
beige. On `#1a222d` it is **6.32:1** and passes comfortably. So the guide's actual system is:

> **Burgundy accents light surfaces. Gold accents dark ones.**

The site has only ever built the light half. A midnight footer was tried on 14 August and reverted
at the user's request, so **there is currently no surface on which `--gold` may be used** — the site
uses `--brass` throughout. Two rules that follow from the arithmetic, for whenever a dark surface is
next attempted:

- **Never put `--gold` on a light background** — it is decorative there at best.
- **Never put `--burgundy` on `--midnight`** — that pair is **1.59:1**, invisible. This bit during
  the experiment: the build credit is burgundy on the oyster footer and had to become gold when the
  footer went dark, then back again on revert.

**Typography is still divergent and was left deliberately.** The guide names Playfair Display for
every role including body copy — that is a print ideal; Playfair's hairline strokes at 16px hurt
readability on screen. Switching headings to Playfair is a live option the user has not taken.

### Brand assets — added 14 August 2026

Sources live in `assets/Final logo/` (four lockups: Wording, Horizontal, Vertical, Icon). **Ignore
the SVGs** — every one is base64 raster inside an SVG wrapper, so they carry no vector benefit and
cost roughly 3× the WebP. Use the PNGs for web.

**True vectors do exist**: `.ai` and `.eps` alongside each lockup, plus layered `.psd`. Those are the
print masters — use them for signage, packaging and anything that scales. There is also
`assets/Brand style guide.pdf` (10 pages) and `favicon_io.zip`.

Deployed derivatives, all generated with `sharp` from the PNGs:

| File | Size | Where |
|---|---|---|
| `public/brand/logo-horizontal.webp` | 1200×289, 53KB | header **and** footer — one fetch serves both |
| `public/favicon-16.png` · `favicon-32.png` | 1–2KB | browser tabs |
| `public/apple-touch-icon.png` | 180×180, 15KB | iOS home screen |

**That is the whole list** — `public/` carries four non-product images, 69KB. Everything unused was
removed 15 August. Any other variant is one command away from `assets/Final logo/`:

```bash
node -e "require('sharp')('assets/Final logo/Vertical/Vertical logo.png')
  .resize({width:600}).webp({quality:80}).toFile('public/brand/logo-vertical.webp')"
```

**Why the source is 1200px and not 1000px:** the footer renders the lockup at 96px, and sharp 3×
retina needs 96 × 3 × 4.149 = 1195px of width. The header alone would only need 1000px. **If either
render height grows, regenerate the asset or it silently upscales** — on a logo that shows as soft
edges exactly where it matters most.

Sizing is deliberate: the header renders the lockup at 80px tall (54px under 700px), so 1000px wide
covers 3× retina exactly. The supplied file was 1541px / 92KB — more than 2× the bytes for pixels
nobody sees, on the critical path of every page. The footer uses the same file at 60px.

Favicons are **PNG, not SVG**, for the same reason the SVGs were rejected above.

**The logo says `JEWELRY`** — American. The site was switched to match (see the fourth-session note).
The mark is artwork, so the site moved, not the logo.

**Superseded artwork is archived, not deleted.** The previous logo (`Logo 1`, `Logo 1a`,
`Logo 1c (palette-matched)`, `Logo for website`) lives in `assets/Superseded logo/`. It was never
committed to git and existed nowhere else, so deleting it would have destroyed the only copies —
it was moved out of `public/` instead, where it had been deploying unused. `public/favicon.svg`
(the hand-drawn "M") *was* deleted; it is recoverable from commit `068537d`.

### The nth-of-type trap — fixed 31 July 2026, don't reintroduce it

The hero bubbles are staggered by `animation-delay` in `global.css`. They were selected with
`:nth-of-type()`, which counts by **tag name** — and `.hero__thread`'s first child is *also* a div
(`.hero__thread-head`). Every rule was therefore off by one: `:nth-of-type(1)` matched nothing, and
the third bubble matched no rule at all, inheriting `delay: 0`. With `animation-fill-mode: backwards`
pinning the others at opacity 0, **the conversation played 3 -> 1 -> 2** — the reply appeared before
the question it answers, alone, for about 700ms.

It is `:nth-child(2|3|4)` now, offset by one for the thread head.

Why it survived the first build's review: it **settles correctly**. A static screenshot at 2.5s and
any amount of `curl` on the built HTML look perfect. Only the first ~1.7s is wrong. Catching it
needs opacity sampled over time in a real browser:

```js
// with a page open on / — sample during the animation, not after
for (const t of [100, 300, 500, 800, 1300, 1700])
  console.log(t, await page.evaluate(() =>
    [...document.querySelectorAll('.hero__thread .msg')]
      .map((e) => getComputedStyle(e).opacity)));
// correct: bubble 1 rises first, then 2, then 3
```

**Generalise the lesson:** any `:nth-of-type` inside a container holding mixed-purpose children of
the same tag is suspect. Prefer `:nth-child` and comment the offset.

### If you change any colour, re-run the contrast check

The palette was derived by computation, not eye. Every pair passes WCAG AA (15/15). Re-run this and
fix any failure before committing:

```bash
python3 - <<'PY'
def lin(c):
    c/=255
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def L(h):
    h=h.lstrip('#'); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
def ratio(a,b):
    la,lb=L(a),L(b); hi,lo=max(la,lb),min(la,lb)
    return (hi+0.05)/(lo+0.05)
G='#eae7e5'; S='#f4f2f1'; R='#fcfbfa'; B='#7a2036'
pairs=[("ink on oyster",'#171315',G,4.5),("ink-soft",'#3a3335',G,4.5),
 ("muted",'#665d5f',G,4.5),("faint",'#615759',G,4.5),
 ("burgundy on oyster",B,G,4.5),("burgundy-deep",'#5f1a2b',G,4.5),
 ("white on burgundy",'#ffffff',B,4.5),("brass",'#755417',G,4.5),
 ("error on oyster",'#9c2b20',G,4.5),("error on raised",'#9c2b20',R,4.5),
 ("muted on surface",'#665d5f',S,4.5),("ink-soft on bubble",'#3a3335',R,4.5),
 ("faint on surface",'#615759',S,4.5),
 ("line-interactive",'#7d7376',G,3.0),("focus ring",B,G,3.0),
 ("collections bar link",'#665d5f','#f4f2f1',4.5)]
fails=0
for n,fg,bg,need in pairs:
    r=ratio(fg,bg); ok=r>=need
    if not ok: fails+=1
    print(f"{n:<24}{r:>6.2f}:1 need {need} {'PASS' if ok else '*** FAIL ***'}")
print(f"\n{fails} failure(s)")
PY
```

`--line-interactive` exists specifically because WCAG 1.4.11 requires 3:1 on borders that *identify a
control*. Use it on inputs, filter pills and outline buttons only; decorative rules stay light.

---

## Verifying the deep link end to end

The single highest-consequence failure mode: a malformed number fails **silently** — WhatsApp opens
with "phone number shared via url is invalid" and the lead is gone. Always verify after touching
`whatsapp.ts`, `site.ts`, or the catalog:

```bash
# 555-01xx is the reserved fiction range, so this can't be anyone's real line.
PUBLIC_WA_NUMBER="15555550100" npm run build >/dev/null 2>&1
LINK=$(grep -o 'https://wa\.me/[^"]*' dist/shop/noor-stone-ring/index.html | head -1)
python3 -c "import urllib.parse,sys; print(urllib.parse.unquote(sys.argv[1].split('text=')[1]))" "$LINK"
case "$LINK" in *"+"*) echo "FAIL: URLSearchParams bug";; *) echo "PASS: no '+'";; esac
npm run build >/dev/null 2>&1   # IMPORTANT: restore placeholder mode
grep -rc '15555550100' dist/ | grep -v ':0' || echo "PASS: test number absent"
```

Always rebuild afterwards so the test number doesn't linger in `dist/`.

---

## Verifying the Pages Function

`astro dev` does **not** run `functions/` — `/api/lead` 404s there, which is expected and not a bug.
The Function only executes under wrangler:

```bash
npm run build
# .dev.vars (gitignored) — point the webhook at a local listener, not Apps Script
#   SHEET_WEBHOOK_URL=http://127.0.0.1:9999/exec
#   SHEET_SECRET=test-secret-...
npx wrangler@latest pages dev dist --port 8788 --compatibility-date=2026-07-31
```

Run a listener on 9999 that dumps whatever it receives, and you can see exactly what the Function
forwards. **Verified 31 July 2026, all passing:**

| Case | Result |
|---|---|
| Every response, every path | `204` with empty body — no information leaked to an abuser |
| Valid SKU / `ENQUIRY` | forwarded, **secret attached** |
| Unknown SKU `FAKE-99`, empty SKU | rejected, not forwarded |
| Malformed JSON body | `204`, not forwarded |
| `rng-01` (lowercase) | rejected — the allowlist is case-sensitive, as intended |
| `'  RNG-01  '` (padded) | accepted — `clean()` trims *before* validating, correct |
| `Eve\nFORGED\tROW\r` | -> `"Eve FORGED ROW"` — row forging via control chars prevented |
| label 300 / note 900 / page 400 chars | truncated to exactly 120 / 600 / 200 |
| `GET /api/lead` | `404` — only `onRequestPost` is defined |
| Secret + webhook URL in `dist/` | **absent** — confirmed by grep |

`cf-ipcountry` is empty locally, so the `country` column is the one field that can only be
confirmed on real Cloudflare.

---

## What is real vs. placeholder

| Thing | State |
|---|---|
| Architecture, code, design | **Real.** Built and verified. |
| Positioning | **Real, and reversed 14 Aug 2026.** Maison Nunu *resells*; it does not manufacture. See invariant 5c. |
| Brand identity / logo | **Real.** Client-supplied lockups in `assets/Final logo/`, deployed as `public/brand/*`. |
| WhatsApp number | **Real** — `237679471881`. In gitignored `.env` only; still to be set in Cloudflare Pages. |
| The eight collections | **Real.** Confirmed by the client 31 July 2026. |
| All 65 products, prices, descriptions | **Invented.** Plausible but fictional. Every row in `data/products.csv` is `status: placeholder`; `npm run catalog:check` prints the remaining count on every run. |
| Product photography | **Unsplash stock, demo only.** See below. |
| Currency | **Real** — XAF / `fr-CM`, confirmed by the user. |
| `SITE.email`, `location`, `hours` | **Placeholder.** Still generic, not localised to Cameroon. |
| Google Sheet + Apps Script | **Not created.** `apps-script/Code.gs` is ready to paste; the Function that calls it is verified against a stub. |
| Cloudflare Pages project | **Not created.** |

Watches, Raffia bags & hats, Sunglasses and Brooches carry **one invented piece each** (`WCH-01`,
`RFH-01`, `SUN-01`, `BRO-01`), added so every collection renders end to end and the client can
review the structure. Only the categories and SKU prefixes are settled — replace the pieces wholesale
when the real range arrives.

### Product photography — DEMO ONLY, must be replaced

`public/products/*.jpg` are **stock photographs from Unsplash**, added 31 July 2026 so the client can
see the design carrying real photography instead of line art. They are **not** Maison Nunu's pieces
and must not go live as if they were.

Licensing: the [Unsplash License](https://unsplash.com/license) — free, commercial use permitted, no
attribution required. That makes them safe for a demo, but they are still generic stock: **shipping
them as a real jeweler's catalogue would misrepresent the product.** Replace with the client's own
photography before launch.

Files are named by SKU (`rng-01.jpg`) and that filename *is* the mapping — no path is stored anywhere.
To swap one, drop a new file over the same name and run `npm run catalog`. To go back to line art,
delete the file; `image: null` is written for you and the SVG placeholder returns. Do not set
`image` by hand — it lives inside the generated block.

When replacing these with the client's own photography, the fastest route is
`npm run product:add -- <collection> <folder>` into a scratch collection to see them cropped, or just
overwrite the existing files at 800×1000 and re-run the check — it flags anything that will upscale
or that is over 250KB.

Source ids (`https://images.unsplash.com/photo-<id>`), fetched at `?w=800&h=1000&fit=crop&q=75`:

| SKU | Unsplash id |
|---|---|
| RNG-01 | 1705326455036-0fab8ecba04d |
| RNG-02 | 1565206077212-4eb48d41f54b |
| RNG-03 | 1605100804763-247f67b3557e |
| NCK-01 | 1631965004544-1762fc696476 |
| NCK-02 | 1599643478518-a784e5dc4c8f |
| NCK-03 | 1569397288884-4d43d6738fbd |
| EAR-01 | 1615655114865-4cc1bda5901e |
| EAR-02 | 1708220040828-9ab1673681d3 |
| EAR-03 | 1535632066927-ab7c9ab60908 |
| BRC-01 | 1681091639096-a7b2eb1d4990 |
| BRC-02 | 1602173574767-37ac01994b2a |
| WCH-01 | 1587925358603-c2eea5305bbc |
| RFH-01 | 1524679813234-66a389fe1a42 |
| SUN-01 | 1572635196237-14b3f281503f |
| BRO-01 | 1693212793367-60001caf3b5e |
| WCH-02 | 1604242692760-2f7b0c26856d |
| WCH-03 | 1751437774882-deeea4352018 |
| WCH-04 | 1751437761644-460ae92e34c9 |
| WCH-05 | 1623998021450-85c29c644e0d |
| WCH-06 | 1751437819603-aaf4dfa8420a |
| WCH-07 | 1506193095-80bc749473f2 |
| WCH-08 | 1552742275-6aee5589cd29 |
| WCH-09 | 1451290337906-ac938fc89bce |
| BRC-03 | 1619119069152-a2b331eb392a |
| BRC-04 | 1708221235482-a6e2a807198f |
| BRC-05 | 1628785517892-dbcd2f2719ed |
| BRC-06 | 1689367436414-7acc3fdc3e2a |
| BRC-07 | 1597006354775-2955b15ec026 |
| BRC-08 | 1573408301185-9146fe634ad0 |
| BRO-02 | 1728318853117-f9b3ce9be350 |
| BRO-03 | 1693910907642-d498cb0725b0 |
| BRO-04 | 1624215555152-13c864726cd2 |
| BRO-05 | 1693833923492-16fd4c1373bf |
| BRO-06 | 1719862056543-cf81fc74377c |
| BRO-07 | 1758723208958-c18fa48aaff3 |
| BRO-08 | 1719862056472-1e4d4c10d50c |
| EAR-04 | 1781901726877-0b5775eea722 |
| EAR-05 | 1765464281313-b3844388b316 |
| EAR-06 | 1590166223826-12dee1677420 |
| EAR-07 | 1693213085235-ea6deadf8cee |
| EAR-08 | 1781901726815-29af905d0b46 |
| NCK-04 | 1589128777073-263566ae5e4d |
| NCK-05 | 1635767798638-3e25273a8236 |
| NCK-06 | 1685970731571-72ede0cb26ea |
| NCK-07 | 1611652022419-a9419f74343d |
| NCK-08 | 1685970731194-e27b477e87ba |
| RFH-02 | 1626441910528-63af7e3e00dc |
| RFH-03 | 1641934777532-d277296b111c |
| RFH-04 | 1518061124653-4b85d51931f1 |
| RFH-05 | 1718909603336-62fb533e6027 |
| RFH-06 | 1776219189008-b80cc6081517 |
| RFH-07 | 1601330862030-1e08c703ac04 |
| RFH-08 | 1594126593314-2061a87e5996 |
| RNG-04 | 1611955167811-4711904bb9f8 |
| RNG-05 | 1720093601709-66ce9c0068a1 |
| RNG-06 | 1543294001-f7cd5d7fb516 |
| RNG-07 | 1713950920412-97799efdf870 |
| RNG-08 | 1617038220319-276d3cfab638 |
| SUN-02 | 1511499767150-a48a237f0083 |
| SUN-03 | 1587310311582-aa7610e90826 |
| SUN-04 | 1584036553516-bf83210aa16c |
| SUN-05 | 1653038282189-803202722a05 |
| SUN-06 | 1562548726-43b650c82f8e |
| SUN-07 | 1577803645773-f96470509666 |
| SUN-08 | 1606196480588-43eaeb825006 |

**Known name/image mismatches** — the pieces were invented before the photos were sourced, so a few
labels don't describe what's shown. Harmless for a demo, worth knowing before showing a client:
`RNG-03` "labradorite" is a clear
solitaire · `EAR-02` "3mm ball studs" are textured square studs · `BRO-01` "Rosette" is a laurel
spray with a pearl · `WCH-04` "Milanese mesh" is a braided strap.

**Palette watch:** `WCH-02` has green foliage bokeh behind it — the one remaining shot whose
background pulls against the oyster ground, kept because the watch itself matches its description
exactly (32mm, guilloché dial). **When sourcing replacements, check the background against
`--oyster` `#eae7e5` before you judge the subject.** Rejected on those grounds across both rounds:
a hot-pink prop dish, a pink/red gradient, a peach backdrop, a bright-blue poolside, a green
monstera leaf, and a saturated orange/red/green enamel piece.

Two other rejection classes worth knowing, because Unsplash search returns them constantly:

- **Miscategorised results.** A "gold earrings" search returned mostly rings; a "necklace" search
  returned rings and earrings; two "ring" results were hoop earrings. Several were repurposed to the
  category they actually belonged to. **Never assign from the search description — look at it.**
- **Wrong genre.** A "brooch" search returned novelty enamel pins (cats, skulls), a mannequin in a
  street market, and a Victorian engraving that is an illustration rather than a photograph.

**Filter counts are the check that matters.** `#product-grid` renders all 65 products and hides the
non-matching ones, so a broken-image sweep that counts every `<img>` will report ~30 false failures —
hidden `loading="lazy"` images legitimately have `naturalWidth === 0`. Count only visible tiles, or
unhide everything and scroll before measuring.

**Aspect ratio:** the frame is `aspect-ratio: 4/5` with `object-fit: cover`, so any ratio crops
cleanly, but 800×1000 avoids upscaling. Total weight is ~5.5MB across 65 files; grid images are
`loading="lazy"` and only the detail hero is `eager`/`fetchpriority="high"`.

---

## Open questions — ask before assuming

1. ~~The WhatsApp number~~ — **received.** Still outstanding: confirmation it is **not already
   registered on the Cloud API** by a previous developer. That would block it from the WhatsApp
   Business app and is the one thing that could force an architecture change. Ask before launch.
2. ~~Which collections~~ — **confirmed, all eight.** Still outstanding: the real pieces per
   collection, their prices, and whether photography exists.
3. Business details for `src/config/site.ts` and `src/pages/privacy.astro` — trading name, address,
   real hours.
4. Which privacy regime applies in Cameroon, and whether the contact-form consent line needs changing.
5. Does the client want the site in English, French, or both? Cameroon is bilingual and the brand
   name is French, but all copy is currently English. **Nothing is set up for i18n** — this would be
   a real piece of work, not a toggle.
6. **Who are the suppliers, and can they be named?** Now that Maison Nunu is positioned as a
   retailer, the copy leans on "makers we rate" without ever saying who. A curated shop usually earns
   trust by naming what it carries — and if brand names can be used, that is a stronger site than the
   anonymous version now live. If they *cannot* be named, the current wording is the right fallback,
   but that should be a decision rather than an omission.
7. **What can actually be sourced?** `/shop/` now promises "the site shows what we carry, not
   everything we can get". Worth confirming that is true before a customer tests it.
8. Do the surviving craft descriptions match the real pieces? Copy like "hand stamped" and
   "hand-enamelled" was kept because it describes a product truthfully regardless of who sells it —
   but it is still **invented copy about invented pieces**, and it needs to be true of whatever the
   client actually stocks.

---

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # catalog:check && astro build -> dist/
npm run check    # astro check — keep at 0 errors
npm audit        # keep at 0 vulnerabilities

# catalog pipeline — see invariant 5a
npm run product:add -- rings ~/Desktop/IMG_1234.jpg   # mint SKU, crop photo, append draft row
npm run product:add -- watches ~/Desktop/shoot/       # a whole folder, in filename order
npm run catalog                                       # CSV + photos -> catalog.ts
npm run catalog:check                                 # the gate, standalone
```

`astro dev` in Astro 7 **runs as a background daemon** — the `npm run dev` process exits immediately
while the server keeps running. Use `npx astro dev status`, `npx astro dev logs`, `npx astro dev stop`.

---

## Environment gotchas

- **Screenshots ARE possible — this entry used to say otherwise and was wrong.** The Chrome
  *extension* could not reach `localhost` in the first session, and that got over-generalised into
  "screenshots are impossible". **Playwright driving Chromium reaches `localhost:4321` perfectly**
  (verified 31 July 2026, both viewports, zero JS errors). This matters: the hero animation bug was
  invisible to `curl` and to built-HTML inspection, and only a real browser caught it. Install with
  `npm i -D playwright && npx playwright install chromium`, **and uninstall when done** — agent
  tooling stays out of the deliverable, and `package.json` is tracked.
- **Serving the dev server over a Cloudflare tunnel** (for real-phone testing) requires
  `vite.server.allowedHosts` in `astro.config.mjs`. Vite rejects unrecognised `Host` headers as a
  DNS-rebinding defence; without it the tunnel shows "Blocked request. This host is not allowed."
  It is set to `['.trycloudflare.com']` — the leading dot is a wildcard, deliberate because a quick
  tunnel mints a new random subdomain on every run. Scoped rather than `true`, which would disable
  the check for every host. `vite.server` is dev-only and cannot affect a build.
- **Agent tooling is gitignored** (`.agents/`, `.claude/`, `skills-lock.json`) — the user installed
  design skills locally and did not want them in the client deliverable. If they're missing on a new
  machine, that's expected; reinstall locally if wanted.
- Astro inlines the small module scripts into each HTML page rather than emitting `.js` bundles.
  `find dist -name '*.js'` returning zero is **correct**, not a build failure.

---

## Conventions

- Comments explain **why**, not what. Several in this codebase are load-bearing warnings — don't
  strip them as noise.
- Copy uses typographic apostrophes (`’`) and sentence case. Sentence case is deliberate: Title Case
  reads corporate and fights a small independent's voice. This knowingly departs from the Vercel Web
  Interface Guidelines rule that asks for Chicago Title Case.
- **Spelling is American** — `jewelry`, not `jewellery`. Changed 14 August 2026 to match the logo
  artwork, which reads `JEWELRY & ACCESSORIES`. **This reversed the original convention**, which was
  British throughout, so ignore any older instinct the rest of this file might suggest. Note the
  market argument runs the other way — Cameroon is Commonwealth and writes British — so this was a
  brand-consistency decision, not a localisation one, and the client made it knowingly.
  Two British spellings survive and are undecided: `polarised` (21×, in the sunglasses copy) and
  `grey` (2×). CSS keywords (`color`, `center`) are not spellings — leave them alone.
- **Never write copy that claims Maison Nunu made anything.** See invariant 5c. This is the easiest
  mistake to make here, because the visual direction and half the surviving product copy still sound
  like a workshop.
- The site was audited against those guidelines (13 findings, all fixed). If you add UI, keep to the
  same bar: skip link, visible focus, `aria-live` on dynamic content, `min-width:0` on flex children
  holding text, 44px touch targets.
