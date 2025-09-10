const supportsScrollDriven =
  CSS.supports('animation-timeline: scroll()') ||
  CSS.supports('animation-timeline: view()') ||
  CSS.supports('view-timeline-name: --x');

if (!supportsScrollDriven) {
  (async () => {
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const Lenis = (await import('@studio-freight/lenis')).default;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ normalizeWheel: true, smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // HERO fallback (más zoom)
gsap.fromTo(hero,
  { scale: 0.90, yPercent: 10, opacity: 0.72 },
  {
    scale: 1.30, yPercent: -6, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: hero.closest('.sticky-wrap') as Element, start:'top top', end:'+=60%', scrub:true }
  }
);

// GALERÍA fallback (más subida + escala)
gsap.fromTo(card,
  { yPercent: 12, scale: 0.96, opacity: 0.68 },
  {
    yPercent: -6, scale: 1.06, opacity: 1, ease:'none',
    scrollTrigger: { trigger: card, start:'top 85%', end:'top 20%', scrub:true }
  }
);

    // PINNED STORY
    document.querySelectorAll<HTMLElement>('.pin-visual').forEach((fig) => {
      gsap.fromTo(fig, { scale: 0.92, opacity: 0.9 }, {
        scale: 1.12, opacity: 1, ease:'none',
        scrollTrigger: { trigger: fig.closest('.sticky-wrap')!, start:'top top', end:'+=80%', scrub:true }
      });
    });
    document.querySelectorAll<HTMLElement>('.pin-step').forEach((step) => {
      gsap.fromTo(step, { opacity: 0.15, y: 8 }, {
        opacity: 1, y: 0, ease:'none',
        scrollTrigger: { trigger: step, start:'top 75%', end:'top 25%', scrub:true }
      });
    });

    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) { return arguments.length ? (lenis as any).scrollTo(value) : window.scrollY; },
      getBoundingClientRect() { return { top:0, left:0, width:window.innerWidth, height:window.innerHeight }; }
    });
    ScrollTrigger.addEventListener('refresh', () => lenis.update());
    ScrollTrigger.refresh();
  })();
}
