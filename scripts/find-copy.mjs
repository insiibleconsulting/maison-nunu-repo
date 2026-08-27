#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * "I can see this text on the site. Which file do I edit?"
 * ---------------------------------------------------------------------------
 *
 *   npm run find -- "chosen piece by piece"
 *   npm run find -- labradorite
 *
 * Why this exists rather than "just grep":
 *
 * 1. THE SITE USES TYPOGRAPHIC CHARACTERS. Copy a line out of the browser and
 *    you get a curly apostrophe (’), an em-dash (—), or the narrow no-break
 *    space ICU puts inside "118 000 FCFA". Type the same line on a keyboard and
 *    you get ' and - and a normal space. A plain grep finds nothing and you
 *    conclude the text is generated, or hiding, or that you misread it. This
 *    normalises both sides before comparing, so either spelling works.
 *
 * 2. MOST PRODUCT COPY IS GENERATED. Roughly 75 pieces live between the markers
 *    in src/data/catalog.ts, written from data/products.csv. Editing them there
 *    is silently undone by `npm run catalog` and blocked by `npm run
 *    catalog:check`. A raw grep points at the wrong file with no warning. This
 *    detects that and tells you the CSV row and column instead.
 *
 * It reads only. It never edits anything.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Fold the typographic characters onto their keyboard equivalents. */
const norm = (s) =>
  s
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[‐-―]/g, '-')
    .replace(/[    ]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

const needle = process.argv.slice(2).join(' ').trim();
if (!needle) {
  console.error('\n  usage: npm run find -- "text you can see on the site"\n');
  process.exit(1);
}
const target = norm(needle);

// --- where copy can live ---------------------------------------------------
const DIRS = ['src/pages', 'src/components', 'src/layouts', 'src/config', 'src/data', 'data'];
const EXT = new Set(['.astro', '.ts', '.csv', '.md']);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(path.join(ROOT, dir));
  } catch {
    return out;
  }
  for (const e of entries) {
    const rel = path.join(dir, e);
    const abs = path.join(ROOT, rel);
    if (statSync(abs).isDirectory()) walk(rel, out);
    else if (EXT.has(path.extname(e))) out.push(rel);
  }
  return out;
}

// --- the generated block ---------------------------------------------------
const CATALOG = 'src/data/catalog.ts';
let genStart = Infinity;
let genEnd = -1;
try {
  const lines = readFileSync(path.join(ROOT, CATALOG), 'utf8').split('\n');
  genStart = lines.findIndex((l) => l.includes('<<< generated')) + 1;
  genEnd = lines.findIndex((l) => l.includes('>>> end generated')) + 1;
} catch {}

/**
 * Which CSV row and column does a generated line belong to?
 *
 * Both lookups scan BACKWARDS, because the emitter puts long values on their
 * own line — `description:` sits above the string it introduces, so reading the
 * matched line alone yields no field name at all.
 */
function traceToCsv(lineNo) {
  const lines = readFileSync(path.join(ROOT, CATALOG), 'utf8').split('\n');
  let sku = null;
  let field = null;
  for (let i = lineNo - 1; i >= 0; i--) {
    if (!field) {
      const f = lines[i].match(/^\s{4}(\w+):/);
      if (f) field = f[1];
    }
    const m = lines[i].match(/sku: '([^']+)'/);
    if (m) {
      sku = m[1];
      break;
    }
  }
  return { sku, field };
}

// --- prices are not in the source ------------------------------------------
// They are stored as integers (`price: 118000`) and formatted at render time by
// Intl.NumberFormat, which is where the space in "118 000 FCFA" comes from. So
// searching a price as it appears on screen can never match. Say so, rather
// than reporting a bare "not found" that reads like the tool is broken.
if (/^[\d\s.,]+(fcfa|xaf)?$/i.test(needle.trim())) {
  const digits = needle.replace(/\D/g, '');
  console.log(`\n  "${needle}" looks like a price.\n`);
  console.log('  Prices are not stored as text — they are whole francs in the CSV,');
  console.log('  formatted for display at render time. Search the CSV for the number:\n');
  console.log(`    grep -n ',${digits},' data/products.csv\n`);
  console.log('  Then edit that row\'s "price" column and run:');
  console.log('    npm run catalog && npm run catalog:check\n');
  process.exit(0);
}

// --- search ----------------------------------------------------------------
// Matched against the WHOLE file, not line by line: the source is hard-wrapped,
// so most sentences you can read on the site are split across two or three
// lines and a per-line search misses them. Each normalised character keeps a
// pointer back to its original line so the report can still cite one.
const hits = [];
for (const rel of DIRS.flatMap((d) => walk(d))) {
  let text;
  try {
    text = readFileSync(path.join(ROOT, rel), 'utf8');
  } catch {
    continue;
  }
  const lines = text.split('\n');
  let flat = '';
  const lineAt = [];
  lines.forEach((line, i) => {
    // .trim() matters: source lines are indented, and norm() collapses that
    // indent to a single leading space. Joining then yields TWO spaces where
    // the reader sees one, and the search silently misses every phrase that
    // crosses a line break — which is most of them.
    const n = norm(line).trim() + ' ';
    flat += n;
    for (let k = 0; k < n.length; k++) lineAt.push(i + 1);
  });
  let idx = flat.indexOf(target);
  const found = new Set();
  while (idx !== -1) {
    const n = lineAt[idx];
    if (!found.has(n)) {
      found.add(n);
      const generated = rel === CATALOG && n > genStart && n < genEnd;
      hits.push({ rel, n, line: (lines[n - 1] || '').trim(), generated });
    }
    idx = flat.indexOf(target, idx + 1);
  }
}

// --- report ----------------------------------------------------------------
if (!hits.length) {
  console.log(`\n  No match for "${needle}".\n`);
  console.log('  Things worth trying:');
  console.log('    - a shorter fragment; long phrases often wrap across two lines in the source');
  console.log('    - a distinctive word rather than a whole sentence');
  console.log('    - if it is a price or a category name, it is generated — search the piece name instead\n');
  process.exit(0);
}

// Editable files first — the answer, before the caveats. Generated hits are
// collapsed to one line per SKU+column, since a single sentence can span
// several lines of emitted source and repeating the warning helps nobody.
const editable = hits.filter((h) => !h.generated);
const generated = hits.filter((h) => h.generated);

console.log(`\n  ${hits.length} match(es) for "${needle}"\n`);

if (editable.length) {
  console.log('  EDIT HERE\n');
  for (const h of editable) {
    console.log(`    ${h.rel}:${h.n}`);
    console.log(`      ${h.line.slice(0, 100)}\n`);
  }
}

if (generated.length) {
  const rows = new Map();
  for (const h of generated) {
    const { sku, field } = traceToCsv(h.n);
    if (sku) rows.set(`${sku}:${field}`, { sku, field });
  }
  const csvAlreadyShown = editable.some((h) => h.rel === 'data/products.csv');
  console.log(`  ALSO MATCHED IN THE GENERATED BLOCK (src/data/catalog.ts) — do not edit there\n`);
  for (const { sku, field } of rows.values()) {
    console.log(`    row ${sku}, column "${field ?? '?'}"`);
  }
  console.log(
    csvAlreadyShown
      ? '\n    The CSV line above is the one to change.'
      : '\n    Change it in data/products.csv.'
  );
  console.log('    Then: npm run catalog && npm run catalog:check\n');
}
