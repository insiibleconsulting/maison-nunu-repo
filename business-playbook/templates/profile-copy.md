# Template — profile copy

Copy-paste text for every platform. Character limits are real and the platforms truncate silently,
so the counts are given. Verify after editing.

Everything here follows the site's conventions: sentence case, typographic apostrophes (’),
American spelling (**jewelry**, matching the logo artwork), and no claim that Maison Nunu made
anything.

---

## Instagram

**Name field** (30 characters, and it is searchable, so put the category in it)

```
Maison Nunu · Jewelry
```

**Username**

```
maisonnunu
```

**Bio** (150 characters)

```
Fine jewelry & accessories, chosen piece by piece.
Douala · by appointment
Message us to see anything in person ↓
```

Swap `Douala` for the real city once question 4 in `09-open-questions.md` is answered. If the
business is genuinely appointment-only with no public address, `By appointment` on its own is
honest and fine.

**Link**

```
https://maisonnunu.com
```

Not Linktree. The website already has a shop with category and price filters, which is a better
landing page than a list of buttons, and it keeps the click.

**Contact options** → **WhatsApp Business number**

This is the single highest-value setting on the account. It puts a WhatsApp button on the profile
that opens a thread in one tap, with no link involved. Edit profile → Contact options → WhatsApp.

**Category:** Jewelry / Shopping & retail
**Action button:** none. The WhatsApp contact button is better than any of them.

### Story highlight covers

Five, no more. Plain `#1a222d` ground, the word in `#c89a6a` Playfair Display, centered. Consistent
covers are most of what makes a profile look considered.

| Cover | Holds |
|---|---|
| `New in` | Recent arrivals. Refresh monthly |
| `Rings` | Rotate the collection name to whatever is selling |
| `Worn` | Customers and on-body shots. The proof highlight |
| `Care` | Sizing and care, pulled from the site's `/guide/` |
| `How to buy` | Hours, handover, payment once confirmed, the WhatsApp button |

`How to buy` is the one people actually open before a first purchase. Keep it current.

---

## TikTok

**Name** (30 characters)

```
Maison Nunu
```

**Bio** (80 characters, and it is tight)

```
Fine jewelry & accessories, chosen piece by piece. Douala.
```

**Link**

```
https://maisonnunu.com
```

---

## Facebook Page

The Page mostly exists so Instagram's business tools, scheduling and the WhatsApp button work. It
does not need its own content strategy. Cross-post from Instagram and leave it.

**Page name:** `Maison Nunu`
**Category:** Jewelry & Watches Store
**Short description** (255 characters)

```
Fine jewelry and accessories, chosen piece by piece. Message us on WhatsApp to see anything in
person. By appointment.
```

**Button:** WhatsApp

---

## WhatsApp Business profile

| Field | Value |
|---|---|
| Name | `Maison Nunu` |
| Category | Jewelry / Shopping & retail |
| Description | `Fine jewelry & accessories. A chosen selection, brought together piece by piece.` |
| Address | Real address, or `By appointment` |
| Hours | **Must match `SITE.hours` in `src/config/site.ts` exactly** |
| Email | `info@maisonnunu.com` |
| Website | `https://maisonnunu.com` |

---

## Google Business Profile

Worth doing if there is any physical presence, even appointment-only. It is free, it puts the
business on Maps, and it is one of the few places a local search can find it.

- Name: `Maison Nunu`
- Category: Jewelry store
- Add the WhatsApp number as the phone
- Add the website
- Add ten product photographs, the same heroes used on the site
- If there is no public address, set it as a service-area business rather than inventing a location

Skip it entirely if the client does not want an address discoverable. Do not invent one.

---

## The lines to reuse everywhere

Consistency across platforms is most of what makes a small shop look established. These are the
approved phrasings. Do not improvise new ones per platform.

| Use | Line |
|---|---|
| One-line description | `Fine jewelry & accessories, chosen piece by piece.` |
| Longer description | `A chosen selection of jewelry and accessories, brought together piece by piece. Everything here is one conversation away.` |
| Call to action | `Message us to see anything in person.` |
| Sourcing line | `Looking for something we don’t have? Ask. We can often source it.` |
| Handover | `In person, by appointment. We agree a time and a place in the chat.` |

**None of these claims Maison Nunu made anything.** "Chosen", "brought together" and "we can source
it" are all things a retailer legitimately does. Keep any new line on that side of the line. See
`CLAUDE.md` invariant 5c.
