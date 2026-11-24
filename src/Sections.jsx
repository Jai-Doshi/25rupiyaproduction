import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { STATS, SERVICES, PROMISES, STEPS, FAQS, PROJECT_TYPES, BUDGETS } from './data';
import { PROJECTS } from './projects';

const reduceMQ = () => matchMedia('(prefers-reduced-motion: reduce)');

/* In-page anchor on the home page, a route link everywhere else. */
export function HashLink({ to, children, ...rest }) {
  const { pathname } = useLocation();
  if (pathname === '/') return <a href={to} {...rest}>{children}</a>;
  return <Link to={to === '#top' ? '/' : '/' + to} {...rest}>{children}</Link>;
}

/* ---------- Nav ---------- */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    let last = null;
    const on = () => {
      const s = scrollY > innerHeight * (pathname === '/' ? 0.6 : 0.25);
      if (s !== last) { last = s; setSolid(s); }
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [pathname]);
  const close = () => setOpen(false);
  return (
    <header className={`nav${solid ? ' solid' : ''}${open ? ' open' : ''}`}>
      <a className="skip" href="#main">Skip to content</a>
      <nav className="nav-inner" aria-label="Main">
        <HashLink className="brand" to="#top" onClick={close} aria-label="25 Rupiya Productions, home">
          <img src="/assets/logo.webp" alt="" width="48" height="48" />
          <span className="brand-name">25 Rupiya<span className="mono">Productions</span></span>
        </HashLink>
        <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>
          <span className="sr-only">Menu</span>
          <span className="bars" aria-hidden="true" />
        </button>
        <ul id="nav-links" className="nav-links">
          <li><HashLink to="#services" onClick={close}>Services</HashLink></li>
          <li><HashLink to="#work" onClick={close}>Work</HashLink></li>
          <li><HashLink to="#why" onClick={close}>Why 25</HashLink></li>
          <li><HashLink to="#process" onClick={close}>Process</HashLink></li>
          <li><HashLink to="#faq" onClick={close}>FAQ</HashLink></li>
          <li><HashLink className="btn btn-primary btn-sm" to="#contact" onClick={close}>Start a project</HashLink></li>
        </ul>
      </nav>
    </header>
  );
}

/* ---------- Ambient environment (one fixed layer) ---------- */
export function Ambient() {
  const embers = Array.from({ length: 16 }, (_, i) => i);
  return (
    <div className="ambient" aria-hidden="true">
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div className="grain" />
      {embers.map((i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${(i * 61) % 100}%`,
            animationDelay: `${-((i * 3.7) % 22)}s`,
            animationDuration: `${18 + ((i * 5) % 14)}s`,
            '--dx': `${((i % 5) - 2) * 18}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Proof strip with counters ---------- */
function Counter({ value, suffix, plain }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const fmt = (n) => (plain ? String(n) : n.toLocaleString('en-IN'));
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduceMQ().matches) { el.textContent = fmt(value); return; }
      const from = plain ? value - 40 : 0;
      const t0 = performance.now();
      let last = '';
      const step = (now) => {
        const t = Math.min(1, (now - t0) / 1600);
        const eased = 1 - Math.pow(1 - t, 4);
        const s = fmt(Math.round(from + (value - from) * eased));
        if (s !== last) { last = s; el.textContent = s; }
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, plain]);
  return (
    <span className="stat-num">
      <span ref={ref}>{plain ? value : 0}</span>
      <span className="copper">{suffix}</span>
    </span>
  );
}

export function Stats() {
  return (
    <section className="stats" aria-label="Studio numbers">
      <ul className="stats-row reveal-group" data-reveal>
        {STATS.map((s) => (
          <li key={s.label} className="stat">
            <Counter {...s} />
            <span className="stat-label mono">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Services: sticky stage + list ---------- */
export function Services() {
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  useEffect(() => {
    const items = [...listRef.current.querySelectorAll('.svc')];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section id="services" className="services section">
      <div className="wrap">
        <div className="services-head reveal-group" data-reveal>
          <div>
            <p className="kicker mono">What we make</p>
            <h2 className="h2">Big screen feel. <span className="copper">Small crew speed.</span></h2>
          </div>
          <p className="lede">
            Four crafts under one roof. The same crew writes, shoots, generates and edits, so your film keeps one look from the first frame to the last.
          </p>
        </div>
        <div className="services-grid">
          <div className="svc-stage" aria-hidden="true">
            {SERVICES.map((s, i) => (
              <div key={s.n} className={`svc-frame${i === active ? ' on' : ''}`} style={{ backgroundImage: `url('${s.img}')` }} />
            ))}
            <div className="svc-caption">
              <span className="mono">{SERVICES[active].n} / 04</span>
              <span className="svc-caption-title">{SERVICES[active].title}</span>
            </div>
            <div className="svc-dots">
              {SERVICES.map((s, i) => <span key={s.n} className={i === active ? 'on' : ''} />)}
            </div>
          </div>
          <ol className="svc-list" ref={listRef}>
            {SERVICES.map((s, i) => (
              <li
                key={s.n}
                className={`svc${i === active ? ' on' : ''}`}
                data-i={i}
                data-reveal
                onMouseEnter={() => setActive(i)}
              >
                <div className="svc-img" style={{ backgroundImage: `url('${s.img}')` }} aria-hidden="true" />
                <span className="svc-n" aria-hidden="true">{s.n}</span>
                <div className="svc-main">
                  <h3 className="svc-title">{s.title}</h3>
                  <p className="svc-body">{s.body}</p>
                  <div className="svc-gets">
                    <p className="mono">What you get</p>
                    <ul>
                      {s.gets.map((g) => <li key={g}>{g}</li>)}
                    </ul>
                  </div>
                  <ul className="tags">
                    {s.tags.map((t) => <li key={t} className="mono">{t}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- Work: a moving filmstrip ---------- */
function Reel({ items, reverse, offset = 0 }) {
  const track = [...items, ...items, ...items];
  return (
    <div className={`reel${reverse ? ' reverse' : ''}`}>
      <ul className="reel-track">
        {track.map((w, i) => {
          const copy = i >= items.length;
          return (
            <li key={i} className="frame-li" aria-hidden={copy ? 'true' : undefined}>
              <Link
                to={`/work/${w.slug}`}
                className="frame"
                style={{ '--h': w.hue, '--img': `url('${w.poster}')` }}
                tabIndex={copy ? -1 : undefined}
                aria-label={copy ? undefined : `${w.title}, ${w.kind}. Open project`}
              >
                <span className="frame-no mono">{String((i % items.length) + 1 + offset).padStart(2, '0')}</span>
                <span className="frame-play" aria-hidden="true" />
                <span className="frame-title">{w.title}</span>
                <span className="frame-kind mono">{w.kind}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Work() {
  const WORK = PROJECTS;
  const half = Math.ceil(WORK.length / 2);
  return (
    <section id="work" className="work section">
      <div className="wrap work-head reveal-group" data-reveal>
        <p className="kicker mono">The work</p>
        <h2 className="h2">Gods, wars and one very serious <span className="copper">sweet-shop rivalry.</span></h2>
        <p className="lede">
          Devotional songs, mythic battle sequences, festival campaigns and a comedy short about Kaju Katli and Soan Papdi. Every project, made by the same small crew. Pick a frame to open the film.
        </p>
      </div>
      <div className="reels" data-reveal>
        <Reel items={WORK.slice(0, half)} />
        <Reel items={WORK.slice(half)} reverse offset={half} />
      </div>
      <div className="wrap work-foot">
        <a className="btn btn-ghost" href="#contact">Ask for the showreel</a>
      </div>
    </section>
  );
}

/* ---------- The one interactive moment: toss the coin ---------- */
function Lotus({ className }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg className={className} viewBox="-100 -100 200 200" aria-hidden="true">
      <circle r="92" pathLength="1" />
      <circle r="70" pathLength="1" />
      {petals.map((a) => (
        <path key={a} pathLength="1" transform={`rotate(${a})`} d="M0 -14 C 18 -34, 16 -60, 0 -78 C -16 -60, -18 -34, 0 -14 Z" />
      ))}
      {petals.map((a) => (
        <path key={'o' + a} pathLength="1" transform={`rotate(${a + 22.5})`} d="M0 -40 C 12 -56, 10 -76, 0 -88 C -10 -76, -12 -56, 0 -40 Z" />
      ))}
      <circle r="12" pathLength="1" />
    </svg>
  );
}

export function CoinToss() {
  const [done, setDone] = useState(false);
  const wrapRef = useRef(null);
  const st = useRef({ p: 0, holding: false, raf: null, last: 0 });

  useEffect(() => {
    const mq = reduceMQ();
    const apply = () => { if (mq.matches) setDone(true); };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    const s = st.current;
    const HOLD = 1300;
    let lastP = -1;
    const write = () => {
      const p = Math.round(s.p * 200) / 200;
      if (p !== lastP) { lastP = p; el.style.setProperty('--hold', p); }
    };
    const loop = (now) => {
      const dt = Math.min(64, now - (s.last || now));
      s.last = now;
      if (s.holding) s.p = Math.min(1, s.p + dt / HOLD);
      else s.p = Math.max(0, s.p - (dt / HOLD) * 1.6 * Math.max(0.25, s.p));
      write();
      if (s.p >= 1) {
        s.holding = false; s.raf = null; s.last = 0;
        setDone(true);
        return;
      }
      if (s.holding || s.p > 0) s.raf = requestAnimationFrame(loop);
      else { s.raf = null; s.last = 0; }
    };
    s.start = () => {
      if (s.done) return;
      s.holding = true;
      if (!s.raf) s.raf = requestAnimationFrame(loop);
    };
    s.stop = () => { s.holding = false; };
  }, []);

  useEffect(() => {
    st.current.done = done;
    if (done) wrapRef.current.style.setProperty('--hold', 1);
  }, [done]);

  const keyDown = (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); st.current.start(); }
  };
  const keyUp = (e) => {
    if (e.key === ' ' || e.key === 'Enter') st.current.stop();
  };

  return (
    <section id="why" className="why section">
      <div className="wrap why-grid">
        <div className="why-copy reveal-group" data-reveal>
          <p className="kicker mono">Why the name</p>
          <h2 className="h2">A film should not need <span className="copper">a crore-rupee crew</span> to feel epic.</h2>
          <p className="lede">
            25 rupees buys a cutting chai in Mumbai. Our name is a reminder that big cinema can come from a small, fast team. Toss the coin and see what you get.
          </p>
          <ul className={`promises${done ? ' lit' : ''}`}>
            {PROMISES.map((p, i) => (
              <li key={p} style={{ '--i': i }}>
                <span className="tick" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <p className="coin-joke-row mono">
            <span className={`coin-joke${done ? ' lit' : ''}`}>Heads, you get cinema. Tails, also cinema.</span>
          </p>
        </div>

        <div className={`coin-wrap${done ? ' tossed' : ''}`} ref={wrapRef}>
          <Lotus className="coin-lotus" />
          <button
            className="coin-btn"
            onPointerDown={(e) => {
              try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic or lost pointer */ }
              st.current.start();
            }}
            onPointerUp={() => st.current.stop()}
            onPointerCancel={() => st.current.stop()}
            onKeyDown={keyDown}
            onKeyUp={keyUp}
            onContextMenu={(e) => e.preventDefault()}
            aria-label={done ? 'Coin tossed. Our three promises are shown.' : 'Press and hold to toss the coin'}
            disabled={done}
          >
            <svg className="hold-ring" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="56" pathLength="1" />
            </svg>
            <span className="coin" aria-hidden="true">
              <span className="coin-face coin-front">
                <Lotus className="coin-art" />
              </span>
              <span className="coin-face coin-back">
                <span className="coin-value">₹25</span>
              </span>
            </span>
          </button>
          <p className="coin-hint mono" aria-hidden="true">{done ? 'Tossed' : 'Press and hold to toss'}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Process with a self-drawing thread ---------- */
export function Process() {
  const ref = useRef(null);
  useEffect(() => {
    const sec = ref.current;
    const path = sec.querySelector('.thread-path');
    let last = -1, raf = null, on = false;
    const draw = () => {
      raf = null;
      const r = sec.getBoundingClientRect();
      const p = reduceMQ().matches ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height * 0.85)));
      const v = Math.round(p * 400) / 400;
      if (v !== last) { last = v; path.style.strokeDashoffset = 1 - v; sec.style.setProperty('--draw', v); }
    };
    const onScroll = () => { if (on && raf === null) raf = requestAnimationFrame(draw); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; onScroll(); });
    io.observe(sec);
    addEventListener('scroll', onScroll, { passive: true });
    const mq = reduceMQ();
    const flip = () => { last = -1; draw(); };
    mq.addEventListener('change', flip);
    draw();
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); mq.removeEventListener('change', flip); };
  }, []);
  return (
    <section id="process" className="process section" ref={ref}>
      <div className="wrap">
        <div className="process-head reveal-group" data-reveal>
          <p className="kicker mono">How it works</p>
          <h2 className="h2">Four steps from <span className="copper">idea to release.</span></h2>
        </div>
        <div className="steps-wrap">
          <svg className="thread" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
            <path className="thread-path" pathLength="1" d="M10 60 C 140 10, 220 110, 360 60 S 600 10, 680 60 S 880 110, 990 60" />
          </svg>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.n} className="step" style={{ '--at': (i + 0.5) / STEPS.length }}>
                <span className="step-dot" aria-hidden="true" />
                <span className="step-n mono">{s.n}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="faq section">
      <div className="wrap faq-grid">
        <div className="faq-head reveal-group" data-reveal>
          <p className="kicker mono">Straight answers</p>
          <h2 className="h2">What people ask <span className="copper">before they call.</span></h2>
        </div>
        <ul className="faq-list" data-reveal>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`qa${isOpen ? ' open' : ''}`}>
                <h3>
                  <button aria-expanded={isOpen} aria-controls={`qa-${i}`} id={`qa-b-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span>{f.q}</span>
                    <span className="plus" aria-hidden="true" />
                  </button>
                </h3>
                <div className="qa-body" id={`qa-${i}`} role="region" aria-labelledby={`qa-b-${i}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
export function Contact() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    setName(f.elements.name.value.trim().split(' ')[0]);
    setSent(true);
  };
  return (
    <section id="contact" className="contact section">
      <div className="wrap contact-grid">
        <div className="contact-copy reveal-group" data-reveal>
          <p className="kicker mono">Start a project</p>
          <h2 className="h2 h2-xl">Got a story? <span className="copper">Let us make it epic.</span></h2>
          <p className="lede">Tell us what you are making and when it needs to drop. We will come back with ideas and an honest quote.</p>
          <img className="contact-logo" src="/assets/logo-large.jpg" alt="25 Rupiya Productions logo" loading="lazy" width="600" height="400" />
        </div>
        <div className="form-card" data-reveal>
          {sent ? (
            <div className="sent" role="status">
              <span className="sent-coin" aria-hidden="true">₹25</span>
              <h3>Got it{name ? `, ${name}` : ''}.</h3>
              <p>Your story is in the queue. We will be in touch soon.</p>
              <button className="btn btn-ghost" onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="row2">
                <label>
                  <span className="mono">Your name</span>
                  <input name="name" required autoComplete="name" placeholder="Aarav Mehta" />
                </label>
                <label>
                  <span className="mono">Email</span>
                  <input name="email" type="email" required autoComplete="email" placeholder="you@studio.in" />
                </label>
              </div>
              <div className="row2">
                <label>
                  <span className="mono">Phone (optional)</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="+91" />
                </label>
                <label>
                  <span className="mono">What are we making?</span>
                  <select name="type" required defaultValue="">
                    <option value="" disabled>Pick one</option>
                    {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
              </div>
              <fieldset className="budget">
                <legend className="mono">Rough budget</legend>
                <div className="chips">
                  {BUDGETS.map((b, i) => (
                    <label key={b} className="chip-radio">
                      <input type="radio" name="budget" value={b} defaultChecked={i === BUDGETS.length - 1} />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label>
                <span className="mono">Tell us the story</span>
                <textarea name="message" rows="4" required placeholder="A Diwali film for our brand, 60 seconds, out by the 20th." />
              </label>
              <button className="btn btn-primary btn-lg" type="submit">Send the brief</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-line">Small coin. <span className="copper">Big cinema.</span></p>
          <p className="mono footer-meta">AI film studio · Mumbai, India · Since 2023</p>
        </div>
        <ul className="footer-links">
          <li><HashLink to="#services">Services</HashLink></li>
          <li><HashLink to="#work">Work</HashLink></li>
          <li><HashLink to="#process">Process</HashLink></li>
          <li><HashLink to="#contact">Contact</HashLink></li>
        </ul>
      </div>
      <div className="wrap footer-base mono">
        <span>© 2026 25 Rupiya Productions</span>
        <span>Site imagery is AI-generated</span>
      </div>
    </footer>
  );
}
