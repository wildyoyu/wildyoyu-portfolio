// scroll-fallback.js — opcional; activa scroll suave a anchors si el navegador no lo soporta.
(() => {
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const supportsSmooth = 'scrollBehavior' in document.documentElement.style;
  if (supportsSmooth || prefersReduce) return;

  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, true);
})();
