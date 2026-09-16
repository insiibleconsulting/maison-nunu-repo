# 09 — Open questions

Only the client can answer these. Until they do, the corresponding fields stay blank on the website
and in the templates, because a guess here is a promise the business has to keep.

Work through them in one sitting with the client, write the answers down in their own words, and
date them. Questions 1 to 6 block launch.

---

## Blocking

### 1. The WhatsApp number and the Cloud API

> Has `+237 6 71 73 52 66` ever been registered with the WhatsApp Cloud API or Business Platform,
> by a previous developer or anyone else?

**Why it matters:** a number on the Cloud API can no longer be used in the WhatsApp Business app.
The entire site routes enquiries to that app. A yes forces an architecture change, not a fix. It is
the single highest-consequence unknown remaining.

*Answer:*
*Date:*

### 2. Payment

> What can a customer actually pay with? Cash, MTN MoMo, Orange Money, bank transfer, card,
> something else? Is a deposit ever taken to reserve a piece, and how much?

**Why it matters:** `COMMERCE.payment` in `src/config/site.ts` is deliberately empty and renders
nothing rather than guessing. It also fills the `/pay` quick reply and the Payment dropdown in the
Sales tab. Removing the checkout removed the place where payment options normally appear, and
nothing replaced it.

*Answer:*
*Date:*

### 3. Wrong size, change of mind

> What happens when a ring does not fit, or a customer changes their mind? Exchange, credit,
> nothing? Within how long? Who pays for resizing?

**Why it matters:** `COMMERCE.exchange` is empty for the same reason. This is also the most common
hesitation in a WhatsApp jewelry sale, and a clear answer converts.

*Answer:*
*Date:*

### 4. Business details

> Trading name as registered. A real address or confirmation that it is genuinely by appointment.
> Actual opening hours. The email address to publish.

**Why it matters:** `SITE.email`, `SITE.location` and `SITE.hours` are still generic placeholders,
and `hours` has to match the WhatsApp profile and away message exactly.

*Answer (partial):* **Hours confirmed — Mon to Sun, 7am to 7pm.** Set in `SITE.hours` and mirrored
in the WhatsApp away message. Trading name, address and published email are still outstanding.
*Date: 16 September 2026*

### 5. Language

> Should the site and the social accounts be English, French, or both?

**Why it matters:** the brand name is French, Cameroon is bilingual, and most of the likely customer
base in Douala and Yaoundé is francophone. All copy is currently English. **Nothing is set up for
i18n** and adding it is a real piece of work, not a toggle, so this is a decision to make before
more copy is written rather than after.

Working recommendation until decided: keep the website English, and write social captions as an
English paragraph with a one-line French summary underneath. It costs one line and doubles the
room it can land in.

*Answer:*
*Date:*

### 6. The real catalog

> For every piece in stock: real name, cost price, list price, material, one honest sentence.

**Why it matters:** all 75 rows in `data/products.csv` are `status: placeholder`, and every price
and description in them is invented. `npm run catalog:check` prints the remaining count on every
build. **That number reaching zero is the content half of launch readiness**, and nothing else in
this folder substitutes for it.

*Answer:*
*Date:*

---

## Important, not blocking

### 7. Suppliers, and whether they can be named

> Who are the suppliers, and are you allowed to say their names publicly?

**Why it matters:** now that Maison Nunu is positioned as a retailer, the copy leans on "makers we
rate" without ever saying who. A curated shop usually earns trust by naming what it carries. If
brand names can be used, that is a materially stronger site than the anonymous version. If they
cannot, the current wording is the right fallback, but that should be a decision rather than an
omission.

*Answer:*
*Date:*

### 8. What can actually be sourced

> The site says it shows what we carry, not everything we can get. Is that true? How long does
> sourcing take, and what is the realistic range?

**Why it matters:** `/shop/` already makes this promise and a customer will test it. "I can get
that" is also the strongest differentiator a reseller has, so it is worth being precise about
rather than vague.

*Answer:*
*Date:*

### 9. Do the descriptions match the real pieces

> Copy like "hand stamped", "hand-enamelled" and "woven by hand" survived the rewrite because it
> describes a product truthfully regardless of who sells it. Is it true of what you actually stock?

**Why it matters:** it is still invented copy about invented pieces. It has to become true of real
ones, or be removed. In jewelry these are claims a customer can hold the business to.

*Answer:*
*Date:*

### 10. Delivery and handover

> Handover is confirmed as in person, by appointment. Is there ever delivery within Douala or
> Yaoundé, or shipping beyond? Who arranges it, who pays?

**Why it matters:** the second most common question after price, and the site currently answers only
the in-person case.

*Answer:*
*Date:*

### 11. Privacy and data

> Which privacy regime applies in Cameroon, and does the contact form's consent line need changing?

**Why it matters:** the site collects a name, a phone number and an enquiry note into a Google
Sheet. `src/pages/privacy.astro` currently describes that in generic terms. Worth a check by
someone who knows local law before it is published against a real trading name.

*Answer:*
*Date:*

### 12. Photography

> Does any photography of the real pieces exist? If not, who shoots it and when?

**Why it matters:** the current images are Unsplash stock, licensed for demo use only. They are not
Maison Nunu's pieces and cannot go live as if they were. `04-product-photography.md` covers doing it
on a phone if no photographer is involved.

*Answer:*
*Date:*

---

## How to use this file

Fill the answers in directly, with dates. Then update in this order:

1. `src/config/site.ts` — `SITE.email`, `location`, `hours`, `COMMERCE.payment`, `COMMERCE.exchange`
2. `data/products.csv` — real rows, `status: real`, then `npm run catalog`
3. `templates/whatsapp-scripts.md` — the `/pay` and exchange replies
4. `templates/inventory-sheet-spec.md` — the Payment dropdown values
5. `templates/profile-copy.md` — anything that changes in the bios
6. `CLAUDE.md` — move each answered item out of its "Open questions" section

Leaving an answer in this file and not propagating it is how two versions of the truth start.
