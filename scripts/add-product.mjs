/**
 * ---------------------------------------------------------------------------
 * Photograph in -> SKU minted, photo processed, CSV row appended.
 * ---------------------------------------------------------------------------
 *
 *   npm run product:add -- rings ~/Desktop/IMG_1234.jpg
 *   npm run product:add -- rings ~/Desktop/IMG_1234.jpg "Noor Band"
 *   npm run product:add -- watches ~/Desktop/new-shoot/          # whole folder
 *
 * You never choose a SKU. The next free number for the collection is taken from
 * the CSV and from data/retired-skus.txt together, so a retired ref can never be
 * handed out twice (CLAUDE.md § 6).
 *
 * The photo is re-encoded to 800x1000 (the frame is aspect-ratio 4/5, object-fit
 * cover) and written as public/products/<sku>.jpg. That filename IS the link
 * between the photo and the catalog — nothing stores an image path by hand.
 *
 * New rows land as `draft`: reserved SKU, photo in place, invisible to the site
 * until you fill in the price and copy and set status to `real`. That is what
 * makes it safe to empty a whole shoot into the repo in one go.
 */

import { readFileSync, writeFileSync, statSync, readdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import {
  CSV_PATH,
  CATEGORY_TO_PREFIX,
  PHOTO_WIDTH,
  PHOTO_HEIGHT,
  readRows,
  readRetired,
  toCsv,
  nextSku,
  slugify,
  photoPathFor,
  photoFilename,
  rel,
} from './lib/catalog-lib.mjs';

const [category, source, name] = process.argv.slice(2);

if (!category || !source) {
  console.error(
    `\n  usage: npm run product:add -- <collection> <photo|folder> ["Piece name"]\n\n` +
      `  collections: ${Object.keys(CATEGORY_TO_PREFIX).join(', ')}\n`,
  );
  process.exit(1);
}

if (!CATEGORY_TO_PREFIX[category]) {
  console.error(`\n  "${category}" is not a collection. One of: ${Object.keys(CATEGORY_TO_PREFIX).join(', ')}\n`);
  process.exit(1);
}

// Collect the photos to process, in a stable order so a re-run of the same
// folder assigns the same SKUs.
const stat = statSync(source, { throwIfNoEntry: false });
if (!stat) {
  console.error(`\n  No such file or folder: ${source}\n`);
  process.exit(1);
}
const files = stat.isDirectory()
  ? readdirSync(source)
      .filter((f) => /\.(jpe?g|png|webp|tiff?|heic|avif)$/i.test(f))
      .sort()
      .map((f) => path.join(source, f))
  : [source];

if (!files.length) {
  console.error(`\n  No images found in ${source}\n`);
  process.exit(1);
}
if (files.length > 1 && name) {
  console.error(`\n  A name only makes sense for a single photo — ${files.length} were found.\n`);
  process.exit(1);
}

let sharp = null;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.warn(`\n  sharp is not installed — photos will be copied as-is, not re-encoded.`);
  console.warn(`  Install it with: npm i -D sharp\n`);
}

const rows = readRows();
const retired = readRetired();
const minted = [];

for (const file of files) {
  // Recompute each time so the second photo in a folder gets the next number,
  // not the same one.
  const sku = nextSku(category, [...rows, ...minted], retired);
  const target = photoPathFor(sku);

  if (sharp) {
    await sharp(file)
      // `cover` matches the CSS: the frame crops rather than letterboxes, so
      // what you see in the browser is what this produces.
      .resize(PHOTO_WIDTH, PHOTO_HEIGHT, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(target);
  } else {
    copyFileSync(file, target);
  }

  const pieceName = name || '';
  minted.push({
    sku,
    slug: pieceName ? slugify(pieceName) : '',
    name: pieceName,
    category,
    price: '',
    material: '',
    blurb: '',
    description: '',
    details: '',
    featured: '',
    madeToOrder: '',
    status: 'draft',
    notes: `photo from ${path.basename(file)}`,
  });

  const kb = Math.round(statSync(target).size / 1024);
  console.log(`  ${path.basename(file)}  ->  ${photoFilename(sku)}  (${kb}KB)`);
}

// Append rather than rewrite: the CSV may be open in a spreadsheet, and the row
// order is meaningful (it drives the shop grid), so nothing existing is touched.
const existing = readFileSync(CSV_PATH, 'utf8');
const appended = toCsv(minted).split('\n').slice(1).join('\n');
writeFileSync(CSV_PATH, existing.replace(/\n*$/, '\n') + appended.replace(/\n*$/, '\n'), 'utf8');

console.log(`\n  Minted ${minted.length} SKU(s): ${minted.map((m) => m.sku).join(', ')}`);
console.log(`  Added as draft rows at the end of ${rel(CSV_PATH)}.\n`);
console.log(`  Next:`);
console.log(`    1. fill in name, slug, price, material, blurb, description, details`);
console.log(`    2. set status to "real" (or "placeholder" if the copy is still invented)`);
console.log(`    3. move the row to where it should appear in its collection`);
console.log(`    4. npm run catalog && npm run catalog:check\n`);
