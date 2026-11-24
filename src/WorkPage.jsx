import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { PROJECTS, SAMPLE_PEOPLE, projectBySlug } from './projects';
import { useReveal } from './hooks';

const PLACEHOLDER_VIDEO = '/assets/hero-scrub.mp4';
const fmtTime = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const initials = (name) => name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/* ---------- Small pieces ---------- */
function Stars({ value, size = 16, label }) {
  return (
    <span className="stars" style={{ '--s': `${size}px` }} role="img" aria-label={label || `${value.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="star" aria-hidden="true">
            <span className="star-fill" style={{ width: `${fill * 100}%` }} />
          </span>
        );
      })}
    </span>
  );
}

function Avatar({ name, hue, size = 56 }) {
  return (
    <span className="avatar" style={{ '--hue': hue, '--size': `${size}px` }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

function SampleTag({ show, children = 'Sample' }) {
  if (!show) return null;
  return <span className="sample-tag mono" title="Placeholder content. Replace in src/projects.js">{children}</span>;
}

/* ---------- Video player ---------- */
function VideoPlayer({ project }) {
  const { video, youtube, poster, title } = project;
  const wrapRef = useRef(null);
  const vRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [buf, setBuf] = useState(0);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(1);
  const [idle, setIdle] = useState(false);
  const [fs, setFs] = useState(false);
  const idleT = useRef(null);
  const src = video || PLACEHOLDER_VIDEO;
  const isPlaceholder = !video && !youtube;

  useEffect(() => {
    const onFs = () => setFs(document.fullscreenElement === wrapRef.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // reset when the project changes
  useEffect(() => {
    setStarted(false); setPlaying(false); setCur(0); setBuf(0);
  }, [project.slug]);

  const poke = () => {
    setIdle(false);
    clearTimeout(idleT.current);
    idleT.current = setTimeout(() => setIdle(true), 2600);
  };
  useEffect(() => () => clearTimeout(idleT.current), []);

  const toggle = () => {
    const v = vRef.current;
    if (!v) return;
    if (!started) setStarted(true);
    if (v.paused) v.play().catch(() => {}); else v.pause();
    poke();
  };
  const seek = (t) => {
    const v = vRef.current;
    if (!v || !isFinite(v.duration)) return;
    v.currentTime = Math.max(0, Math.min(v.duration, t));
    setCur(v.currentTime);
  };
  const toggleMute = () => { const v = vRef.current; v.muted = !v.muted; setMuted(v.muted); };
  const setVolume = (x) => { const v = vRef.current; v.volume = x; v.muted = x === 0; setVol(x); setMuted(x === 0); };
  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current.requestFullscreen?.().catch(() => {});
  };
  const onKey = (e) => {
    if (e.target.tagName === 'INPUT') return;
    const k = e.key.toLowerCase();
    if (k === ' ' || k === 'k') { e.preventDefault(); toggle(); }
    else if (k === 'arrowright') { e.preventDefault(); seek(cur + 5); poke(); }
    else if (k === 'arrowleft') { e.preventDefault(); seek(cur - 5); poke(); }
    else if (k === 'm') toggleMute();
    else if (k === 'f') toggleFs();
  };

  if (youtube) {
    return (
      <div className="player" ref={wrapRef}>
        {started ? (
          <iframe
            className="player-media"
            src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title}, video`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button className="player-cover" style={{ backgroundImage: `url('${poster}')` }} onClick={() => setStarted(true)} aria-label={`Play ${title}`}>
            <span className="big-play" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`player${started ? ' started' : ''}${playing ? ' playing' : ''}${idle && playing ? ' idle' : ''}${fs ? ' fs' : ''}`}
      ref={wrapRef}
      onMouseMove={poke}
      onKeyDown={onKey}
      tabIndex={0}
      role="region"
      aria-label={`${title} video player. Space to play or pause, arrows to skip, M to mute, F for full screen.`}
    >
      <video
        ref={vRef}
        className="player-media"
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setIdle(false); }}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.buffered.length && v.duration) setBuf(v.buffered.end(v.buffered.length - 1) / v.duration);
        }}
      />
      {!started && (
        <button className="player-cover" style={{ backgroundImage: `url('${poster}')` }} onClick={toggle} aria-label={`Play ${title}`}>
          <span className="big-play" aria-hidden="true" />
          {isPlaceholder && <span className="player-note mono">Studio reel placeholder. The full film goes here.</span>}
        </button>
      )}
      <div className="controls" onClick={(e) => e.stopPropagation()}>
        <button className="ctl" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          <span className={playing ? 'ico-pause' : 'ico-play'} aria-hidden="true" />
        </button>
        <span className="time mono" aria-hidden="true">{fmtTime(cur)}</span>
        <div className="scrub" style={{ '--p': dur ? cur / dur : 0, '--b': buf }}>
          <span className="scrub-buf" aria-hidden="true" />
          <span className="scrub-fill" aria-hidden="true" />
          <input
            type="range" min="0" max={dur || 0} step="0.05" value={cur}
            onChange={(e) => { seek(+e.target.value); poke(); }}
            aria-label="Seek" aria-valuetext={`${fmtTime(cur)} of ${fmtTime(dur)}`}
          />
        </div>
        <span className="time mono" aria-hidden="true">{fmtTime(dur)}</span>
        <button className="ctl" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          <span className={muted || vol === 0 ? 'ico-mute' : 'ico-vol'} aria-hidden="true" />
        </button>
        <input className="vol" type="range" min="0" max="1" step="0.05" value={muted ? 0 : vol} onChange={(e) => setVolume(+e.target.value)} aria-label="Volume" />
        <button className="ctl" onClick={toggleFs} aria-label={fs ? 'Exit full screen' : 'Full screen'}>
          <span className={fs ? 'ico-fs-exit' : 'ico-fs'} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Rate this (saved on this device only) ---------- */
function RateThis({ slug }) {
  const key = `rate:${slug}`;
  const read = () => { try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; } };
  const [val, setVal] = useState(read);
  const [hover, setHover] = useState(0);
  useEffect(() => { setVal(read()); setHover(0); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  const pick = (n) => {
    setVal(n);
    try { localStorage.setItem(key, String(n)); } catch { /* private mode */ }
  };
  const shown = hover || val;
  return (
    <div className="rate-this">
      <p className="mono">Rate this film</p>
      <div className="rate-stars" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={val === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={`rate-star${n <= shown ? ' on' : ''}`}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => pick(n)}
          />
        ))}
      </div>
      <p className="rate-msg" aria-live="polite">
        {val ? `You gave it ${val} out of 5. Saved on this device.` : 'Tap a star to rate.'}
      </p>
    </div>
  );
}

/* ---------- Page ---------- */
export default function WorkPage() {
  const { slug } = useParams();
  const { key } = useLocation();
  const project = projectBySlug(slug);
  useReveal(key + slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) document.title = `${project.title} | 25 Rupiya Productions`;
  }, [project]);

  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const more = useMemo(
    () => (idx < 0 ? [] : [1, 2, 3].map((k) => PROJECTS[(idx + k * 4) % PROJECTS.length])),
    [idx]
  );

  if (!project) return <Navigate to="/#work" replace />;

  const reviews = project.reviews;
  const avg = reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.stars === n).length }));
  const team = project.team.map((id) => SAMPLE_PEOPLE[id]).filter(Boolean);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: project.title, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    } catch { /* cancelled */ }
  };

  return (
    <main id="main" tabIndex={-1} className="wp" key={slug} style={{ '--h': project.hue }}>
      {/* Head */}
      <header className="wp-head">
        <div className="wp-backdrop" style={{ backgroundImage: `url('${project.poster}')` }} aria-hidden="true" />
        <div className="wrap wp-head-inner reveal-group" data-reveal>
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link to="/#work">Work</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>
          <p className="wp-meta mono">
            <span className="pill">{project.kind}</span>
            <span>{project.year}</span>
            <span className="wp-meta-rating"><Stars value={avg} size={13} /> {avg.toFixed(1)} <SampleTag show={project.sample} /></span>
          </p>
          <h1 className="wp-title">{project.title}</h1>
          <p className="wp-logline">{project.logline}</p>
        </div>
      </header>

      {/* Player + rail */}
      <section className="wrap wp-stage" aria-label="Watch">
        <div className="wp-player-col" data-reveal>
          <VideoPlayer project={project} />
        </div>
        <aside className="wp-rail reveal-group" data-reveal aria-label="Project details">
          <dl className="facts">
            <div><dt className="mono">Category</dt><dd>{project.kind}</dd></div>
            <div><dt className="mono">Year</dt><dd>{project.year}</dd></div>
            <div><dt className="mono">Studio</dt><dd>25 Rupiya Productions, Mumbai</dd></div>
            <div>
              <dt className="mono">Crafts</dt>
              <dd className="crafts">{project.crafts.map((c) => <span key={c} className="pill">{c}</span>)}</dd>
            </div>
          </dl>
          <div className="rail-rating">
            <span className="rail-avg">{avg.toFixed(1)}</span>
            <div>
              <Stars value={avg} size={18} />
              <p className="mono">{reviews.length} reviews <SampleTag show={project.sample} /></p>
            </div>
          </div>
          <div className="rail-actions">
            <Link className="btn btn-primary" to="/#contact">Make one like this</Link>
            <button className="btn btn-ghost" onClick={share}>{copied ? 'Link copied' : 'Share'}</button>
          </div>
        </aside>
      </section>

      {/* Overview */}
      <section className="wrap wp-overview section-tight" aria-labelledby="ov-h">
        <div className="reveal-group" data-reveal>
          <p className="kicker mono">The brief</p>
          <h2 id="ov-h" className="h2">What we <span className="copper">set out to make.</span></h2>
        </div>
        <p className="wp-overview-text" data-reveal>{project.overview}</p>
      </section>

      {/* Theme + concept */}
      <section className="wrap wp-ideas section-tight" aria-label="Theme and concept">
        <article className="idea" data-reveal>
          <span className="idea-ico ico-theme" aria-hidden="true" />
          <p className="mono">Theme</p>
          <h3>{project.theme.title}</h3>
          <p>{project.theme.body}</p>
        </article>
        <article className="idea idea-alt" data-reveal>
          <span className="idea-ico ico-concept" aria-hidden="true" />
          <p className="mono">The concept behind it</p>
          <h3>{project.concept.title}</h3>
          <p>{project.concept.body}</p>
        </article>
      </section>

      {/* Team */}
      <section className="wrap wp-team section-tight" aria-labelledby="team-h">
        <div className="wp-team-head reveal-group" data-reveal>
          <p className="kicker mono">The crew</p>
          <h2 id="team-h" className="h2">Who made it. <SampleTag show={project.sample}>Sample team</SampleTag></h2>
        </div>
        <ul className="team-grid reveal-group" data-reveal>
          {team.map((m) => (
            <li key={m.name} className="member">
              <Avatar name={m.name} hue={m.hue} size={72} />
              <div>
                <p className="member-name">{m.name}</p>
                <p className="member-role mono">{m.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Ratings + reviews */}
      <section className="wrap wp-reviews section-tight" aria-labelledby="rev-h">
        <div className="rev-side" data-reveal>
          <p className="kicker mono">Ratings and reviews</p>
          <h2 id="rev-h" className="h2">What clients <span className="copper">said.</span></h2>
          <div className="rev-summary">
            <span className="rev-avg">{avg.toFixed(1)}</span>
            <div>
              <Stars value={avg} size={22} />
              <p className="mono">Based on {reviews.length} reviews <SampleTag show={project.sample} /></p>
            </div>
          </div>
          <ul className="dist" aria-label="Rating breakdown">
            {dist.map(({ n, c }) => (
              <li key={n}>
                <span className="mono">{n}★</span>
                <span className="dist-bar" aria-hidden="true"><span style={{ width: `${(c / reviews.length) * 100}%` }} /></span>
                <span className="mono">{c}</span>
              </li>
            ))}
          </ul>
          <RateThis slug={project.slug} />
        </div>
        <ul className="rev-list reveal-group" data-reveal>
          {reviews.map((r, i) => (
            <li key={i} className="review">
              <div className="review-top">
                <Avatar name={r.org} hue={(project.hue + i * 70) % 360} size={46} />
                <div>
                  <p className="review-name">{r.name} <SampleTag show={project.sample} /></p>
                  <p className="mono review-org">{r.org}</p>
                </div>
                <time className="mono review-date" dateTime={r.date}>{fmtDate(r.date)}</time>
              </div>
              <Stars value={r.stars} size={15} />
              <p className="review-text">{r.text}</p>
            </li>
          ))}
          <li className="review review-cta">
            <p>Worked with us on this one?</p>
            <Link className="btn btn-ghost" to="/#contact">Send us your review</Link>
          </li>
        </ul>
      </section>

      {/* Prev / next + more */}
      <section className="wrap wp-more section-tight" aria-label="More work">
        <nav className="pn" aria-label="Previous and next project">
          <Link className="pn-link" to={`/work/${prev.slug}`}>
            <span className="mono">Previous</span>
            <span className="pn-title">{prev.title}</span>
          </Link>
          <Link className="pn-link pn-next" to={`/work/${next.slug}`}>
            <span className="mono">Next</span>
            <span className="pn-title">{next.title}</span>
          </Link>
        </nav>
        <h2 className="more-h mono">More from the studio</h2>
        <ul className="more-grid reveal-group" data-reveal>
          {more.map((m) => (
            <li key={m.slug}>
              <Link className="more-card" to={`/work/${m.slug}`} style={{ '--img': `url('${m.poster}')`, '--h': m.hue }}>
                <span className="mono">{m.kind}</span>
                <span className="more-title">{m.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="wp-cta" aria-label="Start a project">
        <div className="wrap wp-cta-inner" data-reveal>
          <h2 className="h2 h2-xl">Want a film <span className="copper">like this?</span></h2>
          <Link className="btn btn-primary btn-lg" to="/#contact">Start a project</Link>
        </div>
      </section>
    </main>
  );
}
