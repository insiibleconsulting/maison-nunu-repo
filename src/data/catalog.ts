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

/**
 * The client's eight collections, confirmed 31 July 2026.
 *
 * `accessories` was retired here: it was a placeholder bucket from the initial
 * build and does not appear in the client's list. Its two invented pieces
 * (ACC-01 Silk Hair Scarf, ACC-02 Travel Jewelry Roll) went with it. Per the
 * SKU rule below, ACC-01 and ACC-02 are now RETIRED — never reissue them.
 *
 * Adding a category here is a compile error until you also add its line art to
 * ART in src/components/ProductImage.astro, which is typed Record<Category,
 * string>. That coupling is deliberate — a category with no art would render
 * an empty frame.
 */
export type Category =
  | 'earrings'
  | 'bracelets'
  | 'necklaces'
  | 'watches'
  | 'rings'
  | 'raffia'
  | 'sunglasses'
  | 'brooches';

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

/**
 * Order follows the client's own list rather than alphabetical or by stock
 * count — the order they wrote them in is a signal about how they think about
 * the range, and it drives the nav, the footer and the shop filter row.
 *
 * Labels are sentence case, per the house convention (see CLAUDE.md): Title
 * Case reads corporate and fights a small maker's voice.
 */
export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: 'earrings', label: 'Earrings', blurb: 'Studs, hoops and drops.' },
  { id: 'bracelets', label: 'Bracelets', blurb: 'Cuffs, chains and charm bases.' },
  { id: 'necklaces', label: 'Necklaces', blurb: 'Fine chains, pendants and layering pieces.' },
  { id: 'watches', label: 'Watches', blurb: 'Field and dress watches on strap or bracelet.' },
  { id: 'rings', label: 'Rings', blurb: 'Signets, stacking bands and statement stones.' },
  { id: 'raffia', label: 'Raffia bags & hats', blurb: 'Handwoven raffia, finished by hand.' },
  { id: 'sunglasses', label: 'Sunglasses', blurb: 'Acetate frames, polarised lenses.' },
  { id: 'brooches', label: 'Brooches', blurb: 'Pins, rosettes and collar clips.' },
];

/**
 * GENERATED — do not edit between the markers below.
 *
 * The source of truth is `data/products.csv`, and `public/products/<sku>.jpg`
 * supplies the photograph. Regenerate with `npm run catalog`; `npm run build`
 * refuses to run if this block has drifted from the CSV.
 *
 * To change a piece, edit the spreadsheet, not this file. To add one, run
 * `npm run product:add -- <collection> <photo>` — it mints the next free SKU,
 * re-encodes the photo to 800×1000 and appends a draft row.
 *
 * `image` is derived from the SKU rather than stored: a piece with no
 * photograph on disk gets `image: null` and renders the marked "IMAGE PENDING"
 * line art in ProductImage.astro, so a missing photo is visible rather than
 * broken. Rows with status `draft` are held out of this block entirely — their
 * SKU is reserved and their photo is in place, but the site does not show them.
 *
 * Status of the content, as of 1 August 2026: every piece here is still marked
 * `placeholder` in the CSV. The names, prices and copy are INVENTED and the
 * photographs are Unsplash stock (see CLAUDE.md § "What is real vs.
 * placeholder"). Only the eight collections and the SKU prefixes are settled.
 * Watches is deliberately the largest collection at nine pieces, added at the
 * client's request — worth a sanity check that it reflects the real range.
 *
 * RETIRED, never to be reissued: ACC-01 (Silk Hair Scarf), ACC-02 (Travel
 * Jewelry Roll), from the retired `accessories` bucket. The live list is
 * `data/retired-skus.txt`, which `npm run catalog` appends to automatically
 * whenever a row leaves the CSV.
 */
export const PRODUCTS: Product[] = [
  // <<< generated from data/products.csv — do not edit by hand
  {
    sku: 'RNG-01',
    slug: 'aurelia-signet-ring',
    name: 'Aurelia Signet Ring',
    category: 'rings',
    price: 145000,
    material: '9ct gold vermeil',
    blurb: 'A classic signet with a hand-brushed face, ready to engrave.',
    description:
      'The Aurelia is a classic signet — a softly domed face on a tapered band, finished by hand so no two catch the light in quite the same way. Left plain it reads as quiet everyday gold; engraved, it becomes an heirloom.',
    details: ['Face 11mm × 9mm', 'Sizes G–U', 'Engraving can be arranged', 'Presented in a gift box'],
    image: '/products/rng-01.jpg',
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
    image: '/products/rng-02.jpg',
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
      'One hand-cut labradorite, set low so it sits close to the finger and survives real life. Labradorite flashes blue and green as it moves, which means every stone is genuinely one of a kind.',
    details: ['Stone approx. 8mm', 'Sizes H–S', 'Ordered in, 3–4 weeks', 'Stone selected with you over WhatsApp'],
    image: '/products/rng-03.jpg',
    featured: true,
    madeToOrder: true,
  },
  {
    sku: 'RNG-04',
    slug: 'champagne-cluster-ring',
    name: 'Champagne Cluster Ring',
    category: 'rings',
    price: 232000,
    material: '14ct gold, champagne quartz',
    blurb: 'A cluster of champagne quartz set to read as one stone.',
    description:
      'Nine stones graded by size and set close, so from an arm’s length it reads as a single large stone and only up close resolves into a cluster. That is the trick, and it is why a cluster costs less than the solitaire it imitates.',
    details: ['Cluster approx. 14mm', 'Sizes H–S', 'Champagne quartz', 'Ordered in, 3 weeks'],
    image: '/products/rng-04.jpg',
    madeToOrder: true,
  },
  {
    sku: 'RNG-05',
    slug: 'eternity-band',
    name: 'Eternity Band',
    category: 'rings',
    price: 198000,
    material: 'Gold vermeil, cubic zirconia',
    blurb: 'Stones the whole way round, not just across the front.',
    description:
      'A full eternity rather than a half — the stones continue under the finger where nobody sees them. It costs more and it is the reason the ring never needs turning the right way up.',
    details: ['2.5mm width', 'Sizes F–T', 'Full eternity setting', 'Presented in a gift box'],
    image: '/products/rng-05.jpg',
  },
  {
    sku: 'RNG-06',
    slug: 'maille-pave-ring',
    name: 'Maille Pavé Ring',
    category: 'rings',
    price: 176000,
    material: 'Gold vermeil, pavé set',
    blurb: 'A woven mesh band with a pavé panel.',
    description:
      'The band is woven rather than cast, so it has a little give and sits closer than a solid ring. The pavé panel sits flush, which means it does not catch on knitwear.',
    details: ['4mm width', 'Sizes G–U', 'Woven mesh band', 'Flush-set pavé panel'],
    image: '/products/rng-06.jpg',
  },
  {
    sku: 'RNG-07',
    slug: 'solitaire-ring',
    name: 'Solitaire Ring',
    category: 'rings',
    price: 288000,
    material: '14ct gold, white sapphire',
    blurb: 'One white sapphire, set high to catch the light.',
    description:
      'White sapphire rather than diamond, set in a four-claw basket lifted clear of the band so light passes underneath. Harder wearing than most people expect and a fraction of the price.',
    details: ['Stone approx. 6mm', 'Sizes H–S', 'Four-claw basket setting', 'White sapphire'],
    image: '/products/rng-07.jpg',
    featured: true,
  },
  {
    sku: 'RNG-08',
    slug: 'galet-ring-pair',
    name: 'Galet Ring Pair',
    category: 'rings',
    price: 154000,
    material: 'Gold vermeil',
    blurb: 'Two rounded bands, sold as a pair.',
    description:
      'Galet means pebble, which is what these are — rounded, plain, worn smooth-looking from the start. Sold as a pair because one on its own looks like it lost something.',
    details: ['3mm and 2mm widths', 'Sizes F–T', 'Sold as a pair', 'Also available singly'],
    image: '/products/rng-08.jpg',
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
    image: '/products/nck-01.jpg',
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
    image: '/products/nck-02.jpg',
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
    details: ['12mm disc', 'Up to 4 charms per chain', 'Hand stamped — allow 1 week to arrive', 'Additional charms priced separately'],
    image: '/products/nck-03.jpg',
    madeToOrder: true,
  },
  {
    sku: 'NCK-04',
    slug: 'carre-pendant',
    name: 'Carré Pendant',
    category: 'necklaces',
    price: 142000,
    material: 'Sterling silver, pavé set',
    blurb: 'A square pavé pendant on a fine box chain.',
    description:
      'A square face rather than a round one, because square catches light in flat planes and reads as deliberate where a circle reads as default. Small enough to wear under a collar.',
    details: ['12mm square face', '45cm box chain', 'Pavé set', 'Lobster clasp'],
    image: '/products/nck-04.jpg',
  },
  {
    sku: 'NCK-05',
    slug: 'medaille-layered-set',
    name: 'Médaille Layered Set',
    category: 'necklaces',
    price: 168000,
    material: 'Gold vermeil',
    blurb: 'Three chains at three lengths, sold as one set.',
    description:
      'Layering is easy to get wrong — chains of similar length tangle and sit on top of each other. These are cut at 40, 45 and 50cm so they hang clear, and the medallion anchors the shortest.',
    details: ['40 / 45 / 50cm', 'Three chains, one clasp each', 'Engraved medallion', 'Wear together or apart'],
    image: '/products/nck-05.jpg',
    featured: true,
  },
  {
    sku: 'NCK-06',
    slug: 'fleur-blanche-pendant',
    name: 'Fleur Blanche Pendant',
    category: 'necklaces',
    price: 124000,
    material: 'Enamel, gold vermeil',
    blurb: 'A hand-painted enamel flower on a fine chain.',
    description:
      'The petals are enamelled by hand and fired, so the white has depth to it rather than sitting flat like paint. Each firing shifts the colour slightly, which is why no two match exactly.',
    details: ['28mm flower', '42cm chain', 'Hand-enamelled', 'Colour varies slightly'],
    image: '/products/nck-06.jpg',
    madeToOrder: true,
  },
  {
    sku: 'NCK-07',
    slug: 'trois-layering-set',
    name: 'Trois Layering Set',
    category: 'necklaces',
    price: 186000,
    material: 'Gold vermeil, freshwater pearl',
    blurb: 'Our layering set for people who have never layered.',
    description:
      'The question we get most is which chains go together. This is the answer — a fine cable, a satellite and a pearl drop, cut to lengths that work as a set and still make sense worn alone.',
    details: ['Three chains', '38 / 44 / 50cm', 'Freshwater pearl drop', 'Sold as a set'],
    image: '/products/nck-07.jpg',
  },
  {
    sku: 'NCK-08',
    slug: 'couronne-pendant',
    name: 'Couronne Pendant',
    category: 'necklaces',
    price: 138000,
    material: 'Gold vermeil',
    blurb: 'A small crown pendant on a rope chain.',
    description:
      'Scaled down deliberately — a crown at 15mm reads as a charm, at 30mm it reads as costume. On a rope chain because a flat chain would fight the shape.',
    details: ['15mm pendant', '50cm rope chain', 'Gold vermeil', 'Lobster clasp'],
    image: '/products/nck-08.jpg',
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
      'The weight is the whole point of these. At 18mm they read as an everyday hoop, and the hollow tube construction means you stop noticing them by mid-morning.',
    details: ['18mm diameter', 'Hollow tube — 1.1g per pair', 'Hinged closure', 'Also in 12mm and 25mm'],
    image: '/products/ear-01.jpg',
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
    image: '/products/ear-02.jpg',
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
    details: ['58mm total drop', 'Rose or clear quartz', 'Hook fitting', 'Ordered in, 2 weeks'],
    image: '/products/ear-03.jpg',
    madeToOrder: true,
  },
  {
    sku: 'EAR-04',
    slug: 'pave-huggie-hoops',
    name: 'Pavé Huggie Hoops',
    category: 'earrings',
    price: 96000,
    material: 'Gold vermeil, pavé set',
    blurb: 'A huggie that sits tight to the lobe.',
    description:
      'A huggie hugs the lobe instead of hanging from it, which means it stays put through a jumper and a night’s sleep. Pavé across the outer face only — the inside is left plain so it lies flat.',
    details: ['11mm outer diameter', 'Hinged closure', 'Pavé outer face', 'Sold as a pair'],
    image: '/products/ear-04.jpg',
    featured: true,
  },
  {
    sku: 'EAR-05',
    slug: 'ingot-hoops',
    name: 'Ingot Hoops',
    category: 'earrings',
    price: 112000,
    material: 'Sterling silver',
    blurb: 'A heavy hoop with real presence.',
    description:
      'Deliberately weighty where the Orbit is deliberately light. These are for wearing on their own with nothing else — the whole point is that they are the only thing you have on.',
    details: ['16mm diameter', '4mm thickness', 'Hinged closure', 'Solid silver'],
    image: '/products/ear-05.jpg',
  },
  {
    sku: 'EAR-06',
    slug: 'perle-drop-earrings',
    name: 'Perle Drop Earrings',
    category: 'earrings',
    price: 134000,
    material: 'Gold vermeil, freshwater pearl',
    blurb: 'A single pearl on a short gold drop.',
    description:
      'Short enough to clear a collar, long enough to move. The pearl is drilled and pinned rather than glued, which is the difference between an earring that lasts and one that does not.',
    details: ['32mm total drop', '8–9mm freshwater pearl', 'Pinned, not glued', 'Butterfly backs'],
    image: '/products/ear-06.jpg',
  },
  {
    sku: 'EAR-07',
    slug: 'laurier-ear-climbers',
    name: 'Laurier Ear Climbers',
    category: 'earrings',
    price: 148000,
    material: 'Sterling silver, cubic zirconia',
    blurb: 'A climber that follows the curve of the ear.',
    description:
      'A climber sits along the lobe rather than hanging below it, so it reads from the front as a line of light. Shaped to a standard lobe curve and bendable by hand for the rest.',
    details: ['26mm climb', 'Shapeable by hand', 'Cubic zirconia', 'Sold as a pair'],
    image: '/products/ear-07.jpg',
  },
  {
    sku: 'EAR-08',
    slug: 'ribbed-huggie-hoops',
    name: 'Ribbed Huggie Hoops',
    category: 'earrings',
    price: 84000,
    material: 'Gold vermeil',
    blurb: 'A ribbed huggie with no stones at all.',
    description:
      'The texture does the work here instead of stones — fine ribbing across the face that catches light as the head turns. The plain answer for anyone who finds pavé too much.',
    details: ['12mm outer diameter', 'Ribbed face', 'Hinged closure', 'Sold as a pair'],
    image: '/products/ear-08.jpg',
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
    image: '/products/brc-01.jpg',
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
    image: '/products/brc-02.jpg',
  },
  {
    sku: 'BRC-03',
    slug: 'ligne-tennis-bracelet',
    name: 'Ligne Tennis Bracelet',
    category: 'bracelets',
    price: 265000,
    material: 'Sterling silver, cubic zirconia',
    blurb: 'A single line of stones, evenly set.',
    description:
      'Every stone is the same size and the same spacing, which sounds obvious and is the hardest part to get right. A double-lock clasp because a tennis bracelet that opens is a tennis bracelet you lose.',
    details: ['18cm, adjustable to 17cm', '3mm stones', 'Double-lock clasp', 'Sold in a fitted box'],
    image: '/products/brc-03.jpg',
    featured: true,
  },
  {
    sku: 'BRC-04',
    slug: 'fil-bangle',
    name: 'Fil Bangle',
    category: 'bracelets',
    price: 74000,
    material: 'Gold vermeil',
    blurb: 'A fine bangle to wear three at a time.',
    description:
      'The bracelet answer to the Thread band — thin enough to stack without bulk, rigid enough to hold its circle. Slips over the hand rather than opening, so there is no clasp to fail.',
    details: ['1.8mm width', '60mm internal diameter', 'No clasp', 'Sold individually'],
    image: '/products/brc-04.jpg',
  },
  {
    sku: 'BRC-05',
    slug: 'double-curb-bracelet',
    name: 'Double Curb Bracelet',
    category: 'bracelets',
    price: 128000,
    material: 'Sterling silver',
    blurb: 'Two curb chains running as one bracelet.',
    description:
      'Two flat curb chains joined at the clasp so they lie side by side instead of twisting over each other. Heavier than it looks and the reason people keep it on.',
    details: ['19cm', 'Two 3mm chains', 'Single lobster clasp', 'Solid links'],
    image: '/products/brc-05.jpg',
  },
  {
    sku: 'BRC-06',
    slug: 'stack-bangles',
    name: 'Stack Bangles',
    category: 'bracelets',
    price: 96000,
    material: 'Mixed gold vermeil and silver',
    blurb: 'A set of five, mixed metals on purpose.',
    description:
      'Mixing gold and silver used to be a rule you broke. Five bangles at graduated widths, deliberately mismatched, so the stack looks collected rather than bought.',
    details: ['Set of five', '1–4mm widths', 'Mixed metals', 'Sold as a set'],
    image: '/products/brc-06.jpg',
  },
  {
    sku: 'BRC-07',
    slug: 'poids-chain-bracelet',
    name: 'Poids Chain Bracelet',
    category: 'bracelets',
    price: 156000,
    material: 'Gold vermeil',
    blurb: 'A heavy curb chain, sized short.',
    description:
      'Cut at 17cm so it sits at the wrist bone rather than sliding over the hand. The weight is the point — a light chain of this width would read as hollow, because it would be.',
    details: ['17cm', '7mm links', 'Solid, not hollow', 'Fold-over clasp'],
    image: '/products/brc-07.jpg',
  },
  {
    sku: 'BRC-08',
    slug: 'soiree-crystal-bracelet',
    name: 'Soirée Crystal Bracelet',
    category: 'bracelets',
    price: 218000,
    material: 'Rhodium plate, crystal',
    blurb: 'A wide crystal bracelet for one night a year.',
    description:
      'We are not going to pretend this is an everyday piece. It is for the wedding, the gala and the anniversary, and it is priced so it does not have to earn its keep the rest of the year.',
    details: ['22mm width', '18cm, adjustable', 'Rhodium plated', 'Fitted presentation box'],
    image: '/products/brc-08.jpg',
  },
  {
    sku: 'WCH-01',
    slug: 'sahel-field-watch',
    name: 'Sahel Field Watch',
    category: 'watches',
    price: 285000,
    material: 'Brushed steel, sapphire crystal',
    blurb: 'A 38mm field watch on an interchangeable strap.',
    description:
      'A legible field watch at 38mm — big enough to read at a glance, small enough to sit under a cuff. Sapphire crystal, 5ATM, and a quick-release strap so it changes in seconds.',
    details: ['38mm case', 'Sapphire crystal', '5ATM water resistant', 'Quick-release strap'],
    image: '/products/wch-01.jpg',
    featured: true,
  },
  {
    sku: 'WCH-02',
    slug: 'colette-dress-watch',
    name: 'Colette Dress Watch',
    category: 'watches',
    price: 245000,
    material: 'Gold plate, guilloché dial',
    blurb: 'A 32mm dress watch with a hand-finished guilloché dial.',
    description:
      'The dial is guilloché — engine-turned in fine concentric lines — so it shifts between bright and matt as the wrist moves. At 32mm it reads as jewelry first and a watch second, which is the point.',
    details: ['32mm case', 'Guilloché dial', 'Milanese bracelet', '3ATM water resistant'],
    image: '/products/wch-02.jpg',
    featured: true,
  },
  {
    sku: 'WCH-03',
    slug: 'ombre-bronze-watch',
    name: 'Ombre Bronze Watch',
    category: 'watches',
    price: 198000,
    material: 'Rose gold plate, bronze dial',
    blurb: 'A warm bronze dial on a rose gold bracelet.',
    description:
      'A bronze sunray dial that darkens toward the edge, paired with rose gold rather than yellow so it stays warm without going brassy. The one to wear with tan and cream.',
    details: ['34mm case', 'Bronze sunray dial', 'Rose gold plated bracelet', 'Fold-over clasp'],
    image: '/products/wch-03.jpg',
  },
  {
    sku: 'WCH-04',
    slug: 'adele-mesh-watch',
    name: 'Adèle Mesh Watch',
    category: 'watches',
    price: 175000,
    material: 'Rose gold plate, milanese mesh',
    blurb: 'A fine mesh bracelet that sits flat to the wrist.',
    description:
      'Milanese mesh is woven rather than linked, so it lies flat and never catches on a sleeve. The clasp slides, which means it adjusts to the millimetre instead of the nearest link.',
    details: ['32mm case', 'Milanese mesh bracelet', 'Infinitely adjustable clasp', '3ATM water resistant'],
    image: '/products/wch-04.jpg',
  },
  {
    sku: 'WCH-05',
    slug: 'nuit-navy-watch',
    name: 'Nuit Navy Watch',
    category: 'watches',
    price: 215000,
    material: 'Gold plate, navy dial',
    blurb: 'A deep navy dial in a slim gold case.',
    description:
      'Navy instead of black, because black flattens under warm light and navy keeps its depth. A slim case and a matching strap, cut narrow so it does not crowd a small wrist.',
    details: ['33mm case', 'Navy sunray dial', 'Navy leather strap', 'Slim 7mm profile'],
    image: '/products/wch-05.jpg',
  },
  {
    sku: 'WCH-06',
    slug: 'malachite-watch',
    name: 'Malachite Watch',
    category: 'watches',
    price: 320000,
    material: 'Gold plate, malachite dial',
    blurb: 'A true malachite stone dial — no two are alike.',
    description:
      'The dial is cut from malachite, so the banding is different on every piece and we photograph each one before it ships. Green against gold is the oldest pairing in the collection and still the one people stop to look at.',
    details: ['30mm case', 'Genuine malachite dial', 'Banding varies by piece', 'Photograph sent before dispatch'],
    image: '/products/wch-06.jpg',
    madeToOrder: true,
  },
  {
    sku: 'WCH-07',
    slug: 'etoile-pave-watch',
    name: 'Étoile Pavé Watch',
    category: 'watches',
    price: 298000,
    material: 'Steel, pavé-set bezel',
    blurb: 'A pavé-set bezel that catches light from across a room.',
    description:
      'Stones set close around the bezel rather than scattered across the dial, which keeps the face legible and puts the sparkle at the edge where it does the most work.',
    details: ['34mm case', 'Pavé-set bezel', 'Steel bracelet', '5ATM water resistant'],
    image: '/products/wch-07.jpg',
  },
  {
    sku: 'WCH-08',
    slug: 'douala-chronograph',
    name: 'Douala Chronograph',
    category: 'watches',
    price: 275000,
    material: 'Rose gold plate, three-register dial',
    blurb: 'A three-register chronograph scaled for a smaller wrist.',
    description:
      'Most chronographs are built for a 42mm case and simply shrunk. This one is laid out at 36mm from the start, so the subdials stay readable instead of becoming decoration.',
    details: ['36mm case', 'Three-register chronograph', 'Rose gold plated', 'Tachymeter bezel'],
    image: '/products/wch-08.jpg',
  },
  {
    sku: 'WCH-09',
    slug: 'brume-everyday-watch',
    name: 'Brume Everyday Watch',
    category: 'watches',
    price: 145000,
    material: 'Steel, cream dial',
    blurb: 'The plain cream-dial watch you stop noticing.',
    description:
      'No date window, no branding across the dial, no chronograph. A cream face, two hands and a slim strap — the watch for someone who wants to know the time and nothing else.',
    details: ['30mm case', 'Cream matt dial', 'No date window', 'Interchangeable strap'],
    image: '/products/wch-09.jpg',
  },
  {
    sku: 'RFH-01',
    slug: 'bamenda-market-tote',
    name: 'Bamenda Market Tote',
    category: 'raffia',
    price: 68000,
    material: 'Handwoven raffia, leather handles',
    blurb: 'A handwoven raffia tote with leather handles.',
    description:
      'Woven by hand from raffia palm, with vegetable-tanned leather handles stitched on rather than riveted. It softens with use and holds its shape when loaded.',
    details: ['38 × 34cm', 'Leather handles', 'Handwoven — each varies', 'Unlined'],
    image: '/products/rfh-01.jpg',
  },
  {
    sku: 'RFH-02',
    slug: 'wide-brim-sun-hat',
    name: 'Wide Brim Sun Hat',
    category: 'raffia',
    price: 58000,
    material: 'Handwoven raffia',
    blurb: 'A 12cm brim that actually shades a face.',
    description:
      'Most straw hats sold as sun hats have a brim too narrow to do anything. This one is 12cm, which is the width at which it stops being decorative and starts being useful.',
    details: ['12cm brim', 'Internal drawstring sizing', 'Handwoven raffia', 'Natural or dark'],
    image: '/products/rfh-02.jpg',
  },
  {
    sku: 'RFH-03',
    slug: 'raffia-bucket-bag',
    name: 'Raffia Bucket Bag',
    category: 'raffia',
    price: 82000,
    material: 'Raffia, leather strap',
    blurb: 'A drawstring bucket on a long leather strap.',
    description:
      'Bucket shape because it holds more than its footprint suggests, and a long strap so it can be worn across the body at a market. The drawstring closes properly rather than gaping.',
    details: ['26cm tall', 'Adjustable leather strap', 'Drawstring closure', 'Cotton lined'],
    image: '/products/rfh-03.jpg',
    featured: true,
  },
  {
    sku: 'RFH-04',
    slug: 'packable-panama',
    name: 'Packable Panama',
    category: 'raffia',
    price: 64000,
    material: 'Handwoven toquilla straw',
    blurb: 'Rolls into a bag and comes out flat.',
    description:
      'Woven finely enough to roll without cracking, which is the only real test of a packable hat. Unroll it, leave it an hour, and the brim returns.',
    details: ['Rolls for packing', 'Grosgrain band', 'Toquilla straw', 'Sizes S–L'],
    image: '/products/rfh-04.jpg',
  },
  {
    sku: 'RFH-05',
    slug: 'foulard-brim-hat',
    name: 'Foulard Brim Hat',
    category: 'raffia',
    price: 72000,
    material: 'Raffia, cotton band',
    blurb: 'A dark raffia brim with a tie band.',
    description:
      'Dyed dark rather than left natural, which is unusual in raffia and takes several passes to get even. The band ties rather than fastens, so it can be swapped for a scarf.',
    details: ['10cm brim', 'Tie band', 'Dark dyed raffia', 'Handwoven'],
    image: '/products/rfh-05.jpg',
  },
  {
    sku: 'RFH-06',
    slug: 'everyday-raffia-tote',
    name: 'Everyday Raffia Tote',
    category: 'raffia',
    price: 56000,
    material: 'Handwoven raffia',
    blurb: 'The plain tote, no leather, no lining.',
    description:
      'Stripped back to the weave itself — no leather trim, no lining, no hardware. It is the cheapest thing we sell and the one we use ourselves.',
    details: ['34 × 30cm', 'Woven handles', 'Unlined', 'Handwoven raffia'],
    image: '/products/rfh-06.jpg',
  },
  {
    sku: 'RFH-07',
    slug: 'market-basket',
    name: 'Market Basket',
    category: 'raffia',
    price: 48000,
    material: 'Woven palm',
    blurb: 'A stiff-sided basket that stands up on its own.',
    description:
      'Rigid where the totes are soft, so it stands open on a table and does not collapse when half full. The shape West African markets have used for a very long time, because it works.',
    details: ['30 × 24cm', 'Rigid sides', 'Woven palm', 'Twin handles'],
    image: '/products/rfh-07.jpg',
  },
  {
    sku: 'RFH-08',
    slug: 'picnic-basket-bag',
    name: 'Picnic Basket Bag',
    category: 'raffia',
    price: 66000,
    material: 'Raffia, leather handles',
    blurb: 'An open basket with leather handles.',
    description:
      'Open topped on purpose — this is for flowers, bread and things that should not be squashed. Leather handles because raffia handles stretch under weight.',
    details: ['32 × 22cm', 'Leather handles', 'Open top', 'Handwoven'],
    image: '/products/rfh-08.jpg',
  },
  {
    sku: 'SUN-01',
    slug: 'harmattan-sunglasses',
    name: 'Harmattan Sunglasses',
    category: 'sunglasses',
    price: 82000,
    material: 'Acetate, polarised lenses',
    blurb: 'A wide acetate frame with polarised lenses.',
    description:
      'Hand-polished acetate in a wide, slightly squared frame. Polarised lenses with full UV400, and adjustable nose pads so they sit properly rather than sliding.',
    details: ['Polarised, UV400', 'Hand-polished acetate', 'Adjustable nose pads', 'Case included'],
    image: '/products/sun-01.jpg',
  },
  {
    sku: 'SUN-02',
    slug: 'cercle-round-sunglasses',
    name: 'Cercle Round Sunglasses',
    category: 'sunglasses',
    price: 94000,
    material: 'Gold-tone metal, green lens',
    blurb: 'A fine round metal frame with a green lens.',
    description:
      'A true circle rather than the softened oval most brands sell as round. Green lens rather than grey, which warms what you see instead of flattening it.',
    details: ['Polarised, UV400', 'Fine metal frame', 'Adjustable nose pads', 'Case included'],
    image: '/products/sun-02.jpg',
    featured: true,
  },
  {
    sku: 'SUN-03',
    slug: 'ecaille-round-sunglasses',
    name: 'Écaille Round Sunglasses',
    category: 'sunglasses',
    price: 88000,
    material: 'Tortoiseshell acetate',
    blurb: 'Tortoiseshell acetate in a rounded frame.',
    description:
      'The pattern is laid into the acetate block before cutting, so it runs through the material rather than sitting on the surface. It cannot wear off.',
    details: ['Polarised, UV400', 'Hand-polished acetate', 'Pattern runs through', 'Case included'],
    image: '/products/sun-03.jpg',
  },
  {
    sku: 'SUN-04',
    slug: 'demi-browline-sunglasses',
    name: 'Demi Browline Sunglasses',
    category: 'sunglasses',
    price: 92000,
    material: 'Acetate brow, metal rim',
    blurb: 'A heavy brow over a fine metal rim.',
    description:
      'The weight sits along the top and the bottom of the lens is rimless, which lifts the whole frame on the face. Harder to make than a full rim and worth it.',
    details: ['Polarised, UV400', 'Acetate brow, metal lower', 'Gradient lens', 'Case included'],
    image: '/products/sun-04.jpg',
  },
  {
    sku: 'SUN-05',
    slug: 'ardoise-round-sunglasses',
    name: 'Ardoise Round Sunglasses',
    category: 'sunglasses',
    price: 86000,
    material: 'Acetate, slate lens',
    blurb: 'A dark slate lens in a slim acetate frame.',
    description:
      'The darkest lens we fit, for genuinely bright light rather than for looking moody indoors. The frame is kept slim so the lens does the talking.',
    details: ['Polarised, UV400, category 3', 'Slim acetate frame', 'Slate lens', 'Case included'],
    image: '/products/sun-05.jpg',
  },
  {
    sku: 'SUN-06',
    slug: 'aviateur-sunglasses',
    name: 'Aviateur Sunglasses',
    category: 'sunglasses',
    price: 98000,
    material: 'Metal frame, gradient lens',
    blurb: 'The classic teardrop, in a smaller size.',
    description:
      'Cut smaller than the original military pattern, which was sized for a flight helmet and swamps most faces. A double bridge because a single one flexes.',
    details: ['Polarised, UV400', 'Double bridge', 'Teardrop lens', 'Case included'],
    image: '/products/sun-06.jpg',
  },
  {
    sku: 'SUN-07',
    slug: 'dune-sunglasses',
    name: 'Dune Sunglasses',
    category: 'sunglasses',
    price: 84000,
    material: 'Acetate, brown lens',
    blurb: 'A warm brown lens in a clear frame.',
    description:
      'Brown lenses raise contrast, which is why they are what people wear on the water. The clear frame keeps them from reading as heavy on a small face.',
    details: ['Polarised, UV400', 'Contrast brown lens', 'Clear acetate frame', 'Case included'],
    image: '/products/sun-07.jpg',
  },
  {
    sku: 'SUN-08',
    slug: 'miel-tinted-sunglasses',
    name: 'Miel Tinted Sunglasses',
    category: 'sunglasses',
    price: 78000,
    material: 'Acetate, amber lens',
    blurb: 'A light amber tint for overcast days.',
    description:
      'A category 1 lens — light enough to wear when the sun is not really out, which is most days. Not a sunglass for glare; a sunglass for the walk home.',
    details: ['UV400, category 1', 'Amber tint', 'Light acetate frame', 'Case included'],
    image: '/products/sun-08.jpg',
  },
  {
    sku: 'BRO-01',
    slug: 'rosette-brooch',
    name: 'Rosette Brooch',
    category: 'brooches',
    price: 64000,
    material: 'Gold vermeil',
    blurb: 'A layered rosette on a secure roll-over clasp.',
    description:
      'Five petals raised by hand and layered so the piece catches light from any angle. The clasp is a roll-over safety fitting, not a simple pin — it will not work loose on a coat.',
    details: ['32mm across', 'Roll-over safety clasp', 'Hand-raised petals', 'Presented in a gift box'],
    image: '/products/bro-01.jpg',
    featured: true,
  },
  {
    sku: 'BRO-02',
    slug: 'papillon-brooch',
    name: 'Papillon Brooch',
    category: 'brooches',
    price: 118000,
    material: 'Rhodium plate, moonstone',
    blurb: 'A butterfly set with moonstone wings.',
    description:
      'Moonstone rather than crystal for the wings, because it goes cloudy-blue as it turns instead of just flashing. Set on a trembler spring so it moves slightly as you do.',
    details: ['48mm wingspan', 'Moonstone wings', 'Trembler spring mount', 'Roll-over clasp'],
    image: '/products/bro-02.jpg',
    featured: true,
  },
  {
    sku: 'BRO-03',
    slug: 'eventail-pearl-brooch',
    name: 'Éventail Pearl Brooch',
    category: 'brooches',
    price: 134000,
    material: 'Sterling silver, freshwater pearl',
    blurb: 'A pierced silver fan with a pearl drop.',
    description:
      'The fan is pierced by hand, which is why the openings are not quite identical. A single pearl hangs below so the piece has movement rather than sitting flat on a lapel.',
    details: ['42mm including drop', 'Hand-pierced fan', '9mm freshwater pearl', 'Roll-over clasp'],
    image: '/products/bro-03.jpg',
  },
  {
    sku: 'BRO-04',
    slug: 'epi-spray-brooch',
    name: 'Épi Spray Brooch',
    category: 'brooches',
    price: 96000,
    material: 'Silver plate, glass',
    blurb: 'Two wheat sprays, worn together or apart.',
    description:
      'Sold as a pair because two at slightly different angles look gathered, where one looks lost. Light enough for silk, which most brooches of this size are not.',
    details: ['Each spray 60mm', 'Sold as a pair', 'Under 8g each', 'Pin-back clasp'],
    image: '/products/bro-04.jpg',
  },
  {
    sku: 'BRO-05',
    slug: 'crystal-wing-brooch',
    name: 'Crystal Wing Brooch',
    category: 'brooches',
    price: 126000,
    material: 'Rhodium plate, crystal',
    blurb: 'An open-wing butterfly in pavé crystal.',
    description:
      'The wings are open rather than filled, so the brooch reads as a drawing of a butterfly instead of a model of one. Considerably lighter as a result.',
    details: ['52mm wingspan', 'Open pavé wings', 'Rhodium plated', 'Roll-over clasp'],
    image: '/products/bro-05.jpg',
  },
  {
    sku: 'BRO-06',
    slug: 'perle-bar-brooch',
    name: 'Perle Bar Brooch',
    category: 'brooches',
    price: 108000,
    material: 'Silver plate, freshwater pearl',
    blurb: 'A vertical bar of graduated pearls.',
    description:
      'Pearls graduated large to small down a bar, worn vertically on a lapel or horizontally at a collar. The one brooch here that works on a shirt as well as a coat.',
    details: ['70mm long', 'Graduated 4–10mm pearls', 'Wearable either way', 'Pin-back clasp'],
    image: '/products/bro-06.jpg',
  },
  {
    sku: 'BRO-07',
    slug: 'fleur-set-brooch',
    name: 'Fleur Set Brooch',
    category: 'brooches',
    price: 88000,
    material: 'Gold plate, silk',
    blurb: 'Three fabric-and-metal flowers, sold as a set.',
    description:
      'Silk petals over a gilt frame, so they have the softness of fabric and the shape of metal. Three of them, meant to be scattered rather than lined up.',
    details: ['Set of three', '35–45mm each', 'Silk over gilt frame', 'Pin-back clasp'],
    image: '/products/bro-07.jpg',
  },
  {
    sku: 'BRO-08',
    slug: 'heritage-drop-brooch',
    name: 'Héritage Drop Brooch',
    category: 'brooches',
    price: 178000,
    material: 'Silver plate, pink topaz',
    blurb: 'An antique-style drop with a pink topaz.',
    description:
      'Openwork in the Edwardian manner, with a faceted pink topaz above and a second stone swinging below. The most decorative thing we carry, and unapologetic about it.',
    details: ['64mm including drop', 'Pink topaz', 'Openwork frame', 'Roll-over clasp'],
    image: '/products/bro-08.jpg',
  },
  // >>> end generated
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
