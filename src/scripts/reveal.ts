/**
 * Quiet scroll reveal for anything marked .reveal.
 *
 * IntersectionObserver rather than a scroll listener, so nothing runs on the
 * main thread between intersections. Elements are unobserved once shown — this
 * is an entrance, not a state that toggles as you scroll back up.
 */

const items = document.querySelectorAll<HTMLElement>('.reveal');

// If the browser can't observe, or the visitor prefers reduced motion, show
// everything immediately. The CSS already handles reduced motion, but doing it
// here too means no element can get stranded at opacity 0.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!('IntersectionObserver' in window) || reduced) {
  items.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );

  items.forEach((el) => observer.observe(el));
}
