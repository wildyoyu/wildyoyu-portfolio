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

    // Scroll suave
    const lenis = new Lenis({normalizeWheel: true, smoothWheel: true });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Hero
    const hero = document.querySelector('.hero-visual') as HTMLElement | null;
    if (hero) {
      gsap.fromTo(hero,
        { scale: 0.92, yPercent: 8, opacity: 0.75 },
        {
          scale: 1.12, yPercent: -4, opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: hero.closest('.sticky-wrap') as Element,
            start: 'top top',
            end: '+=60%',
            scrub: true
          }
        }
      );
    }

    // Parallax cards
    document.querySelectorAll<HTMLElement>('.parallax-card').forEach((card) => {
      gsap.fromTo(card,
        { yPercent: 6, scale: 0.98, opacity: 0.7 },
        {
          yPercent: -3, scale: 1.02, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 20%', scrub: true }
        }
      );
    });

    // Sincroniza ScrollTrigger con Lenis
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) { return arguments.length ? (lenis as any).scrollTo(value) : window.scrollY; },
      getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; }
    });
    ScrollTrigger.addEventListener('refresh', () => lenis.update());
    ScrollTrigger.refresh();
  })();
}
