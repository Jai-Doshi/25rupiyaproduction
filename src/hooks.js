import { useEffect } from 'react';

/* Entrances: one observer per page render. Attributes, not classes, because React owns className. */
export function useReveal(key) {
  useEffect(() => {
    const timers = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.setAttribute('data-in', '');
          io.unobserve(el);
          timers.push(setTimeout(() => el.setAttribute('data-settled', ''), 1400));
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    document.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io.observe(el));

    // Living elements pause off-screen.
    const liveIO = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.target.classList.toggle('alive', e.isIntersecting))
    );
    document.querySelectorAll('.reel, .why, .ambient').forEach((el) => liveIO.observe(el));
    return () => {
      io.disconnect();
      liveIO.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [key]);
}
