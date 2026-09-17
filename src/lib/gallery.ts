/**
 * ---------------------------------------------------------------------------
 * CUSTOMER GALLERY — read at build time from data/gallery.csv
 * ---------------------------------------------------------------------------
 * Source of truth is the CSV plus the photographs on disk, the same shape as
 * the product catalog: a spreadsheet needs no service, no account and no build
 * minutes, and it hands over to a non-technical editor without a rewrite.
 *
 * Unlike `src/data/catalog.ts` this is NOT a generated literal, because nothing
 * in the Pages Function's import graph touches it. That means it can use
 * node:fs directly and there is no generated block to drift. Keep it that way:
 * if the Function ever needs gallery data, this file has to be split first.
 *
 * It deliberately carries its own CSV parser rather than importing the one in
 * `scripts/lib/catalog-lib.mjs`. `src/` should not depend on build tooling, and
 * that module is untyped JS which would cost `astro check` its clean run.
 *
 * It also avoids node:fs on purpose. The project has no @types/node, and adding
 * it to read one small file would put a dependency in a client deliverable for
 * no gain: Vite already resolves both the CSV text and the photo list at build
 * time, which is when this runs.
 *
 * ---------------------------------------------------------------------------
 * THIS FILE FAILS CLOSED, AND THAT IS THE WHOLE POINT
 * ---------------------------------------------------------------------------
 * Every row here is a photograph of a real, identifiable person. Publishing one
 * without recorded permission is the highest-consequence mistake available on
 * this site: it is not a broken layout, it is someone's face on a shop window
 * they did not agree to. So a row renders ONLY when all of these hold:
 *
 *   1. `consent` is exactly "yes" (lowercase). Blank, "y", "YES", "pending",
 *      "asked" — all excluded. There is no fuzzy matching on purpose.
 *   2. The photograph exists at public/gallery/<id>.jpg.
 *   3. `sku` names a piece that is actually in the catalog, so the tile cannot
 *      link to a 404.
 *
 * Anything short of that is dropped and reported in the build log. Do not
 * "helpfully" loosen these checks to make a row appear.
 */
import { PRODUCTS } from '../data/catalog';

/*
 * Both of these are resolved by Vite at BUILD time, so this module needs no
 * node:fs and the project needs no @types/node. `?raw` inlines the CSV text;
 * the glob returns one key per photograph actually present on disk.
 */
import CSV_TEXT from '../../data/gallery.csv?raw';

const PHOTO_KEYS = new Set(
  Object.keys(import.meta.glob('/public/gallery/*.jpg')).map(
    (k) => k.split('/').pop()!.replace(/\.jpg$/, ''),
  ),
);

export interface GalleryEntry {
  /** Stable slug. Also the photo filename: `2026-09-amina` -> /gallery/2026-09-amina.jpg */
  id: string;
  /** FIRST NAME ONLY. Never a surname, never a phone number. */
  name: string;
  city: string;
  /** Ref code of the piece, used to link the tile at the product page. */
  sku: string;
  quote: string;
  date: string;
  image: string;
  /** Resolved from the SKU so the tile can name the piece. */
  productName: string;
  productSlug: string;
}

/**
 * Minimal RFC-4180 CSV reader: handles quoted fields, embedded commas,
 * doubled quotes and CRLF. Enough for a hand-edited sheet, and small enough to
 * read in one sitting.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  // Excel writes a BOM, which would otherwise become part of the first header.
  let i = text.charCodeAt(0) === 0xfeff ? 1 : 0;

  for (; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      field = '';
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((c) => c !== '')) rows.push(row);
  return rows;
}

function load(): GalleryEntry[] {
  const rows = parseCsv(CSV_TEXT);
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim());
  const entries: GalleryEntry[] = [];
  const skipped: string[] = [];

  for (const cells of rows.slice(1)) {
    const get = (key: string) => (cells[header.indexOf(key)] ?? '').trim();
    const id = get('id');
    if (!id) continue;

    // 1. consent, exact match only
    if (get('consent') !== 'yes') {
      skipped.push(`${id}: consent is "${get('consent') || 'blank'}", not "yes"`);
      continue;
    }
    // 2. the photograph has to be there
    if (!PHOTO_KEYS.has(id)) {
      skipped.push(`${id}: no photo at public/gallery/${id}.jpg`);
      continue;
    }
    // 3. the piece has to be real, or the tile links nowhere
    const sku = get('sku');
    const product = PRODUCTS.find((p) => p.sku === sku);
    if (!product) {
      skipped.push(`${id}: sku "${sku || 'blank'}" is not in the catalog`);
      continue;
    }

    entries.push({
      id,
      name: get('name'),
      city: get('city'),
      sku,
      quote: get('quote'),
      date: get('date'),
      image: `/gallery/${id}.jpg`,
      productName: product.name,
      productSlug: product.slug,
    });
  }

  if (skipped.length) {
    // Visible in the build log. A row the client believes is live but is not is
    // its own kind of failure, so silence would be the wrong default here.
    console.warn(
      `[gallery] ${skipped.length} row(s) held back:\n  ${skipped.join('\n  ')}`,
    );
  }

  // Newest first, so the page leads with the most recent handover.
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export const GALLERY: GalleryEntry[] = load();
