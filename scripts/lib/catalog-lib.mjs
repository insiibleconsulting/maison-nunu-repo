/**
 * ---------------------------------------------------------------------------
 * Shared plumbing for the catalog pipeline.
 * ---------------------------------------------------------------------------
 *
 * The pipeline runs one way and only one way:
 *
 *     photo filename  ->  SKU  ->  slug  ->  URL  ->  WhatsApp ref
 *     data/products.csv  +  public/products/*.jpg  ->  src/data/catalog.ts
 *
 * `data/products.csv` is the source of truth for the words. `src/data/catalog.ts`
 * is GENERATED between markers and must not be hand-edited inside them.
 *
 * Nothing here may be imported by src/ or functions/ — these are build-time
 * scripts only. catalog.ts keeps its zero-import rule (see CLAUDE.md § 5), which
 * is what lets the Cloudflare Pages Function import SKUS from it in the Workers
 * runtime.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const CSV_PATH = path.join(ROOT, 'data/products.csv');
export const RETIRED_PATH = path.join(ROOT, 'data/retired-skus.txt');
export const CATALOG_PATH = path.join(ROOT, 'src/data/catalog.ts');
export const PHOTO_DIR = path.join(ROOT, 'public/products');
export const PHOTO_URL_PREFIX = '/products';

/** The frame is aspect-ratio 4/5 with object-fit: cover. 800x1000 avoids upscaling. */
export const PHOTO_WIDTH = 800;
export const PHOTO_HEIGHT = 1000;
export const PHOTO_EXT = '.jpg';

/**
 * SKU prefix -> category id. This map is the reason a photo filename is enough
 * to place a piece: rng-09.jpg can only ever be a ring.
 *
 * Adding a collection means adding it here, to Category in catalog.ts, and to
 * ART in src/components/ProductImage.astro. check-catalog.mjs enforces all
 * three so a collection can never ship with an empty frame.
 */
export const PREFIX_TO_CATEGORY = {
  EAR: 'earrings',
  BRC: 'bracelets',
  NCK: 'necklaces',
  WCH: 'watches',
  RNG: 'rings',
  RFH: 'raffia',
  SUN: 'sunglasses',
  BRO: 'brooches',
};

export const CATEGORY_TO_PREFIX = Object.fromEntries(
  Object.entries(PREFIX_TO_CATEGORY).map(([prefix, category]) => [category, prefix]),
);

export const SKU_PATTERN = /^[A-Z]{3}-\d{2,}$/;

/**
 * Row lifecycle. `draft` is the important one: it lets a photo enter the repo
 * and get a permanent SKU before anybody has written a price or a description.
 * Draft rows are NOT emitted into catalog.ts, so an unfinished piece can never
 * reach the site — but its SKU is already reserved and its photo already sits
 * at the right filename.
 *
 *   draft       photo in, words pending. Invisible to the site.
 *   placeholder emitted, but the copy or price is invented. Reported every build.
 *   real        client-confirmed. The only status that should exist at launch.
 */
export const STATUSES = ['draft', 'placeholder', 'real'];

export const COLUMNS = [
  'sku',
  'slug',
  'name',
  'category',
  'price',
  'material',
  'blurb',
  'description',
  'details',
  'featured',
  'madeToOrder',
  'status',
  'notes',
];

/** Columns the site actually consumes. `status` and `notes` stay editorial. */
export const EMITTED_COLUMNS = COLUMNS.filter((c) => c !== 'status' && c !== 'notes');

// --- CSV -------------------------------------------------------------------
//
// Hand-rolled rather than a dependency, because the format we need is small and
// this file has to run before `npm install` has any say in it. RFC 4180: fields
// containing a comma, a quote or a newline are double-quoted, and a literal
// quote inside a quoted field is doubled.

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let i = 0;

  // Strip a UTF-8 BOM. Excel writes one, and it would otherwise become part of
  // the first header name and break every lookup with a baffling error.
  if (text.charCodeAt(0) === 0xfeff) i = 1;

  const endField = () => {
    row.push(field);
    field = '';
  };
  const endRow = () => {
    endField();
    // Ignore blank trailing lines rather than emitting a row of one empty cell.
    if (!(row.length === 1 && row[0] === '')) rows.push(row);
    row = [];
  };

  for (; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      endField();
    } else if (c === '\r') {
      // swallow; the \n that follows ends the row
    } else if (c === '\n') {
      endRow();
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) endRow();

  return rows;
}

export function csvEscape(value) {
  const s = String(value ?? '');
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows) {
  const lines = [COLUMNS.join(',')];
  for (const r of rows) lines.push(COLUMNS.map((c) => csvEscape(r[c])).join(','));
  return lines.join('\n') + '\n';
}

// --- Reading the source of truth -------------------------------------------

/**
 * Returns every row in file order. Order is meaningful: it drives the shop grid
 * and the order the client's range reads in. Reordering rows in the spreadsheet
 * reorders the site.
 */
export function readRows() {
  if (!existsSync(CSV_PATH)) {
    throw new Error(`Missing ${rel(CSV_PATH)} — run: npm run catalog:bootstrap`);
  }
  const rows = parseCsv(readFileSync(CSV_PATH, 'utf8'));
  if (!rows.length) throw new Error(`${rel(CSV_PATH)} is empty`);

  const header = rows[0].map((h) => h.trim());
  const missing = COLUMNS.filter((c) => !header.includes(c));
  if (missing.length) {
    throw new Error(`${rel(CSV_PATH)} is missing column(s): ${missing.join(', ')}`);
  }

  return rows.slice(1).map((cells, idx) => {
    const row = { __line: idx + 2 };
    header.forEach((name, col) => {
      row[name] = (cells[col] ?? '').trim();
    });
    return row;
  });
}

/** Rows the site renders. Draft rows are held back deliberately — see STATUSES. */
export function publishedRows(rows) {
  return rows.filter((r) => r.status !== 'draft');
}

export function readRetired() {
  if (!existsSync(RETIRED_PATH)) return new Set();
  return new Set(
    readFileSync(RETIRED_PATH, 'utf8')
      .split('\n')
      .map((l) => l.replace(/#.*$/, '').trim())
      .filter(Boolean),
  );
}

/** SKU -> absolute path, for every photo currently on disk. */
export function readPhotos() {
  if (!existsSync(PHOTO_DIR)) return new Map();
  const found = new Map();
  for (const name of readdirSync(PHOTO_DIR)) {
    if (path.extname(name).toLowerCase() !== PHOTO_EXT) continue;
    found.set(path.basename(name, path.extname(name)).toUpperCase(), path.join(PHOTO_DIR, name));
  }
  return found;
}

// --- Derivations -----------------------------------------------------------
//
// Each of these is one-way on purpose. A value you can derive is a value nobody
// can mistype.

export const photoFilename = (sku) => `${sku.toLowerCase()}${PHOTO_EXT}`;
export const photoPathFor = (sku) => path.join(PHOTO_DIR, photoFilename(sku));
export const imageUrlFor = (sku) => `${PHOTO_URL_PREFIX}/${photoFilename(sku)}`;
export const categoryOf = (sku) => PREFIX_TO_CATEGORY[sku.slice(0, 3)];

/**
 * URL segment. Only ever used to SUGGEST a slug when a piece is first added —
 * once a slug is written to the CSV it is frozen there, because changing it
 * breaks any link the client has already sent over WhatsApp.
 */
export function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents: Éventail -> eventail
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Next free number for a category, considering live rows AND retired SKUs, so a
 * retired ref can never be handed out a second time (CLAUDE.md § 6).
 */
export function nextSku(category, rows, retired) {
  const prefix = CATEGORY_TO_PREFIX[category];
  if (!prefix) throw new Error(`Unknown category "${category}"`);
  const taken = [...rows.map((r) => r.sku), ...retired].filter((s) => s?.startsWith(`${prefix}-`));
  const highest = taken.reduce((max, s) => Math.max(max, Number(s.slice(4)) || 0), 0);
  return `${prefix}-${String(highest + 1).padStart(2, '0')}`;
}

// --- Emitting catalog.ts ---------------------------------------------------

export const BEGIN_MARK = '  // <<< generated from data/products.csv — do not edit by hand';
export const END_MARK = '  // >>> end generated';

const quote = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function emitProduct(row, hasPhoto) {
  const details = row.details
    .split('|')
    .map((d) => d.trim())
    .filter(Boolean);

  const lines = [
    '  {',
    `    sku: ${quote(row.sku)},`,
    `    slug: ${quote(row.slug)},`,
    `    name: ${quote(row.name)},`,
    `    category: ${quote(row.category)},`,
    `    price: ${row.price},`,
    `    material: ${quote(row.material)},`,
    `    blurb: ${quote(row.blurb)},`,
    '    description:',
    `      ${quote(row.description)},`,
    `    details: [${details.map(quote).join(', ')}],`,
    // Null renders the line-art placeholder in ProductImage.astro. A piece with
    // no photograph therefore degrades to a marked "IMAGE PENDING" frame rather
    // than to a broken <img>.
    `    image: ${hasPhoto ? quote(imageUrlFor(row.sku)) : 'null'},`,
  ];
  if (isTrue(row.featured)) lines.push('    featured: true,');
  if (isTrue(row.madeToOrder)) lines.push('    madeToOrder: true,');
  lines.push('  },');
  return lines.join('\n');
}

export function isTrue(value) {
  return ['yes', 'y', 'true', '1', 'x'].includes(String(value ?? '').trim().toLowerCase());
}

/** The full text catalog.ts should have, given the CSV and the photos on disk. */
export function renderCatalog(rows, photos, currentText) {
  const begin = currentText.indexOf(BEGIN_MARK);
  const end = currentText.indexOf(END_MARK);
  if (begin === -1 || end === -1) {
    throw new Error(
      `${rel(CATALOG_PATH)} has no generated block. Expected the marker lines:\n` +
        `${BEGIN_MARK}\n${END_MARK}`,
    );
  }
  const body = publishedRows(rows)
    .map((r) => emitProduct(r, photos.has(r.sku)))
    .join('\n');

  return (
    currentText.slice(0, begin + BEGIN_MARK.length) +
    '\n' +
    body +
    '\n' +
    currentText.slice(end)
  );
}

// --- Reporting -------------------------------------------------------------

export const rel = (p) => path.relative(ROOT, p) || p;

export function makeReport() {
  const errors = [];
  const warnings = [];
  const notes = [];
  return {
    errors,
    warnings,
    notes,
    error: (m) => errors.push(m),
    warn: (m) => warnings.push(m),
    note: (m) => notes.push(m),
    /** Prints and returns a process exit code. */
    print(title) {
      const out = [];
      for (const n of notes) out.push(`  ${n}`);
      for (const w of warnings) out.push(`  warn   ${w}`);
      for (const e of errors) out.push(`  ERROR  ${e}`);
      console.log(`\n${title}\n${out.join('\n') || '  nothing to report'}\n`);
      if (errors.length) {
        console.log(
          `  ${errors.length} error(s), ${warnings.length} warning(s) — build blocked.\n`,
        );
        return 1;
      }
      console.log(`  0 errors, ${warnings.length} warning(s).\n`);
      return 0;
    },
  };
}
