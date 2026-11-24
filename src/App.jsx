import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Preloader from './Preloader';
import Hero from './Hero';
import WorkPage from './WorkPage';
import { useReveal } from './hooks';
import { Nav, Ambient, Stats, Services, Work, CoinToss, Process, Faq, Contact, Footer } from './Sections';

function Home({ introDone }) {
  const { hash, key } = useLocation();
  useReveal(key);
  // Arriving from another page with /#section: jump there once the page has laid out.
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'auto' });
    }, 60);
    return () => clearTimeout(t);
  }, [hash, key]);
  useEffect(() => {
    document.title = '25 Rupiya Productions | AI Film Studio, Mumbai';
  }, []);
  return (
    <main id="main" tabIndex={-1}>
      <span id="top" />
      <Hero introDone={introDone} />
      <Stats />
      <Services />
      <Work />
      <CoinToss />
      <Process />
      <Faq />
      <Contact />
    </main>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const onDone = useCallback(() => setIntroDone(true), []);
  const { pathname, hash } = useLocation();

  // New page, new scroll: start at the top unless a section was asked for.
  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const vis = () => document.body.classList.toggle('paused', document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, []);

  return (
    <>
      <Preloader onDone={onDone} />
      <Ambient />
      <Nav />
      <Routes>
        <Route path="/" element={<Home introDone={introDone} />} />
        <Route path="/work/:slug" element={<WorkPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
