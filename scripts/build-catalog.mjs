/**
 * ---------------------------------------------------------------------------
 * data/products.csv + public/products/*.jpg  ->  src/data/catalog.ts
 * ---------------------------------------------------------------------------
 *
 *   npm run catalog
 *
 * Rewrites only the marked block inside catalog.ts. Everything outside it — the
 * Category union, the Product interface, CATEGORIES, formatPrice and the rest —
 * stays hand-written, because that is where the decisions live.
 *
 * Two things happen automatically and are worth knowing about:
 *
 *   image      derived from the SKU. If public/products/<sku>.jpg exists the
 *              path is written; if it does not, `image: null` is written and the
 *              piece renders the marked "IMAGE PENDING" line art instead of a
 *              broken <img>. Dropping the photo in later needs no code change.
 *
 *   retirement any SKU that was in catalog.ts and is no longer in the CSV gets
 *              appended to data/retired-skus.txt with the date. Deleting a row
 *              therefore burns its ref code permanently, which is exactly the
 *              rule in CLAUDE.md § 6 — reusing one silently repoints historical
 *              lead-spreadsheet data at the wrong product.
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import {
  CATALOG_PATH,
  RETIRED_PATH,
  readRows,
  publishedRows,
  readPhotos,
  readRetired,
  renderCatalog,
  rel,
} from './lib/catalog-lib.mjs';

const rows = readRows();
const photos = readPhotos();
const current = readFileSync(CATALOG_PATH, 'utf8');

const live = publishedRows(rows);

// --- retire anything that has left the catalog -----------------------------
// Read the SKUs the file currently declares, before we overwrite them. Drafts
// count as live: their SKU is reserved, they are simply not published yet.
const previousSkus = [...current.matchAll(/^\s*sku: '([^']+)',$/gm)].map((m) => m[1]);
const allCsvSkus = new Set(rows.map((r) => r.sku));
const retired = readRetired();
const newlyRetired = previousSkus.filter((s) => !allCsvSkus.has(s) && !retired.has(s));

if (newlyRetired.length) {
  const stamp = new Date().toISOString().slice(0, 10);
  if (!existsSync(RETIRED_PATH)) {
    writeFileSync(
      RETIRED_PATH,
      '# Retired SKUs — never reissue.\n' +
        '#\n' +
        '# The SKU is the ref code the client reads in WhatsApp and the key in the lead\n' +
        '# spreadsheet. Handing a retired one to a different piece silently repoints\n' +
        '# historical lead data at the wrong product.\n' +
        '#\n' +
        '# Appended automatically by scripts/build-catalog.mjs when a row leaves\n' +
        '# data/products.csv. Never delete a line from this file.\n\n',
      'utf8',
    );
  }
  appendFileSync(RETIRED_PATH, newlyRetired.map((s) => `${s}  # retired ${stamp}\n`).join(''), 'utf8');
}

// --- write ------------------------------------------------------------------
const next = renderCatalog(rows, photos, current);
const changed = next !== current;
if (changed) writeFileSync(CATALOG_PATH, next, 'utf8');

const drafts = rows.length - live.length;
const missingPhotos = live.filter((r) => !photos.has(r.sku)).length;
const placeholders = live.filter((r) => r.status === 'placeholder').length;

console.log(`\n  ${rel(CATALOG_PATH)} ${changed ? 'updated' : 'already up to date'}`);
console.log(`  ${live.length} published · ${drafts} draft · ${placeholders} still placeholder copy`);
if (missingPhotos) console.log(`  ${missingPhotos} published piece(s) rendering line art — no photo yet`);
if (newlyRetired.length) console.log(`  retired: ${newlyRetired.join(', ')} -> ${rel(RETIRED_PATH)}`);
console.log(`  Now run: npm run catalog:check\n`);
