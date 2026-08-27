---
target: the Maison Nunu site
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
timestamp: 2026-08-27T07-02-06Z
slug: maison-nunu-site
---
Method: dual-agent (A: design review, isolated · B: detector + browser evidence, isolated)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | `/shop/?p=under-75` silently truncates to 12 of 75 items with the "All" pill still highlighted. No band name, no count. |
| 2 | Match System / Real World | 3 | XAF/`fr-CM` and "Ordered in" are right; "Sizes G-U" ships with no key and hours carry no timezone. |
| 3 | User Control and Freedom | 2 | Clicking a collection silently discards an active price band. Product breadcrumb drops `?c=`. |
| 4 | Consistency and Standards | 2 | 81 heading-order violations sitewide (footer `<h4>` on 77 pages, 4 `h1->h3`). Contact CTA is the only one with no WhatsApp glyph and no preview. |
| 5 | Error Prevention | 3 | Strong: fail-loud placeholder number, honeypot, `encodeURIComponent`. Docked for 84-option flat select. |
| 6 | Recognition Rather Than Recall | 2 | Contact picker lists ~84 products as flat text. 5 of 8 collections off-screen on mobile with no scroll cue. |
| 7 | Flexibility and Efficiency | 1 | A 75-item filterable catalogue with no search, no sort, no pagination, and a price filter that exists only as a URL parameter. |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained and confident. Docked for reading column on text pages centring against a left-aligned masthead. |
| 9 | Error Recovery | 3 | `/404` is excellent. Shop empty state misdiagnoses price-band results as "Nothing in this category yet". |
| 10 | Help and Documentation | 3 | `/guide/` is real expertise, but no product page ever links to it. |
| **Total** | | **24/40** | **Acceptable** |

All ten heuristics apply. Heuristic 7 is not `n/a` despite this being a Persuade surface: a 75-item filterable catalogue is a browsing task.

## Design Specificity Verdict

**Authored for this product, at the edges. Category-interchangeable in the middle.**

The hero is a three-bubble WhatsApp exchange instead of a bottle shot. The product CTA sits under a bubble showing the literal string you are about to send. Neither survives being lifted onto another retailer's site without becoming a lie. The palette is argued rather than picked.

Where specificity thins is the catalogue layer. `/shop/`, the product grid, and the homepage's "This season" / "Find your thing" are two uniform card grids stacked on each other under vague headings. Those blocks could move to any Shopify theme unchanged. The signature element carries the identity; the catalogue does not participate in it.

**Deterministic scan.** Source scan: 1 finding. Built-output scan: 85. That gap is itself the finding - `.astro` files are not HTML-parsed, so all 81 heading defects are invisible to a source-only scan. Any gate must run against `dist`.

False positives, dismissed: `side-tab` on `.guide-care` (a 2px rule on prose, not a card stripe); `border-accent-on-rounded` on `.band` (real but weak - `--radius` is 3px, which reads square); `flat-type-hierarchy` on `/contact/` (sampled a subtree that excluded the h1). `overused-font` on Fraunces is a design decision, not a defect.

No user-visible overlay was produced; findings come from the CLI scan plus direct browser measurement.

## Overall Impression

This is a well-built site with a genuine idea at its centre and a soft middle. The craft floor is high and measurably so: zero console errors across six routes, zero horizontal overflow at 390px, zero WCAG AA text-contrast failures in 147 sampled pairs, a visible focus ring on 36 of 36 interactive elements at 8.18:1.

The biggest opportunity is not visual. It is that the site removes the checkout and never replaces what the checkout used to say. Payment, delivery, returns, and who Maison Nunu actually is are all unanswered at the moment of a 145 000 FCFA decision.

## What's Working

1. **`MessagePreview` showing the literal outgoing text.** It works because it is honest, not clever - the bubble is the string, not a paraphrase. It collapses the biggest hesitation in a deep-link handoff into something you can simply read.
2. **The hero states the business model instead of describing it.** "That one we order in, so you get to pick the stone" teaches the value of having no checkout in twelve words, and sets a reply-time expectation at first contact.
3. **`/guide/` is real retail expertise.** Each material names the one thing that shortens its life. Because the list derives from the catalogue it cannot drift into describing something they do not sell.
4. **The measured accessibility floor.** Contrast computed rather than eyeballed, focus ring on everything, `alt`/`width`/`height` on every image across six routes.

## Priority Issues

### [P0] With JavaScript unavailable, the entire catalogue is invisible

`.reveal { opacity: 0 }` at `global.css:1476` is unscoped, and the only thing setting `.is-visible` is the bundled module. Confirmed in the built output: 75 elements ship as `class="product reveal"` in `dist/shop/index.html`, with no `<noscript>` anywhere in the repo.

**Why it matters.** A dropped module request on a flaky metered connection, a data-saver proxy, or a carrier filter yields a page with headings, a footer, and 75 invisible products. Every `wa.me` link is present, correct, and unreachable. This contradicts a commitment the codebase makes about itself: `Base.astro` scopes every collapsing nav rule to `.js` with a comment explaining a control may only be hidden if script exists to reopen it. The reveal was never given the same treatment, and it hides far more.

Both assessments found this independently, by different methods.

**Fix.** Scope it exactly like the nav: `.js .reveal { opacity: 0; ... }`. The `js` class lands render-blocking before first paint, so there is no flash, and scripting-off degrades to the static grid that shipped before the reveal existed.

**Suggested command:** `/impeccable harden`

### [P1] The price filter has no interface and no status

`/shop/` renders no price control. `?p=under-75` is reachable only from the four `/gifts/` band cards. Landing there drops the grid to 12 of 75 while the "All" pill stays highlighted, with no band label and no count - and clicking any category pill discards the price band without saying so.

**Why it matters.** This is exactly the gift-buyer path. They tap "Under 75 000 - 12 pieces", land on a page claiming to show "All", and conclude the shop has twelve things in it. Narrowing to "Rings" then silently voids the budget they just declared.

**Fix.** Render the four bands as a second pill row (already defined in the page's `BANDS` map). Show an active-filter line above the grid with a clear control. Make category and price combinable; `apply()` already accepts both.

**Suggested command:** `/impeccable clarify`

### [P1] Nothing on the site answers "how does this actually work?"

Across all nine routes there is no statement of payment method, delivery, returns, physical location, or human identity. Both social handles are empty strings. The email is a placeholder on a domain that does not exist.

**Why it matters.** Removing the checkout removed the place where payment options appear, delivery is calculated, and a returns link sits under the buy button - and nothing replaced it. For a Cameroonian buyer, "can I pay by MoMo or Orange Money" is the first question, and the site's answer is silence. Every unanswered question becomes a WhatsApp round-trip the owner answers by hand.

PRODUCT.md now records the fulfilment answer - **in person, by appointment** - so this is a content gap with a known answer, not an open question.

**Suggested command:** `/impeccable clarify`

### [P1] 81 heading-order violations, from two causes

The footer's column headings are `<h4>` with no `<h3>` above them, hitting 77 pages from one file. Four pages jump `h1 -> h3` in main content. Screen-reader users navigating by heading level hit a hole on every page of the site.

**Fix.** `Footer.astro` lines 36 and 43 become `<h3>`; four in-page `h3`s become `h2`. One file plus four one-word edits.

**Suggested command:** `/impeccable audit`

### [P2] Mobile hides five of eight collections with no scroll cue

At <=700px the collections bar is `overflow-x: auto` with the scrollbar hidden and no edge fade, no gradient mask, no peeking chip. At 390px roughly two and a half chips fit. The burger menu holds only the five top-level links, not the collections.

**Why it matters.** The audience is phone-first, and the bar was added because "sixty-five products behind one Shop link meant the range was invisible." On mobile the fix reproduced the problem it was built to solve.

**Suggested command:** `/impeccable adapt`

## Persona Red Flags

**First-time mobile visitor, slow metered connection.** The P0 is their real failure mode, not a hypothetical. `/shop/` carries 75 single-size 800x1000 JPEGs totalling 6.18 MB with zero `srcset` and zero AVIF/WebP - 20 files exceed 100 KB, largest 223 KB. Desktop oversamples ~2.5x. No skeletons while images load. Five of eight collections unreachable.

**Gift buyer who does not know the size.** The `/gifts/` handoff loses its own framing; clicking a collection voids the budget. The product page never links to `/guide/` - the sizing answer is one click from the question and the site never makes that click. "Sizes G-U" is the entire sizing story at the moment of commitment. Nothing about gift notes, exchanges, or what happens if the size is wrong.

**Cautious buyer worried about legitimacy.** Zero social proof of any kind. No named human, no address. Both social handles empty - no Instagram, the single most normal legitimacy check for this market. A placeholder email that would bounce. They are asked to open a chat with a stranger's phone number about a 245 000 FCFA ring, and the site's whole answer to "why trust you" is tone of voice. The only outbound link on the site points at the agency, not the shop.

## Minor Observations

- `SITE.hours.toLowerCase()` on the product page renders "We reply mon-fri, 9am - 5pm." Lowercase weekday abbreviations directly under the primary CTA.
- `textarea::placeholder` measures 4.46:1, missing AA by 0.04. It is Chrome's UA-default grey - no `::placeholder` rule is authored anywhere. The only measured contrast miss on the site.
- 14 footer links render 14-15px tall. Pitch is 26-27px so they pass WCAG 2.2 AA 2.5.8 via the spacing exception, but fail AAA 2.5.5 by roughly 3x. Filter chips are 39px, collections links 43px - both just short of 44.
- Every product card has two anchors to the same href, so `/shop/` has 225 focusable elements for 75 products - 75 redundant tab stops.
- The "ORDERED IN" tag has no plate behind it; its contrast depends entirely on the photograph underneath.
- The collections bar is not sticky while the header is, so category navigation vanishes on scroll.
- 10 rows in `data/products.csv` are tagged as samples "Delete before launch" and are live in the rendered catalogue now.
- Shop empty state reads "Nothing in this category yet" regardless of whether a price band caused it.
- Mobile nav panel opens with no backdrop scrim.
- `CLAUDE.md` documents 73 pages and gift band counts of 11/22/21/11; the build is 83 pages and the counts render 12/25/26/12. The counts self-corrected because they are derived; the doc has drifted.

## Questions to Consider

1. The site says "chosen, not stocked, short enough that we know every piece on it," then defaults `/shop/` to 75 undifferentiated tiles. What if there were no "All"? The curation claim is currently rhetoric the interface contradicts.
2. The signature element shows the message you are about to send. What would it cost to show the message you would get back? A page of real, permissioned exchanges would be the trust artefact this site lacks, made of something the business already produces for free - and it would answer payment, delivery and returns without anyone writing a policy page.
3. Every visitor leaves through WhatsApp and never returns to a confirmation. So what is the last thing this site should say? Right now it is a lowercased opening-hours footnote.
