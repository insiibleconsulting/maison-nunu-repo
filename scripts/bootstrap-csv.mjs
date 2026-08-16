/**
 * ---------------------------------------------------------------------------
 * ONE-TIME: src/data/catalog.ts  ->  data/products.csv
 * ---------------------------------------------------------------------------
 *
 * Lifts the hand-written catalog into the spreadsheet that now owns it. Run once
 * to seed data/products.csv; after that the CSV is the source of truth and this
 * script would overwrite it, so it refuses to run unless --force is passed.
 *
 *   node scripts/bootstrap-csv.mjs
 *
 * Reads catalog.ts directly using Node's built-in TypeScript stripping, which
 * means the extraction is the real parsed data rather than a regex guess at it.
 * Requires Node >= 22.6.
 */

import { existsSync, writeFileSync } from 'node:fs';
import { CSV_PATH, toCsv, rel } from './lib/catalog-lib.mjs';

const force = process.argv.includes('--force');

if (existsSync(CSV_PATH) && !force) {
  console.error(
    `\n  ${rel(CSV_PATH)} already exists.\n\n` +
      `  It is the source of truth now — regenerating it from catalog.ts would\n` +
      `  discard whatever has been edited in the spreadsheet since. Pass --force\n` +
      `  only if you are certain that is what you want.\n`,
  );
  process.exit(1);
}

const { PRODUCTS } = await import('../src/data/catalog.ts');

/**
 * Everything currently in the catalog is invented copy against Unsplash stock
 * (CLAUDE.md § "What is real vs. placeholder"), so every row starts at
 * `placeholder`. Flipping a row to `real` is the client sign-off, one piece at
 * a time, and `npm run catalog:check` counts what is left.
 */
const rows = PRODUCTS.map((p) => ({
  sku: p.sku,
  slug: p.slug,
  name: p.name,
  category: p.category,
  price: p.price,
  material: p.material,
  blurb: p.blurb,
  description: p.description,
  details: p.details.join(' | '),
  featured: p.featured ? 'yes' : '',
  madeToOrder: p.madeToOrder ? 'yes' : '',
  status: 'placeholder',
  notes: '',
}));

writeFileSync(CSV_PATH, toCsv(rows), 'utf8');

console.log(`\n  Wrote ${rows.length} rows to ${rel(CSV_PATH)}.`);
console.log(`  Next: add the generated-block markers to catalog.ts, then run npm run catalog\n`);
