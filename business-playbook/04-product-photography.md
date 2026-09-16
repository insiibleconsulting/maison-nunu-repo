# 04 — Product photography

A phone-only workflow that produces one photograph good enough for the website, the Instagram grid
and a WhatsApp reply, with no re-shooting and no editing app.

**The current photographs on the website are Unsplash stock, licensed for demo use only.** They are
not Maison Nunu's pieces and cannot go live as if they were. Replacing them is the largest single
piece of pre-launch work and this file is how it gets done.

---

## The setup, once

Total cost: under 15 000 FCFA, most of it optional.

| Item | Why | Cost |
|---|---|---|
| A window facing north, or any window out of direct sun | Soft, consistent, free light | 0 |
| A sheet of beige card or matte paper, A3 | The brand ground `#ede9e4`. Consistency across the grid | ~1 000 |
| A sheet of dark navy card, A3 | The `#1a222d` ground for gold pieces and dark tiles | ~1 000 |
| White foam board or a sheet of white A3 | Bounces light back into the shadow side | ~1 000 |
| A small stack of books | Raises the piece to window height | 0 |
| A microfiber cloth | Fingerprints on metal ruin more shots than bad light | ~500 |
| A phone tripod or a propped-up box | Keeps framing identical between pieces | ~8 000 |

**Set it up once and leave it set up.** The reason product photography stops happening is that it
takes twenty minutes to arrange. If the corner is permanently ready, a new piece takes four minutes.

### The arrangement

```
        window  ░░░░░░░░░░
                    │  soft light from the side
                    ↓
              ╭───────────╮
   white  ▐    │   piece   │       phone on tripod,
   bounce ▐    │  on card  │  ←──  straight on, level
   card   ▐    ╰───────────╯       with the piece
```

Light from the side, never from behind the phone. Front light flattens metal and kills the thing
that makes jewelry worth photographing.

---

## Shooting

**Before the first frame**

1. Clean the lens. Then clean the piece with the microfiber.
2. Turn the flash **off**. Permanently.
3. Turn on the grid (Settings → Camera → Grid on iPhone) to keep things level.
4. Set the aspect ratio to **4:3** and crop to 4:5 later, or shoot 4:5 directly if the phone offers
   it. More pixels now means more crop room later.

**Every frame**

5. **Do not zoom.** Pinch zoom is a crop, and it throws away resolution. Move the phone closer.
6. **Tap the piece to focus, then hold until AE/AF LOCK appears.** This stops the phone
   re-metering between shots, which is what makes a set of photos look like they came from
   different days.
7. If the piece looks dull, slide the exposure down slightly rather than up. Metal reads better
   slightly under-exposed. Blown highlights on gold cannot be recovered.
8. Shoot five to eight frames of each angle. Storage is free, re-staging is not.

**Common failures, in order of frequency**

| Symptom | Cause | Fix |
|---|---|---|
| Piece looks gray and flat | Light from behind the phone | Move the light to the side |
| Gold looks green or pink | Mixed light: window plus a ceiling bulb | Turn off every indoor light |
| Grid looks inconsistent | Exposure re-metered per shot | Lock AE/AF, keep the same ground |
| Soft edges on a small piece | Phone too close for its minimum focus | Back off, then crop in |
| Fingerprints everywhere | Handled without the cloth | Wipe between every frame |
| Background is not brand beige | Card lit unevenly, or the wrong card | Flatten the card, check the color |

---

## The shot list

Five frames per piece. The first is mandatory, the rest take two extra minutes each and pay for
themselves in WhatsApp replies.

| # | Shot | Used for |
|---|---|---|
| 1 | **Hero.** Straight on, centered, full piece, brand beige, 4:5 | Website product page, Instagram feed |
| 2 | **Detail.** Macro of texture, clasp, stone, weave | Grid detail tile, carousel slide 2 |
| 3 | **Scale.** On a hand, wrist, ear or neck | The most requested thing in WhatsApp. "How big is it?" |
| 4 | **Angle.** 45 degrees, showing depth and thickness | Carousel slide 3 |
| 5 | **In context.** Packaging, a tray, alongside a related piece | Stories, proof posts |

Shot 3 answers the question that stops sales. A ring at 11mm × 9mm means nothing written down. On a
finger it is obvious in a quarter second.

---

## The crop that matters

**800 × 1000 pixels, 4:5, JPEG, under 250 KB.**

That is the website's product frame, and it is also Instagram's tallest feed crop. Shoot once, crop
once, use everywhere.

The site's build check flags any image that will upscale or that exceeds 250 KB, so getting this
right saves a round trip. Crop on the phone (Photos → Edit → aspect 4:5), then let the intake script
do the resize.

---

## Naming, and why it is the whole trick

**The filename is the link between the photograph and the website.** There is no path stored
anywhere in the code. `RNG-01` looks for `/products/rng-01.jpg`, finds it or does not, and if it
does not, the site renders a line-art placeholder rather than a broken image.

So:

```
  rng-01.jpg      lowercase SKU, .jpg, nothing else
  ────────────────────────────────────────────────
  NOT   IMG_4471.jpg
  NOT   RNG-01.JPG          (case matters)
  NOT   rng-01-final-v2.jpg
```

**Rename the hero shot the moment it comes off the phone, before anything else.** A folder of
`IMG_4471.jpg` is an hour of work that did not need to exist, and it is how pieces end up with the
wrong photograph attached.

The other four shots are for social and WhatsApp. Keep them in a folder named by SKU:

```
  photos/
    RNG-01/
      rng-01.jpg          ← the hero. Copied to public/products/
      detail-01.jpg
      scale-01.jpg
      angle-01.jpg
      context-01.jpg
```

---

## Into the website

Two routes, both one command.

**A new piece that has no SKU yet.** The script mints the next free SKU, crops the photograph to
800×1000, writes the file, and appends a draft row to `data/products.csv`:

```bash
npm run product:add -- rings ~/Desktop/new-ring.jpg
npm run product:add -- watches ~/Desktop/shoot/        # a whole folder, in filename order
```

The row lands as `status: draft`, which reserves the SKU and holds the piece off the live site until
the copy is written. Fill in the name, price, material and description in the CSV, change `status`
to `real`, then:

```bash
npm run catalog          # regenerates src/data/catalog.ts from the CSV plus the photos
npm run build            # the gate runs first and fails if anything drifted
```

**Replacing a stock photo on an existing SKU.** Drop the new file over the old name and regenerate:

```bash
cp ~/photos/RNG-01/rng-01.jpg public/products/rng-01.jpg
npm run catalog
```

Never edit `image` by hand in `src/data/catalog.ts`. That block is generated, the build gate will
reject a hand edit, and the filename already carries the information.

---

## Backup

Phone photographs are the only copy until they are not. Google Drive or iCloud, folder per SKU,
synced automatically, checked once a month. A lost phone should cost a phone, not a catalog.
