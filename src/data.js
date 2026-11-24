// Every viewer-facing line ships verbatim from DESIGN.md.

export const GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
];

export const BANDS = [
  { a: 0.0, b: 0.22, side: 'left', fx: 'drift', title: 'Every epic starts small.', sub: 'An AI film studio from Mumbai.' },
  { a: 0.26, b: 0.48, side: 'right', fx: 'scatter', title: 'Gods. Wars. Whole worlds.', sub: 'Mythology, music videos and brand films, made with AI and a real crew.', spread: 0.55 },
  { a: 0.52, b: 0.74, side: 'left', fx: 'snap', title: 'Shot in days, not months.', sub: 'First cuts land fast, so your release date stays yours.', spread: 0.5 },
  { a: 0.8, b: 1.0, side: 'center', fx: 'rise', title: 'Small coin. Big cinema.', sub: 'AI-powered films for brands, labels and artists.', cta: true, ramp: 0.06 },
];

export const STATS = [
  { value: 100, suffix: 'M+', label: 'views across our releases' },
  { value: 50, suffix: '+', label: 'projects delivered' },
  { value: 24, suffix: ' hr', label: 'turnaround on social cuts' },
  { value: 2023, suffix: '', label: 'founded in Mumbai', plain: true },
];

export const SERVICES = [
  {
    n: '01',
    title: 'AI Brand Films',
    body: 'Campaign films and social cuts that stop the scroll. Written, directed and finished in-house.',
    tags: ['Campaign films', 'Reels and Shorts', 'Launch teasers'],
    gets: ['A hero film, 30 to 90 seconds', 'Cut-downs for Reels and Shorts', 'Stills and thumbnails from the shoot'],
    img: '/assets/svc-films.jpg',
  },
  {
    n: '02',
    title: 'Culture-Led Photography',
    body: 'Editorial and lifestyle stills rooted in where your audience actually lives. Real shoots, sharpened by AI.',
    tags: ['Editorial', 'Lifestyle', 'Product'],
    gets: ['Campaign and catalogue stills', 'Festive and lifestyle editorials', 'Retouching and set extensions'],
    img: '/assets/svc-photo.jpg',
  },
  {
    n: '03',
    title: 'CGI and Visual Worlds',
    body: 'Temples in the clouds, armies on the plain, cities that never existed. Built frame by frame for your story.',
    tags: ['Environments', 'VFX', 'Mythic worlds'],
    gets: ['Environments and matte paintings', 'VFX shots for music videos', 'Gods, armies and mythic creatures'],
    img: '/assets/svc-cgi.jpg',
  },
  {
    n: '04',
    title: 'AI-Powered Production',
    body: 'A pipeline that turns one shoot into a month of content, so your channel never runs dry.',
    tags: ['Content at scale', 'Edits', 'Versions for every platform'],
    gets: ['One shoot, many edits', 'Every size for every platform', 'Monthly content packs'],
    img: '/assets/svc-production.jpg',
  },
];

export const PROMISES = [
  'A clear quote before we start',
  'A first cut in days, not months',
  'Changes built into every project',
];

export const STEPS = [
  { n: '01', title: 'Brief', body: 'Tell us the story, the audience and the date it needs to drop. One call is usually enough.' },
  { n: '02', title: 'Concept', body: 'Moodboards, storyboards and a test frame, so you see the look before we build it.' },
  { n: '03', title: 'Produce', body: 'We shoot what needs a camera and generate what does not, with quick rounds of changes.' },
  { n: '04', title: 'Deliver', body: 'Exports sized for every screen, plus the assets to reuse next time.' },
];

export const FAQS = [
  { q: 'Will it look fake?', a: 'Not if it is made well. We direct every frame like a film: real art direction, real editing, real colour. AI is the camera, not the director.' },
  { q: 'Is everything made with AI?', a: 'No. Most projects mix live shoots with AI-generated worlds and effects. We use whichever gets the better shot.' },
  { q: 'How fast can you deliver?', a: 'Social cuts can turn around in 24 hours. Music videos and brand films usually take one to three weeks, depending on length.' },
  { q: 'What does it cost?', a: 'Less than a traditional shoot of the same scale. Share your budget in the form and we will tell you honestly what it can buy.' },
  { q: 'Who owns the final film?', a: 'You do. Once the project is paid, the final files are yours to publish anywhere.' },
  { q: 'Can we ask for changes?', a: 'Yes. Rounds of changes are part of every project, and we agree how many before we start.' },
];

export const PROJECT_TYPES = ['AI brand film', 'Music video', 'Devotional or mythology', 'Animation or CGI', 'Photography', 'Something else'];
export const BUDGETS = ['Under ₹50k', '₹50k to ₹2L', '₹2L to ₹10L', '₹10L and up', 'Not sure yet'];
