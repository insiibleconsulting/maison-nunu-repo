/**
 * ---------------------------------------------------------------------------
 * PLACEHOLDER CATALOG
 * ---------------------------------------------------------------------------
 * Everything downstream derives from this file: the shop grid, the product
 * pages, the WhatsApp message text, and the SKU allowlist that the Pages
 * Function validates against. Replace these entries with the client's real
 * pieces and the rest of the site follows automatically.
 *
 * SKU rules:
 *   - stable and unique — it is the ref code the client sees in WhatsApp
 *     and in the lead spreadsheet
 *   - never reuse a SKU for a different piece, or historical lead data
 *     silently starts pointing at the wrong product
 */

export type Category = 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'accessories';

export interface Product {
  /** Ref code shown to the client. Uppercase, category-prefixed. */
  sku: string;
  /** URL segment: /shop/aurelia-signet-ring */
  slug: string;
  name: string;
  category: Category;
  /**
   * Whole francs. XAF is a zero-decimal currency — there is no centime in
   * circulation — so the smallest unit IS the franc. Stored as an integer,
   * which keeps it free of float rounding without needing a minor-unit scheme.
   *
   * If the shop ever moves to a two-decimal currency, this field and
   * formatPrice() both need revisiting together.
   */
  price: number;
  material: string;
  /** One line for the shop grid. */
  blurb: string;
  /** Fuller copy for the product page. */
  description: string;
  details: string[];
  /** Path under /public. Null renders the generated SVG placeholder. */
  image: string | null;
  featured?: boolean;
  madeToOrder?: boolean;
}

/**
 * Central African CFA franc, as used in Cameroon.
 *
 * LOCALE is fr-CM rather than en-CM deliberately: it renders "145 000 FCFA"
 * with the unit trailing, which is how prices are written in Cameroon.
 * en-CM would give "FCFA 145,000", which no one there writes.
 */
export const CURRENCY = 'XAF';
export const LOCALE = 'fr-CM';

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: 'rings', label: 'Rings', blurb: 'Signets, stacking bands and statement stones.' },
  { id: 'necklaces', label: 'Necklaces', blurb: 'Fine chains, pendants and layering pieces.' },
  { id: 'earrings', label: 'Earrings', blurb: 'Studs, hoops and drops.' },
  { id: 'bracelets', label: 'Bracelets', blurb: 'Cuffs, chains and charm bases.' },
  { id: 'accessories', label: 'Accessories', blurb: 'Silk, leather and the small things.' },
];

export const PRODUCTS: Product[] = [
  {
    sku: 'RNG-01',
    slug: 'aurelia-signet-ring',
    name: 'Aurelia Signet Ring',
    category: 'rings',
    price: 145000,
    material: '9ct gold vermeil',
    blurb: 'A classic signet with a hand-brushed face, ready to engrave.',
    description:
      'The Aurelia is our house signet — a softly domed face on a tapered band, finished by hand so no two catch the light in quite the same way. Left plain it reads as quiet everyday gold; engraved, it becomes an heirloom.',
    details: ['Face 11mm × 9mm', 'Sizes G–U', 'Hand engraving available', 'Presented in a gift box'],
    image: null,
    featured: true,
  },
  {
    sku: 'RNG-02',
    slug: 'thread-stacking-band',
    name: 'Thread Stacking Band',
    category: 'rings',
    price: 52000,
    material: 'Sterling silver',
    blurb: 'A 1.2mm band made to be worn three or four at a time.',
    description:
      'Deliberately fine, deliberately plain. The Thread band is the piece you buy one of and come back for three more of. Wear them stacked on one finger or spread across the hand.',
    details: ['1.2mm width', 'Sizes F–T', 'Available in silver or vermeil', 'Sold individually'],
    image: null,
  },
  {
    sku: 'RNG-03',
    slug: 'noor-stone-ring',
    name: 'Noor Stone Ring',
    category: 'rings',
    price: 245000,
    material: '14ct gold, labradorite',
    blurb: 'A single labradorite in a low bezel setting.',
    description:
      'One hand-cut labradorite, set low so it sits close to the finger and survives real life. Labradorite flashes blue and green as it moves, which means every stone we set is genuinely one of a kind.',
    details: ['Stone approx. 8mm', 'Sizes H–S', 'Made to order, 3–4 weeks', 'Stone selected with you over WhatsApp'],
    image: null,
    featured: true,
    madeToOrder: true,
  },
  {
    sku: 'NCK-01',
    slug: 'petit-curb-chain',
    name: 'Petit Curb Chain',
    category: 'necklaces',
    price: 98000,
    material: 'Gold vermeil',
    blurb: 'A fine curb chain that layers without tangling.',
    description:
      'Flat-linked so it lies against the skin instead of rolling, which is what makes it the layering chain we recommend first. Wears beautifully alone at 42cm or under a longer pendant.',
    details: ['42cm with 5cm extender', '1.8mm link', 'Lobster clasp', 'Also available in 45cm'],
    image: null,
    featured: true,
  },
  {
    sku: 'NCK-02',
    slug: 'lune-pendant',
    name: 'Lune Pendant',
    category: 'necklaces',
    price: 118000,
    material: 'Sterling silver, freshwater pearl',
    blurb: 'A single baroque pearl on a fine box chain.',
    description:
      'Each Lune uses a baroque freshwater pearl chosen for its irregularity — the lopsided ones are the point. Suspended off-centre so it moves as you do.',
    details: ['Pearl 9–11mm, each unique', '45cm box chain', 'Pearl shape varies by piece', 'Photograph sent before dispatch'],
    image: null,
  },
  {
    sku: 'NCK-03',
    slug: 'initial-charm-necklace',
    name: 'Initial Charm Necklace',
    category: 'necklaces',
    price: 128000,
    material: 'Gold vermeil',
    blurb: 'A hand-stamped initial disc. Add as many as you like.',
    description:
      'Stamped one letter at a time by hand, so the spacing has a little human wander to it. Most people start with one and add a charm per birth, per anniversary, per whatever they decide counts.',
    details: ['12mm disc', 'Up to 4 charms per chain', 'Hand stamped — allow 1 week', 'Additional charms priced separately'],
    image: null,
    madeToOrder: true,
  },
  {
    sku: 'EAR-01',
    slug: 'orbit-hoops',
    name: 'Orbit Hoops',
    category: 'earrings',
    price: 78000,
    material: 'Gold vermeil',
    blurb: 'The 18mm everyday hoop, light enough to forget.',
    description:
      'We spent an unreasonable amount of time on the weight of these. At 18mm they read as an everyday hoop, and the hollow tube construction means you stop noticing them by mid-morning.',
    details: ['18mm diameter', 'Hollow tube — 1.1g per pair', 'Hinged closure', 'Also in 12mm and 25mm'],
    image: null,
    featured: true,
  },
  {
    sku: 'EAR-02',
    slug: 'seed-studs',
    name: 'Seed Studs',
    category: 'earrings',
    price: 45000,
    material: 'Sterling silver',
    blurb: 'A 3mm ball stud. The one you never take out.',
    description:
      'Small, round, done. These are the studs for second and third piercings, and the ones we recommend for anyone who wants to wear something permanently without thinking about it.',
    details: ['3mm ball', 'Butterfly backs', 'Nickel free', 'Sold as a pair'],
    image: null,
  },
  {
    sku: 'EAR-03',
    slug: 'cascade-drops',
    name: 'Cascade Drops',
    category: 'earrings',
    price: 168000,
    material: '14ct gold fill, quartz',
    blurb: 'Three graduated quartz drops on a fine wire.',
    description:
      'Long, narrow and deliberately unbalanced — the drops graduate in size so they catch light at three different heights. Our most-asked-about piece at events.',
    details: ['58mm total drop', 'Rose or clear quartz', 'Hook fitting', 'Made to order, 2 weeks'],
    image: null,
    madeToOrder: true,
  },
  {
    sku: 'BRC-01',
    slug: 'meridian-cuff',
    name: 'Meridian Cuff',
    category: 'bracelets',
    price: 92000,
    material: 'Brass with gold plating',
    blurb: 'A wide open cuff, adjustable at the wrist.',
    description:
      'Cut from a single sheet and formed by hand, the Meridian is an open cuff you adjust yourself for a close fit. Substantial without being heavy.',
    details: ['14mm width', 'Adjustable 16–19cm', 'Hand formed', 'Polish or brushed finish'],
    image: null,
  },
  {
    sku: 'BRC-02',
    slug: 'anchor-chain-bracelet',
    name: 'Anchor Chain Bracelet',
    category: 'bracelets',
    price: 88000,
    material: 'Sterling silver',
    blurb: 'A solid anchor-link chain with a hand-set clasp.',
    description:
      'Solid links, not hollow — it has the weight you expect when you pick it up. Sized at 18cm with two spare links included so it can be adjusted at home.',
    details: ['18cm, adjustable', '4mm links', 'Solid, not hollow', 'Two spare links included'],
    image: null,
  },
  {
    sku: 'ACC-01',
    slug: 'silk-hair-scarf',
    name: 'Silk Hair Scarf',
    category: 'accessories',
    price: 56000,
    material: '100% mulberry silk',
    blurb: 'A hand-rolled silk square in four house colourways.',
    description:
      'Hand-rolled edges, mulberry silk, cut square at 55cm so it works in the hair, at the neck, or knotted onto a bag handle. Four colourways, changed seasonally.',
    details: ['55 × 55cm', 'Hand-rolled edge', 'Four colourways', 'Dry clean only'],
    image: null,
  },
  {
    sku: 'ACC-02',
    slug: 'travel-jewellery-roll',
    name: 'Travel Jewellery Roll',
    category: 'accessories',
    price: 76000,
    material: 'Vegetable-tanned leather',
    blurb: 'A four-pocket roll that keeps chains from knotting.',
    description:
      'Four padded pockets and two ring rolls, in vegetable-tanned leather that darkens as it ages. Designed around the actual problem: chains knot in transit and nothing else on the market fixes it properly.',
    details: ['22 × 12cm rolled', 'Four pockets, two ring rolls', 'Vegetable-tanned leather', 'Monogramming available'],
    image: null,
  },
];

/** Every valid SKU. The Pages Function imports this as its allowlist. */
export const SKUS: string[] = PRODUCTS.map((p) => p.sku);

export function formatPrice(francs: number): string {
  // No division: XAF has no subunit, so the stored integer is already the
  // amount. ICU supplies 0 fraction digits for XAF on its own.
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
  }).format(francs);
}

export function byCategory(category: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function featured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function findBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
