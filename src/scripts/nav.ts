/**
 * ---------------------------------------------------------------------------
 * Mobile navigation toggle.
 * ---------------------------------------------------------------------------
 *
 * The open state lives in exactly one place: `aria-expanded` on the button. The
 * CSS opens the panel by reading that attribute through a sibling selector, so
 * there is no second class to keep in sync and the visual state and the state
 * announced to a screen reader cannot drift apart.
 *
 * On the collapse being safe: the `js` class in Base.astro is what hides the
 * nav, and this file is what reopens it. If the two could fail independently
 * the menu would be unreachable — a class with no handler behind it. They
 * cannot: Astro inlines this module into every page rather than emitting a
 * separate bundle (`find dist -name '*.js'` returns nothing, which is expected
 * here), so both live in the same HTML document and arrive together or not at
 * all. If that ever changes and a real .js file appears in dist/, move the
 * `js` class into this file and accept the paint flash instead.
 */

const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
const header = document.querySelector<HTMLElement>('.site-header');

if (toggle && header) {
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Escape closes and returns focus to the button. Without the focus move the
  // caret would be stranded inside a panel that is no longer rendered, and the
  // next Tab would restart from the top of the document.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // A tap anywhere outside the header dismisses it. Deliberately not
  // `toggle.contains` — clicking a link inside the panel should navigate, and
  // on a static site that reloads the page and resets the state anyway.
  document.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target as Node)) setOpen(false);
  });

  // Crossing back into the desktop layout with the panel open would leave the
  // button reporting expanded while the nav renders as a normal inline row.
  // Rotating a phone is enough to hit this.
  const desktop = window.matchMedia('(min-width: 701px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  // Restoring from the bfcache (Safari back button) replays the DOM as it was
  // left, panel open included. The contact form already guards against this;
  // same reasoning here.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) setOpen(false);
  });
}
