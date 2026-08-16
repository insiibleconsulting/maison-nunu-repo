/**
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Brand details and the WhatsApp number live here and nowhere else.
 * When the client provides real details, this is the only file you edit
 * (plus src/data/catalog.ts for products).
 */

/**
 * The client's WhatsApp Business number in full international format.
 *
 * FORMAT RULES — getting these wrong fails silently. WhatsApp opens with
 * "phone number shared via url is invalid" and the lead is gone:
 *   - digits only: no "+", no spaces, no dashes, no brackets
 *   - country code first
 *   - NO LEADING ZERO on the national part
 *
 *   +27 82 123 4567   ->  '27821234567'
 *   0803 456 7890 (NG) -> '2348034567890'   (drop the 0, prepend 234)
 *
 * Supplied at build time via PUBLIC_WA_NUMBER. While that is unset the site
 * runs in placeholder mode: CTAs are visibly disabled rather than linking to
 * a number that belongs to a stranger.
 */
const WA_NUMBER_RAW = import.meta.env.PUBLIC_WA_NUMBER ?? '';

/** Strip anything that isn't a digit, so a pasted "+27 82 123 4567" still works. */
export const WA_NUMBER = String(WA_NUMBER_RAW).replace(/\D/g, '');

/**
 * True when no real number has been configured yet.
 *
 * We deliberately do NOT ship a fake number as a fallback. A plausible-looking
 * placeholder is the single most dangerous thing in this codebase: it would let
 * the site go live sending every customer enquiry to an unrelated person, and
 * nothing would visibly break. Failing loudly is the safer default.
 */
export const IS_PLACEHOLDER_NUMBER = WA_NUMBER.length < 8;

export const SITE = {
  brand: 'Maison Nunu',
  tagline: 'Fine jewelry & accessories',
  /*
   * Maison Nunu SELLS, it does not manufacture. Keep this copy — and every
   * other line on the site — free of first-person making claims ("we make",
   * "hand-finished by us", "if we made it"). Describing how a piece was made is
   * fine; claiming Maison Nunu made it is not, and it is the kind of thing a
   * customer can hold you to.
   */
  description:
    'A chosen selection of jewelry and accessories, brought together piece by piece. Everything here is one conversation away — message us and we will help you choose.',

  /** Shown on the contact page and in the footer. Placeholder until confirmed. */
  email: 'hello@maisonnunu.com',
  location: 'By appointment',

  /** Business hours copy, mirrored in the WhatsApp Business away message. */
  hours: 'Mon–Fri, 9am – 5pm',

  social: {
    instagram: '', // e.g. 'https://instagram.com/maisonnunu'
    tiktok: '',
  },
} as const;

/** Default message used by CTAs that are not tied to a specific product. */
export const GENERAL_ENQUIRY = 'Hi Maison Nunu! I have a question about your pieces.';
