# 02 — The brand on social

How to make Instagram and TikTok look like the same business as the website, using the client's own
style guide.

---

## The palette, and the rule nobody wrote down

The brand style guide gives four colors. The website only ever built half of the system, and the
half it left out is the half social media needs.

| Name | Hex | Where it belongs |
|---|---|---|
| Burgundy | `#7a2036` | Accents on light surfaces. Text, rules, small marks |
| Soft beige | `#ede9e4` | The light ground. Most product tiles sit on this |
| Midnight blue | `#1a222d` | The dark ground. Quote tiles, price tiles, covers |
| Gold | `#c89a6a` | Accents on dark surfaces only |

**The rule, derived from the guide's own stationery:**

> **Burgundy accents light surfaces. Gold accents dark ones.** Never the other way around.

This is arithmetic, not taste. Gold on beige is 2.06:1, which is not legible as text. Burgundy on
midnight is 1.59:1, which is invisible. Both of those pairings will look fine on the phone you
designed them on and unreadable on someone else's.

The safe pairings, with their contrast ratios:

```
  BURGUNDY  #7a2036  on  BEIGE     #ede9e4     8.32:1   ✓ headlines, body, prices
  MIDNIGHT  #1a222d  on  BEIGE     #ede9e4    13.26:1   ✓ anything
  GOLD      #c89a6a  on  MIDNIGHT  #1a222d     6.32:1   ✓ headlines, prices, rules
  BEIGE     #ede9e4  on  MIDNIGHT  #1a222d    13.26:1   ✓ anything
  ────────────────────────────────────────────────────
  GOLD      #c89a6a  on  BEIGE     #ede9e4     2.10:1   ✗ never
  BURGUNDY  #7a2036  on  MIDNIGHT  #1a222d     1.59:1   ✗ never
```

**Why the website looks different:** the site uses `--oyster #eae7e5` (a hair cooler than the
guide's beige, near identical in practice) and `--brass #755417` instead of gold, because gold fails
contrast on a light page and the site has no dark surface. Social does have dark surfaces, so social
gets to use the real gold. This is a feature, not a drift. The two read as one brand because the
burgundy is identical in both.

---

## Type

The guide names **Playfair Display**. The website uses Fraunces instead, deliberately, because
Playfair's hairline strokes are hard to read at 16px on a screen.

Social graphics are display type at large sizes, which is exactly what Playfair is for. So:

- **Social graphics: Playfair Display.** Free on Google Fonts, built into Canva.
- **Website body copy: Fraunces + Archivo.** Unchanged.

Setup for social:

| Role | Font | Treatment |
|---|---|---|
| Headline | Playfair Display, Regular or Medium | Sentence case. Generous line height (1.25) |
| Price / ref code | Playfair Display | Letter-spaced +4%, smaller than the headline |
| Small print, captions in-image | Inter or Archivo, Regular | Only where Playfair gets too small to read |

**Sentence case, always.** Not Title Case, not ALL CAPS for headlines. The website is sentence case
throughout because Title Case reads corporate and fights a small independent's voice. The grid has
to match.

The only permitted all-caps is a ref code (`RNG-01`) or a short label, letter-spaced, small.

---

## The logo on social

Sources are in `assets/Final_logo/`. Four lockups: Wording, Horizontal, Vertical, Icon.

**Use the PNGs. Ignore the SVGs.** Every supplied SVG is a base64 raster in an SVG wrapper, so it
carries no vector benefit at roughly three times the file size. The `.ai` and `.eps` files are the
real vectors, for print only.

| Where | Which lockup |
|---|---|
| Instagram / TikTok / Facebook profile picture | **Icon**, centered, on beige |
| Post tile corner mark | **Wording**, small, burgundy on light or gold-tinted on dark |
| Video end card | **Vertical**, centered |
| Packaging, signage, anything printed | the `.ai` or `.eps`, never the PNG |

Profile picture specifics: the circle crop eats the corners. Place the Icon at roughly 70% of the
square's width, centered, on `#ede9e4`. Export at 1000×1000 PNG. Check it at thumbnail size before
committing, because that is the only size anyone sees it at.

Rules for the mark: never recolor it, never stretch it, never add a drop shadow or an outer glow,
never place it over a busy area of a photograph. If it needs to sit on a photo, put it in a clear
corner or on a solid block.

---

## The grid

An Instagram profile is judged in one glance, at nine tiles. Individual posts are judged in the
feed. Both have to work, and the way to get both is a repeating rhythm rather than a rule for every
tile.

### The nine-tile rhythm

```
  ┌─────────┬─────────┬─────────┐
  │ PRODUCT │ DETAIL  │ MIDNIGHT│   row 1
  │  beige  │  macro  │  quote  │
  ├─────────┼─────────┼─────────┤
  │  WORN   │ PRODUCT │ PRODUCT │   row 2
  │ on body │  beige  │  beige  │
  ├─────────┼─────────┼─────────┤
  │ MIDNIGHT│ DETAIL  │  WORN   │   row 3
  │  price  │  macro  │ on body │
  └─────────┴─────────┴─────────┘
```

Roughly: **five product shots, two dark text tiles, two worn or in-context shots per nine.** The two
dark tiles are what give the grid rhythm and stop it reading as a catalog dump. They are also the
cheapest posts to make, which matters on a week when there is no new stock.

Do not plan further ahead than the current row. Planning a whole grid in advance is how people stop
posting.

### Format specs

| Surface | Ratio | Pixels | Notes |
|---|---|---|---|
| Instagram feed | 4:5 | 1080×1350 | Same crop as the website product frame. Shoot once, use twice |
| Instagram story / Reel | 9:16 | 1080×1920 | Keep text inside the middle 80%, the edges get covered |
| TikTok | 9:16 | 1080×1920 | Same |
| Profile picture | 1:1 | 1000×1000 | Icon lockup on beige |

**4:5 is the important one.** It is the website's product frame (`aspect-ratio: 4/5`) and Instagram's
tallest feed crop. Shooting to it means one photograph serves the site and the grid with no
re-cropping. See `04-product-photography.md`.

---

## Tile recipes

Three templates cover almost everything. Build them once in Canva as a brand kit, then reuse.

**A. Product tile (light).** Photograph on beige, full bleed. No text over the piece. If a price is
needed, a burgundy bar across the bottom 15% with the price and ref code in Playfair. Corner mark
optional, small.

**B. Statement tile (dark).** `#1a222d` ground. One line of Playfair in `#c89a6a`, centered,
generous margins, nothing else. Used for a styling note, a piece of advice, opening hours, or an
announcement. Never more than twelve words.

**C. Detail tile.** Macro of texture, a clasp, a stone, a weave. No text at all. These are the
scroll-stoppers and they are free to make from photographs already taken.

### What never goes on a tile

- Gold text on the beige ground (see the arithmetic above)
- More than one font
- Emoji inside the image. In the caption is fine
- A price without a ref code, or a ref code without a price. They travel together
- Any sentence claiming Maison Nunu made the piece

---

## Voice

Same as the website, for the same reasons.

- **Sentence case.** Typographic apostrophes (’), not straight ones.
- **American spelling: jewelry.** The logo artwork reads `JEWELRY & ACCESSORIES`, and the site was
  moved to match. Keep social consistent with the logo.
- **Short. Specific. Quiet.** "9ct gold vermeil, 1.2mm, sold singly" outperforms "✨ Absolutely
  stunning must-have piece ✨" with the customer this brand wants.
- **Describe the piece, never claim authorship.** "Hand stamped" is true whoever sells it. "Our
  house signet" is not. This is `CLAUDE.md` invariant 5c and it applies to every caption, story and
  reply.
- **Always close with the next step.** Every caption ends with a way into WhatsApp.

Language: all copy is currently English. Cameroon is bilingual and most of the likely customer base
in Douala and Yaoundé is francophone. See `09-open-questions.md` question 5. The working
recommendation until the client decides: **English caption, one-line French summary underneath.**
It costs one line and doubles the room it can land in.
