# 06 — Enquiry to sale

The website's only job is to open a WhatsApp thread. Everything after that is this file.

**This is where the business is won or lost.** A shop with mediocre photographs that replies in ten
minutes outsells a beautiful one that replies tomorrow. Reply speed is free, it is entirely within
the client's control, and almost nobody does it well.

---

## WhatsApp Business setup

Free, one evening, all inside the app. Do every item.

### 1. The business profile

Settings → Business tools → Business profile.

| Field | What goes in it |
|---|---|
| Name | `Maison Nunu` |
| Category | Jewelry / Shopping & retail |
| Description | The website tagline: *Fine jewelry & accessories. A chosen selection, brought together piece by piece.* |
| Address | Only if there is a real one. `By appointment` if not |
| Hours | Must match the website's `SITE.hours` exactly |
| Email | `info@maisonnunu.com` |
| Website | `https://maisonnunu.com` |

**Hours have to match the site.** They appear on the contact page, in the away message, and in the
profile. Three different answers to "when are you open" reads as carelessness.

### 2. Two-step verification

Settings → Account → Two-step verification → turn on, set a PIN.

This number is the entire sales channel. Without a PIN, a SIM swap hands the business to someone
else. Do this first, not last.

### 3. Greeting message

Sent automatically to anyone messaging for the first time, or after 14 days of silence. Keep it
short. A long automated wall is the first thing that makes a shop feel like a bot.

```
Hi, thanks for messaging Maison Nunu 🤍

Tell me which piece you're looking at and I'll send photos,
sizing and availability.
```

### 4. Away message

Set it to outside business hours, matching the profile hours.

```
Thanks for your message. We're away right now and will reply
when we open, Mon to Sun, 7am to 7pm.

If it's about a specific piece, send the ref code (for example
RNG-01) and it'll be waiting for you.
```

The ref code ask is deliberate: it means the overnight message arrives already actionable.

### 5. Labels

Settings → Business tools → Labels. This is the pipeline, and WhatsApp gives it away free.

| Label | Means | Next action |
|---|---|---|
| `New enquiry` | Not yet replied | Reply today |
| `Sent details` | Photos and price sent | Follow up in 48 hours, once |
| `Reserved` | Piece held for them | Hold 48 hours, then release |
| `Awaiting payment` | Agreed, not paid | Follow up in 24 hours |
| `Sold` | Paid and handed over | Log it in the Sales tab |
| `Sourcing` | Asked for something not in stock | Come back with an answer, even a no |
| `Repeat customer` | Bought before | Tell them first about new arrivals |

**`Repeat customer` is the most valuable label in the app.** A message to that list when new stock
arrives is the highest-converting thing the business can do, and it costs nothing.

**`Sourcing` is the second.** Every unanswered sourcing request is a customer who decided you could
not help. Come back with a real answer, including "I could not find it," within a week.

### 6. Quick replies

Settings → Business tools → Quick replies. Type `/` plus the shortcut and the message expands.
Full text in [`templates/whatsapp-scripts.md`](templates/whatsapp-scripts.md).

| Shortcut | Covers |
|---|---|
| `/size` | Ring sizing, how to measure at home |
| `/care` | Vermeil and plating care, pulled from the site's `/guide/` |
| `/see` | Arranging a time to see a piece in person |
| `/pay` | How to pay. **Blank until the client confirms** |
| `/source` | "Tell me what you're looking for and I'll check" |
| `/ref` | Asking for a ref code when someone sends a screenshot |

### 7. Catalog

Business tools → Catalog. Add the fast movers, not everything. A catalog of 75 items on a phone is
unusable. Ten to fifteen, refreshed monthly, with the ref code in the product name so it matches the
website and the sheet.

---

## The rules that actually move the number

**1. Reply inside two hours during business hours. No exceptions.**
This is the single highest-leverage habit available. Set the phone to keep WhatsApp notifications
on. A reply that arrives while the customer is still looking at the piece converts several times
better than one that arrives that evening.

**2. Never answer a price question with only a price.**
A number with nothing around it invites a comparison and ends the conversation. Price, one concrete
line about the piece, then a question.

> *145 000 FCFA. It's 9ct gold vermeil with a hand-brushed face, and it takes engraving well.
> Do you know your ring size, or shall I send you how to measure?*

**3. Ask for the decision.**
The most common failure in a WhatsApp shop is a great conversation that nobody closes. Ask plainly:
*Shall I set it aside for you?* Most people will say yes or no, and either is better than the
conversation simply stopping.

**4. Follow up once, at 48 hours. Then stop.**
One follow-up is service. Three is pressure, and in a small market pressure costs referrals. If
the 48-hour message gets nothing, leave the thread labeled and move on. They may come back in
March.

**5. Answer sizing with a photograph, not a measurement.**
"Face 11mm × 9mm" means nothing to most buyers. A photo on a hand answers it instantly. This is
what shot 3 in the photography shot list is for.

**6. Never claim Maison Nunu made the piece.**
Not in a message, not casually, not to close a sale. "Hand stamped" is true whoever sells it.
"We make these" is not, and a provenance claim about jewelry is one a customer can hold the
business to. This is `CLAUDE.md` invariant 5c and it applies to typed messages as much as to
published copy.

**7. Say "I don't know, I'll check" when you don't know.**
Then check, and come back. A reseller's credibility is built out of accurate small answers.

---

## What is not confirmed yet

Three facts are missing and the site deliberately renders nothing rather than guessing. Do not fill
these in from assumption, in WhatsApp or anywhere else:

| Fact | Status | Where it is needed |
|---|---|---|
| Handover | **Confirmed.** In person, by appointment, arranged in the chat | `COMMERCE.handover` |
| Payment methods | **Not confirmed** | `COMMERCE.payment`, the `/pay` quick reply, the Sales tab dropdown |
| Exchange / wrong size | **Not confirmed** | `COMMERCE.exchange`, and every conversation about sizing |

`COMMERCE_INCOMPLETE` in `src/config/site.ts` flags this in the build. Get the answers before
launch, from the client's own words. See `09-open-questions.md`.

---

## The website link, and getting it right

Every CTA on the site builds a `wa.me` link at build time. The format is unforgiving and it fails
silently: a malformed number opens WhatsApp with "phone number shared via url is invalid" and the
enquiry is gone, with nothing visibly broken to anyone.

```
  https://wa.me/<digits only>?text=<url-encoded message>

  digits only     no +, no spaces, no dashes, no brackets
  country code    first
  no leading zero on the national part
```

The number lives in `PUBLIC_WA_NUMBER` and nowhere else: a gitignored `.env` for local work, and a
Cloudflare Pages environment variable for the live site. **Never hardcode it into a file.** If it is
unset, the site disables every CTA and shows a banner, which is deliberate. A plausible fallback
number would route every enquiry to a stranger with nothing appearing broken.

The verification procedure is in `CLAUDE.md` under "Verifying the deep link end to end". Run it
after touching the number, and **test on a real handset before launch.** Nothing so far confirms
WhatsApp actually opens correctly on a phone, only that the link is built correctly.
