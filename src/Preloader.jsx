import { useEffect, useRef, useState } from 'react';

/* Plays the studio's own logo animation, then lifts away like a curtain. */
export default function Preloader({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const videoRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setLeaving(true);
      onDone();
      setTimeout(() => setGone(true), reduce ? 400 : 1300);
    };
    const v = videoRef.current;
    let safety;
    if (reduce) {
      safety = setTimeout(finish, 900);
    } else {
      v.addEventListener('ended', finish);
      v.addEventListener('error', finish);
      const p = v.play();
      if (p && p.catch) p.catch(() => setTimeout(finish, 1200));
      safety = setTimeout(finish, 8000); // never trap the visitor
    }
    return () => {
      clearTimeout(safety);
      v.removeEventListener('ended', finish);
      v.removeEventListener('error', finish);
    };
  }, [onDone]);

  useEffect(() => {
    document.documentElement.classList.toggle('locked', !leaving);
  }, [leaving]);

  if (gone) return null;

  const skip = () => {
    if (doneRef.current) return;
    videoRef.current.pause();
    videoRef.current.dispatchEvent(new Event('ended'));
  };

  return (
    <div className={`preloader${leaving ? ' leaving' : ''}`} role="presentation">
      <video
        ref={videoRef}
        className="preloader-video"
        src="/assets/preloader.mp4"
        poster={matchMedia('(prefers-reduced-motion: reduce)').matches ? '/assets/preloader-end.jpg' : undefined}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <button className="preloader-skip mono" onClick={skip}>
        Skip intro
      </button>
    </div>
  );
}
