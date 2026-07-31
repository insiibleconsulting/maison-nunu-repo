import { WA_NUMBER, IS_PLACEHOLDER_NUMBER, SITE, GENERAL_ENQUIRY } from '../config/site';
import type { Product } from '../data/catalog';
import { formatPrice } from '../data/catalog';

/**
 * Builds a wa.me click-to-chat link.
 *
 * ENCODING: we use encodeURIComponent, NOT URLSearchParams. URLSearchParams
 * follows form-encoding and turns spaces into "+", which WhatsApp renders
 * literally as plus signs in the message box. encodeURIComponent gives %20,
 * which WhatsApp decodes back to spaces correctly.
 */
export function waLink(message: string): string | null {
  if (IS_PLACEHOLDER_NUMBER) return null;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * The message a customer sends about a specific piece.
 *
 * The SKU is the important part — it is what the client reads in WhatsApp and
 * what ties the conversation back to a row in the lead spreadsheet. Note the
 * customer can edit or delete this text before sending, so treat the SKU as a
 * strong hint rather than a guarantee; the Sheet log is the authoritative record.
 */
export function productMessage(product: Product): string {
  return [
    `Hi ${SITE.brand}! I’m interested in the ${product.name}.`,
    ``,
    `${formatPrice(product.price)} · ${product.material}`,
    `(ref: ${product.sku})`,
  ].join('\n');
}

export function productLink(product: Product): string | null {
  return waLink(productMessage(product));
}

export function generalLink(): string | null {
  return waLink(GENERAL_ENQUIRY);
}

/** Message for the "not sure what I want" enquiry on the contact page. */
export function stylingMessage(): string {
  return `Hi ${SITE.brand}! I’d like some help choosing a piece — could you advise?`;
}
