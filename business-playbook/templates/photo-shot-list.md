# Template — photo shot list

Print this and keep it in the photography corner. One page, one piece, four minutes.

Full method and the reasons behind each step are in `04-product-photography.md`.

---

## Before the first frame

- [ ] Lens cleaned
- [ ] Piece cleaned with the microfiber
- [ ] **Flash off**
- [ ] **Every indoor light off.** Window light only. Mixed light turns gold green or pink
- [ ] Correct ground: beige `#ede9e4` for most, midnight `#1a222d` for gold and warm metals
- [ ] White bounce card on the shadow side
- [ ] Grid on, phone level, straight on
- [ ] **Tap to focus, hold until AE/AF LOCK appears**

---

## The five frames

| # | Shot | How | Goes to |
|---|---|---|---|
| 1 | **Hero** | Straight on, centered, whole piece, brand ground, 4:5 | Website, Instagram feed |
| 2 | **Detail** | Macro. Texture, clasp, stone, weave. Fill the frame | Detail tile, carousel |
| 3 | **Scale** | On a hand, wrist, ear or neck | **WhatsApp. The one that closes sales** |
| 4 | **Angle** | 45 degrees, showing depth and thickness | Carousel slide 3 |
| 5 | **Context** | Packaging, a tray, next to a related piece | Stories, proof posts |

Five to eight frames of each. Storage is free, re-staging is not.

**Shot 3 is not optional.** "Face 11mm × 9mm" means nothing written down. On a finger it is obvious
in a quarter second, and sizing uncertainty is the most common reason a WhatsApp sale stalls.

---

## Immediately after, before the phone goes down

- [ ] Pick the best hero. One only
- [ ] Crop it 4:5 (Photos → Edit → aspect 4:5)
- [ ] **Rename it to the lowercase SKU**: `rng-01.jpg`
- [ ] Move the other four into a folder named for the SKU

```
  photos/
    RNG-01/
      rng-01.jpg        ← the hero, goes to the website
      detail-01.jpg
      scale-01.jpg
      angle-01.jpg
      context-01.jpg
```

**The filename is the link.** `RNG-01` looks for `/products/rng-01.jpg`. No path is stored anywhere
in the code. Wrong case, a suffix, or `IMG_4471.jpg` and the site renders a placeholder instead.

```
  rng-01.jpg          ✓
  RNG-01.JPG          ✗  case matters
  rng-01-final.jpg    ✗
  IMG_4471.jpg        ✗
```

Rename **now**, not later. A folder of `IMG_` files is an hour of work that did not need to exist,
and it is how pieces end up with the wrong photograph attached.

---

## Into the website

**New piece, no SKU yet** — the script mints the SKU, crops to 800×1000 and appends a draft row:

```bash
npm run product:add -- rings ~/Desktop/new-ring.jpg
npm run product:add -- watches ~/Desktop/shoot/      # whole folder, filename order
```

Then fill the row in `data/products.csv`, set `status: real`, and regenerate:

```bash
npm run catalog
npm run build
```

**Replacing a photo on an existing SKU:**

```bash
cp ~/photos/RNG-01/rng-01.jpg public/products/rng-01.jpg
npm run catalog
```

Never edit `image` by hand in `src/data/catalog.ts`. That block is generated, the build gate rejects
hand edits, and the filename already carries the information.

---

## Target specs

```
  800 × 1000 px      4:5, matches the site frame and the tallest Instagram feed crop
  under 250 KB       the build check flags anything heavier
  JPEG               not HEIC, not PNG
  lowercase SKU      rng-01.jpg
```

The check also flags anything that would upscale, so shoot larger than 800×1000 and let it come
down.

---

## Quick fault finder

| It looks like | It is | Fix |
|---|---|---|
| Gray, flat, lifeless | Light from behind the phone | Move the light to the side |
| Green or pink gold | Mixed light sources | Turn off every indoor light |
| Blown white patches on metal | Over-exposed | Slide exposure down before shooting |
| The set doesn't match | Exposure re-metered between shots | Lock AE/AF, same ground, same distance |
| Soft edges, small piece | Inside the lens's minimum focus | Back off, crop in after |
| Fingerprints | Handled without the cloth | Wipe between every frame |
| Background isn't brand beige | Card creased or lit unevenly | Flatten it, move it away from the wall |

---

## Weekly

- [ ] Every new piece has all five frames
- [ ] Every hero renamed, cropped and copied into `public/products/`
- [ ] `npm run catalog` run, `npm run build` passing
- [ ] `Photo done` set to `yes` in the Inventory tab
- [ ] Folders backed up to Drive or iCloud
