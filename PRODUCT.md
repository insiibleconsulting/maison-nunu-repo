# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: buyers in Cameroon, on a phone, already living in WhatsApp.** They arrive from an
Instagram post, a WhatsApp status, or a link forwarded by someone they know. Connections are often
slow and metered, so page weight is a user-facing concern, not an engineering nicety.

Two distinct jobs, both confirmed by the existing surface area:

- **Buying for themselves.** They want one specific piece and need a question answered before they
  commit: a ring size, a chain length, which stone, whether it is in stock.
- **Buying a gift.** They do not know the recipient's size and often do not know the category. They
  start from a budget, which is the one thing they do know. `/gifts/` exists for this journey.

**Language: English-only at launch, French is a known future requirement.** Cameroon is bilingual
and francophone buyers are a real share of the market. English-only is a deliberate launch
compromise, not a settled position, and future work must not design French out. Prices already
render through the `fr-CM` locale (`145 000 FCFA`), which is how prices are written in Cameroon.

## Product Purpose

A catalogue that ends in a conversation. Maison Nunu shows its selection, and every piece hands the
visitor into the owner's WhatsApp with the piece and its reference already written into the message.
**There is no checkout, deliberately** — most of what they sell needs one question answered before
it ships, and a cart cannot ask it.

Success at launch, in priority order:

1. **Enquiries started in WhatsApp.** The single metric. Everything on the site exists to produce
   it, and the lead log measures it.
2. **Credible enough to share.** The client needs a link they are proud to send from Instagram or
   WhatsApp status.
3. **Replaces the ad-hoc DM catalogue.** One durable place the whole range lives, updatable by a
   non-technical editor without a rewrite.

Where these conflict, the higher number wins.

## Positioning

**An independent reseller competing on taste and advice, not on price or breadth.** Maison Nunu
buys in small quantities from makers they rate and keeps the selection short enough to know every
piece on it. The differentiator is the conversation: a person who has handled the piece answering a
real question before money moves.

The mechanism a neighboring shop could not truthfully copy is the honesty of the handoff — the site
shows the visitor the literal text they are about to send before they send it.

## Operating Context

- **The owner answers from a phone**, in the WhatsApp Business app. Not a desk, not a dashboard.
  This rules out anything that assumes a seated operator.
- **Fulfilment is in person, by appointment.** Handover is arranged inside the WhatsApp thread.
  The site should not imply shipping.
- **Everything runs on permanent free tiers.** The domain is the only cost. Any proposal introducing
  a paid service is a change of premise, not a detail.
- **The catalogue is a spreadsheet.** `data/products.csv` plus photographs on disk generate the site
  catalogue. Chosen so a non-technical editor can maintain it with no service, no account and no
  build minutes.
- Support tooling lives in the WhatsApp Business app itself: greeting message, away message, quick
  replies, labels, catalog.

## Capabilities and Constraints

- **No checkout, and no payment on site.** Settled.
- **WhatsApp deep links (`wa.me`), never the WhatsApp Cloud API.** A number registered on the Cloud
  API can no longer be used in the WhatsApp Business app, and the owner answers from that app.
- **Never ship a fallback phone number.** Missing config disables every CTA and shows a sitewide
  banner. Failing loud is the point; a plausible placeholder would route real customers to a stranger.
- **Logging must never block the handoff.** Every CTA is a real `<a href>` rendered at build time.
  Telemetry is fire-and-forget; if it fails, the lead still reaches WhatsApp.
- **XAF is zero-decimal.** Prices are whole francs. No minor-unit conversion anywhere.
- **SKUs are permanent.** They are the reference the owner reads in WhatsApp and the key in the lead
  log. Retired codes are never reissued.
- **Eight fixed collections**, in a client-confirmed order: Earrings, Bracelets, Necklaces, Watches,
  Rings, Raffia bags & hats, Sunglasses, Brooches.
- Static Astro build, deployed to Cloudflare Pages. Never deployed yet.
- **Undecided:** payment methods, delivery coverage beyond in-person handover, and return/exchange
  terms are not established. Do not invent them.

## Brand Commitments

- **Name:** Maison Nunu. Tagline "Fine jewelry & accessories".
- **Maison Nunu resells; it does not manufacture.** Describing how a piece was made is fine.
  Claiming Maison Nunu made it is not. This is promise-shaped: provenance claims about jewelry are
  something a customer can hold the business to.
- **Burgundy `#7a2036`** as accent, **neutral oyster `#eae7e5`** as ground. Deliberately not cream.
- **No gold on light surfaces.** The brand guide's gold `#c89a6a` is 2.06:1 on oyster and unusable.
  `--brass` is the accessible stand-in. Gold is a dark-surface accent only.
- **Type: Fraunces + Archivo, self-hosted via Fontsource.** Never Google's CDN — that would leak
  visitor IPs and expand what the privacy page has to cover. *Open decision:* the client's brand
  guide names Playfair Display; the divergence is deliberate and unresolved.
- **Voice:** sentence case, typographic apostrophes, American spelling (`jewelry`, matching the logo
  artwork). Title Case reads corporate and fights a small independent's voice.
- **Signature element:** the message-preview bubble showing the literal outgoing text. The one thing
  the site is meant to be remembered by; everything around it stays quiet.
- Logo lockups exist as real artwork in `assets/Final logo/`. Print masters are `.ai`/`.eps`/`.psd`.

## Evidence on Hand

**Real:**
- Client logo pack, four lockups, with vector print masters.
- Real product photography for most of the catalogue (~5.9MB across the shot pieces).
- A real WhatsApp Business number, held in a gitignored `.env`, absent from every tracked file.
- **`info@maisonnunu.com`**, confirmed by the client. The domain itself is not live yet, so
  the address will not receive mail until DNS and a mailbox exist.
- The client's brand style guide — **removed from the repo**, recoverable only from git history.

**Absent, and must not be fabricated:**
- **No testimonials, reviews, customer photos, or order counts.** None exist.
- **No social accounts wired up.** `SITE.social.instagram` and `.tiktok` are empty strings.
- **Most product descriptions are invented placeholder copy** awaiting client confirmation. A
  `status` column gates this; `placeholder` means the copy is not yet true.
- Sample rows added to preview real photography are still live in the catalogue and are marked for
  deletion before launch.

## Product Principles

1. **The handoff is sacred.** Nothing may sit between a visitor and the WhatsApp thread. Telemetry,
   animation, and scripting are all subordinate to the link working.
2. **Fail loud, never plausibly.** A missing number disables the buttons and says so. A missing
   photograph renders a visible "image pending" frame. Silent degradation is worse than a visible gap.
3. **Say only what is true.** Provenance, availability, and lead times are promises. Placeholder copy
   is marked as placeholder until the client confirms it.
4. **Curation is a claim the interface has to earn.** A short, known selection should not present
   itself as an undifferentiated wall of stock.
5. **The phone is the real device.** Weight, tap targets, and offline resilience are judged against a
   slow metered connection, not a desk.

## Accessibility & Inclusion

- **WCAG AA is the floor**, with contrast ratios computed and recorded against the oyster ground
  rather than eyeballed. Body text targets AAA where achievable.
- 44px minimum touch targets, skip link, visible focus on every interactive element, `aria-live` on
  dynamic content, `min-width: 0` on flex children holding text.
- `prefers-reduced-motion` collapses all entrance animation.
- **The site is expected to work with JavaScript unavailable.** Every CTA is a real anchor rendered
  at build time. Any rule that hides content must be scoped so that scripting-off degrades to a
  visible, usable page.
- Single committed light theme, declared via `color-scheme: light` so native controls do not render
  dark against a light page. Product photography needs one consistent ground.
