# CLAUDE.md — session handoff

Read this before touching anything. It records **why** the code is the way it is, which is the part
that isn't recoverable from reading the source.

`README.md` covers setup, deployment and configuration — don't duplicate it here. This file covers
decisions, invariants, current state, and what's still unknown.

---

## What this is

A static Astro site for **Maison Nunu**, a small-batch jewellery and accessories maker in
**Cameroon**. There is no checkout. Every piece links straight into the client's **WhatsApp Business
app** via a `wa.me` deep link, with a free Google Sheets + email lead log running alongside.

Client repo: `insiibleconsulting/maison-nunu-repo`
Architecture doc: https://claude.ai/code/artifact/f86e354d-f19d-4139-ac49-77f516b3a5d5

**Everything runs on permanent free tiers.** The domain is the only cost. Any proposal that
introduces a paid service needs to be flagged as a change of premise, not slipped in.

---

## Status as of 31 July 2026

Branch `build/astro-whatsapp-site`, commit `068537d`, pushed. **Not merged to `main`, no PR opened.**

Built and verified:

- 19 pages — home, shop (client-side category filter), 13 product pages, about, contact, privacy, 404
- Deep-link generation, lead beacon, Pages Function, Apps Script lead logger
- Full visual identity, WCAG-checked
- `astro check` clean across 21 files · `npm audit` 0 vulnerabilities

**Never deployed.** No Cloudflare Pages project exists yet. Nothing has been tested against a real
phone or a real WhatsApp account.

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

### 5. `src/data/catalog.ts` is the single source of truth

Product pages, shop grid, WhatsApp message text **and the Pages Function's SKU allowlist** all derive
from it. `functions/api/lead.ts` imports `SKUS` from it directly so the allowlist cannot drift.

That import is why **`catalog.ts` must have no imports of its own**. Pulling in anything that touches
`import.meta.env` (e.g. `config/site.ts`) breaks the Function in the Workers runtime.

### 6. SKUs are permanent

The SKU is the ref code the client reads in WhatsApp and the key in the lead spreadsheet. Reusing one
for a different piece silently repoints historical lead data at the wrong product.

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

Direction: **the jeweller's bench, not the jewellery advertisement.**

- **Accent is burgundy** — jeweller's rouge, the polishing compound worked at the bench. The user
  chose this over an earlier verdigris green.
- **Ground is a neutral oyster**, deliberately *not* cream. Cream + serif + warm accent is the most
  templated palette on the web; the brief deserves better. It's also not the cool grey-green an
  earlier pass used — under a red accent that reads as a complementary clash.
- **No gold.** Gold product photography reads *as gold* against a neutral ground and vanishes against
  a gold-toned one. Maison Nunu is a maker, not a luxury house.
- **Type:** Fraunces (variable, `WONK`/`SOFT` dialled up so it reads hand-cut) + Archivo.
  **Self-hosted via Fontsource, never Google's CDN** — that would leak visitor IPs to a third party
  and drag the privacy page into territory it doesn't need to cover.
- **Signature element:** `src/components/MessagePreview.astro` renders the literal message about to
  be sent, as a chat bubble. The hero is a three-bubble exchange. This is the one thing the site is
  meant to be remembered by — keep everything around it quiet.
- **Single committed light theme.** Product photography needs one consistent ground. `color-scheme:
  light` is declared so native controls don't render dark on a dark OS.

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
 ("line-interactive",'#7d7376',G,3.0),("focus ring",B,G,3.0)]
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

## What is real vs. placeholder

| Thing | State |
|---|---|
| Architecture, code, design | **Real.** Built and verified. |
| WhatsApp number | **Missing.** Site runs in placeholder mode. |
| All 13 products, prices, descriptions | **Invented.** Plausible but fictional. |
| Product photography | **None.** `image: null` renders line-art placeholders marked "IMAGE PENDING". |
| Currency | **Real** — XAF / `fr-CM`, confirmed by the user. |
| `SITE.email`, `location`, `hours` | **Placeholder.** Still generic, not localised to Cameroon. |
| Google Sheet + Apps Script | **Not created.** `apps-script/Code.gs` is ready to paste. |
| Cloudflare Pages project | **Not created.** |

---

## Open questions — ask before assuming

1. **The WhatsApp number**, and confirmation it is **not already registered on the Cloud API** by a
   previous developer. That would block it from the WhatsApp Business app and is the one thing that
   could force an architecture change.
2. Real catalog: how many pieces, and do they have photos?
3. Business details for `src/config/site.ts` and `src/pages/privacy.astro` — trading name, address,
   real hours.
4. Which privacy regime applies in Cameroon, and whether the contact-form consent line needs changing.
5. Does the client want the site in English, French, or both? Cameroon is bilingual and the brand
   name is French, but all copy is currently English. **Nothing is set up for i18n** — this would be
   a real piece of work, not a toggle.

---

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run check    # astro check — keep at 0 errors
npm audit        # keep at 0 vulnerabilities
```

`astro dev` in Astro 7 **runs as a background daemon** — the `npm run dev` process exits immediately
while the server keeps running. Use `npx astro dev status`, `npx astro dev logs`, `npx astro dev stop`.

---

## Environment gotchas

- **The Chrome extension could not reach `localhost`** in the session where this was built — browser
  requests never arrived at the dev server (confirmed against `astro dev logs`). Screenshots of the
  running site were impossible. If you hit the same wall, don't burn turns retrying; verify against
  built HTML and ask the user to look at the page themselves.
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
  reads corporate and fights a small maker's voice. This knowingly departs from the Vercel Web
  Interface Guidelines rule that asks for Chicago Title Case.
- The site was audited against those guidelines (13 findings, all fixed). If you add UI, keep to the
  same bar: skip link, visible focus, `aria-live` on dynamic content, `min-width:0` on flex children
  holding text, 44px touch targets.
