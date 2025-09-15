// public/scripts/scroll-fallback.js
// Pequeños polyfills/no-ops seguros para navegadores que no soportan Scroll-Driven Animations.
// Evita tocar nada en SSR y no rompe en modernos.

(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Suaviza el anclado a hash en navegadores que no respetan scroll-padding-top
  function smoothAnchorScroll(e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 60;
    const top = el.getBoundingClientRect().top + window.scrollY - (navH + 12);
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', '#' + id);
  }

  document.addEventListener('click', smoothAnchorScroll);

  // iOS “rubber band” fix suave en body
  document.body.style.overscrollBehaviorY = 'contain';
})();
