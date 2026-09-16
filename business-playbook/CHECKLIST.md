# Master checklist

Every action in this playbook, in the order it has to happen, in one place.

The detail lives in the numbered guides. This is the tracker: tick things here, read there.

**Owner column:** `C` the client · `I` Insiible Consulting · `C+I` together in one sitting.

---

## Phase 0 — The blocker

Answer this before spending an hour on anything else. A wrong answer changes the architecture, not
a setting.

| | Task | Owner | Detail |
|---|---|---|---|
| ☐ | Confirm the WhatsApp number has **never** been registered on the WhatsApp Cloud API or Business Platform | C | [08](08-launch-sequence.md) |

A number on the Cloud API can no longer be used in the WhatsApp Business app. The client answers
from their phone, so a yes here breaks the whole model.

---

## Phase 1 — Foundations (week 1)

Nothing public happens this week.

### Email and domain

| | Task | Owner |
|---|---|---|
| ☐ | Domain confirmed and on Cloudflare | I |
| ☐ | Cloudflare Email Routing enabled, MX and SPF records accepted | I |
| ☐ | `admin@maisonnunu.com` forwarding, tested with a real send | I |
| ☐ | `info@maisonnunu.com` forwarding, tested | I |
| ☐ | `social@maisonnunu.com` forwarding, tested | I |
| ☐ | Gmail "Send mail as" configured for `info@` | C |

### Security, before any account exists

| | Task | Owner |
|---|---|---|
| ☐ | Password manager installed (Bitwarden free or iCloud Keychain) | C |
| ☐ | Root Google account created on `admin@` | C+I |
| ☐ | 2FA on via **authenticator app, not SMS** (SIM swap is a real risk here) | C |
| ☐ | Recovery codes **printed** and physically stored, not photographed | C |
| ☐ | WhatsApp two-step verification PIN set | C |

### WhatsApp Business

| | Task | Owner |
|---|---|---|
| ☐ | App installed on the client's phone, business profile complete | C |
| ☐ | Hours match `SITE.hours` in `src/config/site.ts` exactly | I |
| ☐ | Greeting message set | C+I |
| ☐ | Away message set, hours matching | C+I |
| ☐ | Quick replies: `/ref` `/size` `/care` `/see` `/source` | C+I |
| ☐ | Quick replies `/pay` and `/exchange` left **unset** pending client answers | I |
| ☐ | Seven labels created | C |

### Handles and the sheet

| | Task | Owner |
|---|---|---|
| ☐ | Handle claimed on Instagram, TikTok, Facebook, Pinterest, X in one sitting | I |
| ☐ | Google Sheet built: `Inventory`, `Sales`, `Leads`, `Dashboard` | I |
| ☐ | Locale left as **United States** (a French locale breaks every formula) | I |
| ☐ | `#,##0" FCFA"` applied to price columns, zero decimals | I |
| ☐ | All formulas dragged to row 1000 / 2000 | I |
| ☐ | Dropdowns and conditional formatting live | I |
| ☐ | Sheet owned by the **client's** Google account | C |
| ☐ | Test row entered, checked against Dashboard, deleted | I |

### The client answers

The six blocking questions from [09](09-open-questions.md). Written down, in their words, dated.

| | Question | Owner |
|---|---|---|
| ☐ | 1. Cloud API status of the number | C |
| ☐ | 2. Payment methods, and whether a deposit is taken | C |
| ☐ | 3. Exchange / wrong size policy | C |
| ☐ | 4. Trading name, address, real hours, email | C |
| ☐ | 5. English, French, or both | C |
| ☐ | 6. Real catalog: names, cost prices, list prices, materials | C |

Reference: [01](01-identity-and-accounts.md) · [06](06-enquiry-to-sale.md) ·
[templates/inventory-sheet-spec.md](templates/inventory-sheet-spec.md)

---

## Phase 2 — Make the catalog real (week 2)

The heaviest week, and the one that decides whether the rest is worth doing.

| | Task | Owner |
|---|---|---|
| ☐ | Photography corner set up **permanently** | C |
| ☐ | Beige `#ede9e4` and midnight `#1a222d` card acquired | C |
| ☐ | Every piece in stock photographed, five frames each | C |
| ☐ | Hero shots cropped 4:5, under 250 KB, renamed to lowercase SKU | C |
| ☐ | Other four frames filed in a folder per SKU | C |
| ☐ | Every piece logged in Inventory **with its cost price** | C |
| ☐ | Real names, prices, materials, descriptions into `data/products.csv` | C+I |
| ☐ | Every real row switched to `status: real` | I |
| ☐ | Placeholder rows and Unsplash stock photos removed | I |
| ☐ | `npm run catalog` then `npm run build`, gate passing | I |
| ☐ | **`npm run catalog:check` reports zero placeholders** | I |
| ☐ | `SITE.email`, `location`, `hours` filled with real details | I |
| ☐ | `COMMERCE.payment` filled from the client's own words | I |
| ☐ | `COMMERCE.exchange` filled from the client's own words | I |
| ☐ | Apps Script pasted, `setupSheet()` run once, deployed, `/exec` URL captured | I |
| ☐ | Photographs backed up to Drive or iCloud | C |

**Do not invent a price, description or payment method to finish faster.** An empty field is safe.
A plausible wrong one is a promise the business has to keep.

Reference: [04](04-product-photography.md) ·
[templates/photo-shot-list.md](templates/photo-shot-list.md) · [05](05-inventory-and-sales.md)

---

## Phase 3 — Go live, quietly (week 3)

The site goes up. Nobody is told yet.

### Deployment

| | Task | Owner |
|---|---|---|
| ☐ | Cloudflare Pages project created from the repo | I |
| ☐ | Build command `npm run build` | I |
| ☐ | Build output directory `dist` | I |
| ☐ | **No `wrangler.toml` added** (it disables the dashboard's encrypted secrets) | I |
| ☐ | `PUBLIC_WA_NUMBER` set, production and preview, digits only, no `+` | I |
| ☐ | `SHEET_WEBHOOK_URL` set as an encrypted secret, never `PUBLIC_` | I |
| ☐ | `SHEET_SECRET` set as an encrypted secret | I |
| ☐ | Custom domain attached, HTTPS confirmed | I |
| ☐ | Secret and webhook URL confirmed **absent** from `dist/` by grep | I |

### Verification

| | Task | Owner |
|---|---|---|
| ☐ | **Deep link tested on a real handset.** iOS and Android if possible | C+I |
| ☐ | WhatsApp opens with the message pre-filled and no literal `+` signs | C+I |
| ☐ | A real lead lands in the `Leads` tab | I |
| ☐ | `Country` column populated (only testable on real Cloudflare) | I |
| ☐ | Every page checked on a phone at 400px wide | I |

### Social accounts

| | Task | Owner |
|---|---|---|
| ☐ | Facebook Page created **before** Instagram | C+I |
| ☐ | Instagram professional account on `social@`, connected to the Page | C+I |
| ☐ | **WhatsApp contact button configured on the Instagram profile** | C |
| ☐ | Bio, name field, profile picture (Icon lockup on beige, checked at thumbnail size) | I |
| ☐ | Link points at `maisonnunu.com`, not Linktree | I |
| ☐ | Five story highlight covers, midnight ground, gold Playfair | I |
| ☐ | TikTok Business account on `social@`, bio, link | C+I |
| ☐ | Insiible added via Business Suite, **not** by password sharing | C |
| ☐ | First nine posts prepared but **not published** | I |

Reference: [08](08-launch-sequence.md) · [02](02-brand-on-social.md) ·
[templates/profile-copy.md](templates/profile-copy.md)

---

## The launch gate

**Do not proceed to Phase 4 while any of these is true.** Tick each one as *confirmed false*.

| | Must be false | Owner |
|---|---|---|
| ☐ | A stock photograph still live on a product page | I |
| ☐ | `npm run catalog:check` reporting any placeholder rows | I |
| ☐ | An invented price, material or description anywhere | I |
| ☐ | A payment method or exchange policy the client has not said out loud | I |
| ☐ | The deep link untested on a real handset | C+I |
| ☐ | 2FA missing anywhere, or recovery codes unprinted | C |
| ☐ | Any account registered on a consultant's personal email | I |
| ☐ | Any copy claiming Maison Nunu **made** a piece | I |

---

## Phase 4 — Be visible (week 4)

| | Task | Owner |
|---|---|---|
| ☐ | Publish the nine prepared posts across three days | C |
| ☐ | Stories every day, with the link sticker | C |
| ☐ | **Personally message every existing contact who would want to know** | C |
| ☐ | Two Reels, reused on TikTok | C |
| ☐ | Ask three people to share the launch post | C |
| ☐ | First Monday batch runs. The weekly rhythm starts | C |
| ☐ | Every enquiry answered inside two hours | C |

The personal messages outperform all nine posts. Send them one at a time, never as a broadcast.

---

## Per piece — the intake loop

**Repeats for every new arrival. About fifteen minutes.** Print
[templates/photo-shot-list.md](templates/photo-shot-list.md) and keep it in the photography corner.

```
☐ 1  PHOTOGRAPH   five frames, brand ground, flash off, indoor lights off, AE/AF locked
☐ 2  SKU          npm run product:add -- <collection> <photo>
☐ 3  LOG          one Inventory row, cost price entered NOW
☐ 4  PUBLISH      fill the CSV row, status: real, npm run catalog
☐ 5  POST         add it to the Monday batch
```

The order is fixed. The SKU is minted at step 2 and everything downstream keys off it. Cost price
is knowable for about a day after arrival and is a guess forever after that.

---

## Daily — 20 minutes

**Morning**

- ☐ Clear `New enquiry` in WhatsApp. A real reply, not a holding message
- ☐ Post one story
- ☐ Work one label queue: `Sent details` or `Sourcing`

**End of day**

- ☐ **Log every sale into the Sales tab before closing the phone**
- ☐ Move every thread to the label that now describes it
- ☐ Reply to Instagram and TikTok comments and DMs

If the day collapses, the one item that cannot slip is logging the sale. It is the only one that
cannot be recovered later.

---

## Weekly — one hour, Monday

- ☐ **0–10** Sales and enquiries last week. Anything reserved and unpaid
- ☐ **10–20** What arrived, what is nearly gone, what has not moved in 60 days
- ☐ **20–45** Pick three pieces, shoot or pull, build three tiles, write three captions
- ☐ **45–55** Schedule Mon / Wed / Fri in Meta Business Suite, plus TikTok
- ☐ **55–60** Follow up every `Sent details` thread older than 48 hours. **Once each**

Pick the three pieces *before* opening Canva. Include one slow mover every week: the posting
schedule is also the merchandising schedule.

---

## Monthly — two hours, first working day

**Numbers**

- ☐ Revenue and margin, this month against last
- ☐ Margin %. If falling, is it discounting or a change in mix?
- ☐ Stock at cost. Growing faster than revenue?
- ☐ Top five by margin. These are the reorder candidates
- ☐ Channel breakdown
- ☐ Enquiry to sale %. Below 15% with healthy enquiries is a conversion problem, not a reach one

**Dead stock**

- ☐ Work the over-90-days list and decide on **every** row: discount, bundle, gift with purchase,
  or return to supplier

**Buying**

- ☐ Reorder from the margin list, not the units list
- ☐ One deliberate experiment outside the usual range. One, not five

**Content**

- ☐ Last month's posts sorted by saves and shares. What did the best three share?

**Housekeeping**

- ☐ Sheet exported: File → Download → Excel, into the Drive backup folder
- ☐ Month's photographs backed up
- ☐ **Message the `Repeat customer` label about new arrivals** (usually the best twenty minutes of
  the month)
- ☐ 2FA still on everywhere, recovery codes still stored

---

## Quarterly — half a day

- ☐ Prices: check the margin column across all of Inventory, correct anything that has drifted
- ☐ Website: `npm run catalog:check` reports zero placeholders
- ☐ Collections: is the eight-way split still right against real sales data?
- ☐ Suppliers: who is reliable, whose margins are worst, who has become a dependency
- ☐ Re-shoot the top five sellers. The first attempt is never the best one

---

## Still open — not blocking, do not forget

From [09](09-open-questions.md). Each one makes the business stronger when answered.

| | Question | Owner |
|---|---|---|
| ☐ | 7. Can suppliers be named publicly? | C |
| ☐ | 8. What can actually be sourced, and how fast? | C |
| ☐ | 9. Do the surviving craft descriptions match the real pieces? | C |
| ☐ | 10. Delivery within Douala or Yaoundé, or beyond? | C |
| ☐ | 11. Which privacy regime applies in Cameroon? | C |
| ☐ | 12. Does photography of the real pieces exist? | C |

When one is answered, propagate it in this order and tick it off:
`src/config/site.ts` → `data/products.csv` → `templates/whatsapp-scripts.md` →
`templates/inventory-sheet-spec.md` → `templates/profile-copy.md` → `CLAUDE.md`.

Leaving an answer in `09-open-questions.md` without propagating it is how two versions of the truth
start.

---

## Progress

| Phase | Items | Done | Date cleared |
|---|---|---|---|
| 0 — The blocker | 1 | | |
| 1 — Foundations | 32 | | |
| 2 — Catalog real | 16 | | |
| 3 — Go live quietly | 23 | | |
| Launch gate | 8 | | |
| 4 — Be visible | 7 | | |
