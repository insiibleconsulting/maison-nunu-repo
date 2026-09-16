# 08 — Launch sequence

Four weeks, in order. The ordering is not arbitrary: each week unblocks the next, and doing them in
parallel produces a shop that is visible before it is credible, which is worse than being invisible.

**The rule that governs the whole sequence: do not drive traffic to a shop that is not real yet.**
A visitor who arrives to find stock photographs and invented prices does not come back, and the
first impression is the only one that is free.

---

## Before week 1 — the blocker

One question has to be answered before anything else, because a wrong answer forces an architecture
change rather than a fix:

> **Has the WhatsApp number `+237 6 71 73 52 66` ever been registered on the WhatsApp Cloud API or
> Business Platform by a previous developer?**

A number registered on the Cloud API **can no longer be used in the WhatsApp Business app.** The
client answers enquiries from their phone, so that would break the entire model. Ask, get a clear
answer, and only then proceed.

---

## Week 1 — Foundations

Nothing public happens this week.

| | Task | Blocks |
|---|---|---|
| ☐ | Domain confirmed and on Cloudflare | everything |
| ☐ | Cloudflare Email Routing live: `admin@`, `info@`, `social@`. Test each | account creation |
| ☐ | Password manager installed, root Google account on `admin@`, 2FA, codes printed | account creation |
| ☐ | WhatsApp Business installed, profile complete, two-step verification PIN set | week 2 |
| ☐ | Greeting message, away message, six quick replies, seven labels | week 4 |
| ☐ | Handles claimed on Instagram, TikTok, Facebook, Pinterest, X | week 3 |
| ☐ | The Google Sheet built: four tabs, formulas, dropdowns, formatting | week 2 |
| ☐ | **Get answers to `09-open-questions.md`**, at minimum payment and exchange | week 2 |

Reference: `01-identity-and-accounts.md`, `06-enquiry-to-sale.md`,
`templates/inventory-sheet-spec.md`.

---

## Week 2 — Make the catalog real

The heaviest week, and the one that determines whether any of the rest is worth doing.

| | Task | Notes |
|---|---|---|
| ☐ | Photography corner set up permanently | `04-product-photography.md` |
| ☐ | Every piece in stock photographed: hero plus four | 5 frames each |
| ☐ | Hero shots renamed to lowercase SKU, cropped 4:5, under 250 KB | the filename is the link |
| ☐ | Every piece logged in the Inventory tab **with its cost price** | not recoverable later |
| ☐ | Real names, prices, materials and descriptions into `data/products.csv` | replaces invented copy |
| ☐ | Every real row switched to `status: real` | |
| ☐ | Placeholder rows and stock photos removed | |
| ☐ | `npm run catalog` then `npm run build` | the gate must pass |
| ☐ | `npm run catalog:check` reports **zero placeholders** | this is the launch gate |
| ☐ | `SITE.email`, `location`, `hours` filled with real details | `src/config/site.ts` |
| ☐ | `COMMERCE.payment` and `COMMERCE.exchange` filled from the client's own words | |
| ☐ | Apps Script pasted, `setupSheet()` run once, deployed, `/exec` URL captured | |

**Do not invent a single price, description or payment method to finish this week faster.** An
empty field is safe. A plausible wrong one is a promise the business has to keep.

---

## Week 3 — Go live, quietly

The site goes up. Nobody is told yet.

| | Task | Notes |
|---|---|---|
| ☐ | Cloudflare Pages project created from the repo | |
| ☐ | Build command `npm run build`, output directory `dist` | **not optional** |
| ☐ | `PUBLIC_WA_NUMBER` set in Pages, production and preview | digits only, no `+` |
| ☐ | `SHEET_WEBHOOK_URL` and `SHEET_SECRET` set as encrypted secrets | never `PUBLIC_` |
| ☐ | Custom domain attached, HTTPS confirmed | |
| ☐ | **Deep link tested on a real handset**, both iOS and Android if possible | top remaining risk |
| ☐ | A real lead confirmed landing in the `Leads` tab, `Country` column populated | |
| ☐ | Every page checked on a phone at 400px wide | |
| ☐ | Instagram professional account, connected to the Facebook Page | |
| ☐ | **WhatsApp contact button configured on the Instagram profile** | highest-value setting |
| ☐ | Bio, profile picture, highlight covers, link to the domain | `templates/profile-copy.md` |
| ☐ | TikTok Business account, bio, link | |
| ☐ | First nine posts prepared but **not published** | fills the grid on day one |

**Two deployment traps, both already paid for once:**

The first deploy failed with `Pages only supports files up to 25 MiB`, naming a PDF. The PDF was not
the cause. Three lines earlier the log said `No build command specified. Skipping build step.` With
no build command, Pages tried to upload the repository root as the site. Set the build command and
output directory in the dashboard and the problem does not exist.

**Do not add a `wrangler.toml` or `wrangler.jsonc` to fix it.** For Pages, that file becomes the
source of truth and disables the dashboard fields it covers, including the encrypted secrets. The
only way to restore them under a wrangler file is to commit them, which publishes them. Full
reasoning is in `CLAUDE.md`.

---

## Week 4 — Be visible

| | Task | Notes |
|---|---|---|
| ☐ | Publish the nine prepared posts across three days | the grid reads as a shop immediately |
| ☐ | Stories every day, with the link sticker | |
| ☐ | Personally message every existing contact who would want to know | the highest-converting launch action there is |
| ☐ | Two Reels, reused on TikTok | |
| ☐ | Ask three people to share the launch post | |
| ☐ | First Monday batch runs. The weekly rhythm starts | `07-operating-rhythm.md` |
| ☐ | Every enquiry answered inside two hours | |

**The personal messages outperform everything else on this list.** A launch announcement to people
who already know the client converts at a rate no post will match in the first year. Send them one
at a time, not as a broadcast.

---

## Day 30 review

Sit down with the sheet, not with a feeling.

- Enquiries in the first 30 days, and how many became sales
- Which channel produced them
- Which pieces got saved, asked about, and bought. These are rarely the same list
- What the reply times actually were
- What broke, and what quietly did not happen at all

Then adjust one thing. Not five.

---

## Never launch with any of these true

- [ ] A stock photograph still live on a product page
- [ ] `npm run catalog:check` reporting placeholder rows
- [ ] An invented price, material or description
- [ ] A payment method or exchange policy the client has not said out loud
- [ ] The deep link untested on a real handset
- [ ] 2FA missing anywhere, or recovery codes unprinted
- [ ] An account registered on a consultant's personal email
- [ ] Any copy claiming Maison Nunu made a piece
