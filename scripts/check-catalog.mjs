/**
 * ---------------------------------------------------------------------------
 * Catalog gate. Runs before every build.
 * ---------------------------------------------------------------------------
 *
 *   npm run catalog:check      # on its own
 *   npm run build              # runs it first; a failure blocks the build
 *
 * Every check here corresponds to a way the catalog can be wrong that a page
 * still renders happily through. That is the whole selection criterion — a
 * broken layout announces itself, a price that is 100x too low does not.
 *
 * ERRORS block the build. WARNINGS do not, and are reserved for states that are
 * legitimately mid-workflow: a piece whose photo has not arrived yet, copy the
 * client has not signed off. Those must stay noisy without being fatal, or the
 * gate gets bypassed and stops being a gate.
 */

import { readFileSync } from 'node:fs';
import {
  CATALOG_PATH,
  CSV_PATH,
  PHOTO_DIR,
  PHOTO_WIDTH,
  PHOTO_HEIGHT,
  PREFIX_TO_CATEGORY,
  SKU_PATTERN,
  STATUSES,
  readRows,
  publishedRows,
  readPhotos,
  readRetired,
  renderCatalog,
  categoryOf,
  slugify,
  photoFilename,
  isTrue,
  makeReport,
  rel,
  ROOT,
} from './lib/catalog-lib.mjs';
import path from 'node:path';

const r = makeReport();
const rows = readRows();
const live = publishedRows(rows);
const photos = readPhotos();
const retired = readRetired();
const at = (row) => `${row.sku || '(no sku)'} (${rel(CSV_PATH)}:${row.__line})`;

// --- 1. identity ------------------------------------------------------------

const seenSku = new Map();
const seenSlug = new Map();

for (const row of rows) {
  if (!row.sku) {
    r.error(`${rel(CSV_PATH)}:${row.__line} has no SKU`);
    continue;
  }
  if (!SKU_PATTERN.test(row.sku)) {
    r.error(`${at(row)} malformed — expected three uppercase letters, a dash, two digits`);
  }
  if (seenSku.has(row.sku)) {
    r.error(`${at(row)} duplicates the SKU on line ${seenSku.get(row.sku)}`);
  }
  seenSku.set(row.sku, row.__line);

  // The single most consequential check in this file. A reissued SKU points
  // historical lead-spreadsheet rows at a piece that is not what was enquired
  // about, and nothing anywhere looks broken.
  if (retired.has(row.sku)) {
    r.error(`${at(row)} is RETIRED and must never be reissued — pick the next free number`);
  }

  const prefixCategory = categoryOf(row.sku);
  if (!prefixCategory) {
    r.error(`${at(row)} has prefix "${row.sku.slice(0, 3)}", which maps to no collection`);
  } else if (row.category && row.category !== prefixCategory) {
    r.error(`${at(row)} is in "${row.category}" but its prefix says "${prefixCategory}"`);
  }
}

for (const row of live) {
  if (!row.slug) {
    r.error(`${at(row)} has no slug — suggested: ${slugify(row.name) || 'set a name first'}`);
    continue;
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(row.slug)) {
    r.error(`${at(row)} slug "${row.slug}" is not lowercase-kebab-case`);
  }
  if (seenSlug.has(row.slug)) {
    r.error(`${at(row)} slug "${row.slug}" collides with line ${seenSlug.get(row.slug)} — one page would win and the other would vanish`);
  }
  seenSlug.set(row.slug, row.__line);
}

// --- 2. money ---------------------------------------------------------------
//
// XAF is zero-decimal (CLAUDE.md § 7). `price` is whole francs and there is no
// /100 anywhere downstream, so a decimal point here would render the piece 100x
// too cheap on a live page with no other symptom.

for (const row of live) {
  const raw = row.price;
  if (!/^\d+$/.test(raw)) {
    r.error(`${at(row)} price "${raw}" must be whole francs — digits only, no decimal point, no separator`);
  } else if (Number(raw) <= 0) {
    r.error(`${at(row)} price is ${raw}`);
  } else if (Number(raw) < 1000) {
    // 1000 XAF is roughly GBP 1.30. Anything under it is almost certainly a
    // price entered in the wrong unit.
    r.warn(`${at(row)} price is ${raw} FCFA — suspiciously low for XAF, check the unit`);
  }
}

// --- 3. copy ----------------------------------------------------------------

for (const row of live) {
  for (const field of ['name', 'material', 'blurb', 'description']) {
    if (!row[field]) r.error(`${at(row)} has no ${field}`);
  }
  const details = row.details.split('|').map((d) => d.trim()).filter(Boolean);
  if (!details.length) r.error(`${at(row)} has no details — the product page renders an empty list`);

  if (row.status && !STATUSES.includes(row.status)) {
    r.error(`${at(row)} status "${row.status}" is not one of: ${STATUSES.join(', ')}`);
  }
  for (const flag of ['featured', 'madeToOrder']) {
    if (row[flag] && !isTrue(row[flag]) && row[flag].toLowerCase() !== 'no') {
      r.error(`${at(row)} ${flag} is "${row[flag]}" — use "yes" or leave it empty`);
    }
  }
  // Straight apostrophes read as a different typeface next to the curly ones
  // used everywhere else, and the house convention is typographic (CLAUDE.md
  // § Conventions).
  for (const field of ['name', 'blurb', 'description', 'details']) {
    if (row[field].includes("'")) r.warn(`${at(row)} ${field} uses a straight apostrophe — use ’`);
  }
}

// --- 4. photographs ---------------------------------------------------------

const draftSkus = new Set(rows.filter((row) => row.status === 'draft').map((row) => row.sku));

for (const row of live) {
  if (!photos.has(row.sku)) {
    r.warn(`${at(row)} has no ${photoFilename(row.sku)} — renders the IMAGE PENDING placeholder`);
  }
}

for (const sku of photos.keys()) {
  if (seenSku.has(sku) || draftSkus.has(sku)) continue;
  r.error(
    `${rel(path.join(PHOTO_DIR, photoFilename(sku)))} has no row in ${rel(CSV_PATH)} — ` +
      `either the filename is wrong or the row was deleted`,
  );
}

// Casing matters: readPhotos() uppercases the stem, so RNG-01.jpg and rng-01.jpg
// both resolve — but only the lowercase form matches what imageUrlFor() writes,
// and Cloudflare serves paths case-sensitively.
for (const [sku, file] of photos) {
  const actual = path.basename(file);
  if (actual !== photoFilename(sku)) {
    r.error(`public/products/${actual} must be named ${photoFilename(sku)} — the served path is case-sensitive`);
  }
}

// --- 5. photograph dimensions ----------------------------------------------
//
// Optional: sharp is used if present. The frame is aspect-ratio 4/5 with
// object-fit: cover, so any ratio crops cleanly — this catches upscaling and
// weight, not breakage.

let sharp = null;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  r.note(`sharp not installed — skipping image dimension checks (npm i -D sharp)`);
}

if (sharp) {
  const { statSync } = await import('node:fs');
  for (const [sku, file] of photos) {
    let meta;
    try {
      meta = await sharp(file).metadata();
    } catch {
      r.error(`${rel(file)} is not a readable image`);
      continue;
    }
    if (meta.width < PHOTO_WIDTH || meta.height < PHOTO_HEIGHT) {
      r.warn(`${photoFilename(sku)} is ${meta.width}x${meta.height} — under ${PHOTO_WIDTH}x${PHOTO_HEIGHT}, it will upscale`);
    }
    const kb = Math.round(statSync(file).size / 1024);
    if (kb > 250) r.warn(`${photoFilename(sku)} is ${kb}KB — re-run npm run product:add to re-encode it`);
  }
}

// --- 6. collections ---------------------------------------------------------
//
// Three files have to agree about what a collection is, or a category renders an
// empty grid or an empty frame. The typechecker catches one of the three; this
// catches the other two.

const catalogText = readFileSync(CATALOG_PATH, 'utf8');
const artText = readFileSync(path.join(ROOT, 'src/components/ProductImage.astro'), 'utf8');
const declared = [...catalogText.matchAll(/^\s*\{ id: '([a-z]+)',/gm)].map((m) => m[1]);

for (const category of Object.values(PREFIX_TO_CATEGORY)) {
  if (!declared.includes(category)) {
    r.error(`collection "${category}" has a SKU prefix but no entry in CATEGORIES — it will not appear in the shop filter`);
  }
  if (!new RegExp(`^\\s{2}${category}:`, 'm').test(artText)) {
    r.error(`collection "${category}" has no line art in ProductImage.astro — a piece without a photo would render an empty frame`);
  }
  if (!live.some((row) => row.category === category)) {
    r.warn(`collection "${category}" has no published pieces — its filter shows an empty grid`);
  }
}

for (const category of declared) {
  if (!Object.values(PREFIX_TO_CATEGORY).includes(category)) {
    r.error(`CATEGORIES declares "${category}" but no SKU prefix maps to it — nothing can ever be added to it`);
  }
}

// --- 7. drift ---------------------------------------------------------------
//
// The one check that makes the rest trustworthy. If someone edits catalog.ts by
// hand inside the generated block, or edits the CSV and forgets to regenerate,
// the site ships something the source of truth does not say.

if (renderCatalog(rows, photos, catalogText) !== catalogText) {
  r.error(`${rel(CATALOG_PATH)} is out of date with ${rel(CSV_PATH)} — run: npm run catalog`);
}

// --- summary ----------------------------------------------------------------

const placeholders = live.filter((row) => row.status === 'placeholder');
const drafts = rows.filter((row) => row.status === 'draft');

r.note(`${live.length} published · ${drafts.length} draft · ${photos.size} photographs`);
if (placeholders.length) {
  r.note(`${placeholders.length} piece(s) still marked "placeholder" — invented copy, not client-confirmed`);
}
if (drafts.length) {
  r.note(`draft (photo in, words pending): ${drafts.map((row) => row.sku).join(', ')}`);
}

process.exit(r.print('catalog check'));
