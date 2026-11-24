import { useEffect, useRef, memo } from 'react';
import { BANDS, GATES } from './data';

const VIDEO_URL = '/assets/hero-scrub.mp4';
const VIDEO_BYTES = 4611900; // the real encoded size: fallback when Content-Length is missing
const POSTER = '/assets/hero-poster.jpg';
const ENDING = '/assets/hero-ending.jpg';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p, e0, e1) => {
  const t = clamp((p - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

/* Split a line into word and character spans with seeded offsets. */
const Split = memo(function Split({ text, fx, seed, spread = 0.5, accentFrom = 99 }) {
  const r = rng(seed);
  const words = text.split(' ');
  const total = text.replace(/ /g, '').length;
  let ci = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="split" aria-hidden="true">
        {words.map((w, wi) => {
          const wStyle = { '--th': ((wi / Math.max(1, words.length)) * 0.45).toFixed(3) };
          return (
            <span key={wi}>
              <span className={wi >= accentFrom ? 'w accent' : 'w'} style={wStyle}>
                {[...w].map((c, k) => {
                  const idx = ci++;
                  let st = {};
                  if (fx === 'scatter') {
                    st = {
                      '--th': (r() * spread).toFixed(3),
                      '--jx': `${((r() - 0.5) * 140).toFixed(1)}px`,
                      '--jy': `${((r() - 0.5) * 90).toFixed(1)}px`,
                      '--jr': `${((r() - 0.5) * 70).toFixed(1)}deg`,
                    };
                  } else if (fx === 'snap') {
                    st = {
                      '--th': ((idx / total) * spread + r() * 0.06).toFixed(3),
                      '--jx': `${(36 + r() * 30).toFixed(1)}px`,
                    };
                  }
                  return (
                    <span className="c" style={st} key={k}>
                      {c}
                    </span>
                  );
                })}
              </span>
              {wi < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </span>
    </>
  );
});

export default function Hero({ introDone }) {
  const heroRef = useRef(null);
  const introRef = useRef(introDone);
  introRef.current = introDone;

  useEffect(() => {
    const hero = heroRef.current;
    const stage = hero.querySelector('.stage');
    const video = hero.querySelector('.hero-video');
    const posterLayer = hero.querySelector('.poster');
    const endLayer = hero.querySelector('.poster-end');
    const ring = hero.querySelector('.ring');
    const ringWrap = hero.querySelector('.loader');
    const bandEls = [...hero.querySelectorAll('.band')].map((el, i) => ({
      el,
      ...BANDS[i],
      op: -1,
      k: -1,
    }));

    let target = 0, shown = 0, rafId = null, lastTick = 0;
    let heroOnScreen = true, scrubOn = false, inited = false, videoFailed = false, endOp = -1;
    let seekBusy = false, pendingTime = null;
    let loadK = 0, loadStart = 0, loadRaf = null;
    let disposed = false, activeCtrl = null;

    const heroProgress = () => {
      const range = hero.offsetHeight - innerHeight;
      if (range <= 0) return 0;
      return clamp(-hero.getBoundingClientRect().top / range, 0, 1);
    };

    function requestSeek(t) {
      if (!video.duration || videoFailed) return;
      if (seekBusy) { pendingTime = t; return; }
      seekBusy = true;
      video.currentTime = t;
    }
    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); }
    };
    const onVideoError = () => { seekBusy = false; pendingTime = null; failVideo(); };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onVideoError);

    function updateCaptions(p) {
      const last = bandEls.length - 1;
      bandEls.forEach((b, i) => {
        const f = Math.min(0.02, (b.b - b.a) / 3);
        const inOp = i === 0 ? (p <= b.b ? 1 : 0) : smoothstep(p, b.a, b.a + f);
        const outOp = i === last ? 1 : 1 - smoothstep(p, b.b - f, b.b);
        let op = i === 0 ? outOp : inOp * outOp;
        if (i === last && p < b.a) op = 0;
        op = Math.round(op * 1000) / 1000;
        const ramp = b.ramp || Math.min(0.025, (b.b - b.a) * 0.35);
        let k = clamp((p - b.a) / ramp, 0, 1);
        if (i === 0) k = Math.max(k, loadK);
        k = Math.round(k * 125) / 125; // delta gate at 0.008
        if (op !== b.op) {
          b.op = op;
          b.el.style.opacity = op;
          b.el.style.visibility = op === 0 ? 'hidden' : 'visible';
        }
        if (k !== b.k) { b.k = k; b.el.style.setProperty('--k', k); }
      });
      if (videoFailed) {
        const e = Math.round(smoothstep(p, 0.62, 0.86) * 100) / 100;
        if (e !== endOp) { endOp = e; endLayer.style.opacity = e; }
      }
    }

    function tick(now) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const k = 0.14;
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
      if (Math.abs(target - shown) < 0.0005) {
        shown = target; rafId = null; lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      if (video.duration) requestSeek(shown * (video.duration - 0.04));
      updateCaptions(shown);
    }
    function onScroll() {
      target = heroProgress();
      if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
    }

    // band one assembles on load, then hands over to scroll
    function startLoadRamp() {
      if (loadRaf || loadK >= 1) return;
      const step = (now) => {
        if (!loadStart) loadStart = now;
        const t = clamp((now - loadStart) / 1400, 0, 1);
        loadK = 1 - Math.pow(1 - t, 3);
        updateCaptions(scrubOn ? shown : 0);
        if (t < 1) loadRaf = requestAnimationFrame(step);
      };
      loadRaf = requestAnimationFrame(step);
    }
    introRef.startLoadRamp = startLoadRamp;

    function failVideo() {
      if (videoFailed || disposed) return;
      videoFailed = true;
      stage.classList.add('video-failed');
      ringWrap.classList.add('done');
      endLayer.style.backgroundImage = `url('${ENDING}')`;
      updateCaptions(shown);
    }

    async function loadHeroBlob() {
      const ctrl = new AbortController();
      activeCtrl = ctrl;
      let watchdog = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(VIDEO_URL, { priority: 'low', signal: ctrl.signal });
      if (!res.ok || !res.body) throw new Error('video ' + res.status);
      const total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES;
      const reader = res.body.getReader();
      const chunks = [];
      let got = 0, lastRing = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        clearTimeout(watchdog);
        watchdog = setTimeout(() => ctrl.abort(), 20000);
        chunks.push(value);
        got += value.length;
        const frac = Math.min(1, got / total);
        const now = performance.now();
        if (now - lastRing > 100 || frac === 1) {
          lastRing = now;
          ring.style.setProperty('--ld', Math.round(126 * (1 - frac)));
        }
      }
      clearTimeout(watchdog);
      ring.style.setProperty('--ld', 0);
      video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
      video.load();
      video.addEventListener('canplay', () => {
        requestSeek(heroProgress() * (video.duration - 0.04));
        stage.classList.add('video-ready');
        ringWrap.classList.add('done');
      }, { once: true });
    }

    function initHeroOnce() {
      if (inited) return;
      inited = true;
      posterLayer.style.backgroundImage = `url('${POSTER}')`;
      let started = false;
      const start = () => {
        if (started || disposed) return;
        started = true;
        loadHeroBlob().catch(failVideo);
      };
      const img = new Image();
      img.onload = start;
      img.onerror = start;
      img.src = POSTER;
      setTimeout(start, 4000);
    }

    function enableScrub() {
      if (scrubOn) return;
      scrubOn = true;
      initHeroOnce();
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll, { passive: true });
      bandEls.forEach((b) => { b.op = -1; b.k = -1; });
      endOp = -1;
      updateCaptions(heroProgress());
      onScroll();
    }
    function disableScrub() {
      if (!scrubOn) return;
      scrubOn = false;
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }
    function applyHeroMode() {
      if (GATES.some((q) => matchMedia(q).matches)) disableScrub();
      else enableScrub();
    }
    const MQLS = GATES.map((q) => matchMedia(q));
    MQLS.forEach((m) => m.addEventListener('change', applyHeroMode));

    const io = new IntersectionObserver(([e]) => {
      heroOnScreen = e.isIntersecting;
      if (heroOnScreen && scrubOn) onScroll();
    });
    io.observe(hero);

    applyHeroMode();
    if (introRef.current) startLoadRamp();

    return () => {
      disposed = true;
      if (activeCtrl) activeCtrl.abort();
      disableScrub();
      MQLS.forEach((m) => m.removeEventListener('change', applyHeroMode));
      io.disconnect();
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onVideoError);
      if (loadRaf) cancelAnimationFrame(loadRaf);
    };
  }, []);

  useEffect(() => {
    if (introDone && introRef.startLoadRamp) introRef.startLoadRamp();
  }, [introDone]);

  return (
    <section className="hero" ref={heroRef} aria-label="25 Rupiya Productions">
      <div className="stage">
        <div className="stage-media" inert="">
          <div className="poster" />
          <div className="poster-end" />
          <video className="hero-video" preload="none" muted playsInline aria-hidden="true" tabIndex={-1} />
          <div className="scrim" />
        </div>

        {BANDS.map((b, i) => (
          <div
            key={i}
            className={`band band-${b.side} fx-${b.fx}`}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {i === 0 && <p className="band-kicker mono chip">25 Rupiya Productions · Mumbai</p>}
            {i === BANDS.length - 1 ? (
              <h1 className="band-title"><Split text={b.title} fx={b.fx} seed={101 + i * 37} spread={b.spread} accentFrom={2} /></h1>
            ) : (
              <h2 className="band-title"><Split text={b.title} fx={b.fx} seed={101 + i * 37} spread={b.spread} /></h2>
            )}
            <p className="band-sub">{b.sub}</p>
            {b.cta && (
              <div className="band-cta">
                <a className="btn btn-primary" href="#contact">Start a project</a>
                <a className="btn btn-ghost" href="#work">See the work</a>
              </div>
            )}
          </div>
        ))}

        <div className="loader" aria-hidden="true">
          <svg className="ring" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2" />
            <circle className="ring-fill" cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="126" />
          </svg>
          <span className="mono">Scroll</span>
        </div>
      </div>

      {/* The static hero: phones, portrait tablets, reduced motion */}
      <div className="static-hero">
        <div className="static-img" aria-hidden="true" />
        <div className="static-copy">
          <p className="band-kicker mono chip">25 Rupiya Productions · Mumbai</p>
          <h1 className="static-title">Small coin. <span className="copper">Big cinema.</span></h1>
          <p className="static-sub">
            An AI film studio from Mumbai, making mythology, music videos and brand films that look like they cost a fortune.
          </p>
          <div className="band-cta">
            <a className="btn btn-primary" href="#contact">Start a project</a>
            <a className="btn btn-ghost" href="#work">See the work</a>
          </div>
        </div>
      </div>
    </section>
  );
}
