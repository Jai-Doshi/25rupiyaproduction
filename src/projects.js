/*
  Work detail pages. ONE FILE TO EDIT.

  - video: put an .mp4 path in /public/assets (e.g. '/assets/work/jai-hanumaan.mp4')
           OR a YouTube id in `youtube` (e.g. 'dQw4w9WgXcQ'). Leave both empty to show the studio reel.
  - Anything inside SAMPLE_* below is placeholder copy. Pages show a "Sample" label on the
    team, rating and reviews while `sample: true`. Replace with real people and real client
    feedback, then set `sample: false` on that project.
*/

const P = {
  films: '/assets/svc-films.jpg',
  photo: '/assets/svc-photo.jpg',
  cgi: '/assets/svc-cgi.jpg',
  prod: '/assets/svc-production.jpg',
  coin: '/assets/hero-poster.jpg',
  rest: '/assets/hero-ending.jpg',
};

/* ---------- Sample people (replace with the real crew) ---------- */
export const SAMPLE_PEOPLE = {
  dir: { name: 'Sample Director', role: 'Director and art direction', hue: 18 },
  write: { name: 'Sample Writer', role: 'Script writing', hue: 232 },
  edit: { name: 'Sample Editor', role: 'Video editing', hue: 160 },
  ai: { name: 'Sample AI Artist', role: 'AI generation and CGI', hue: 268 },
  colour: { name: 'Sample Colourist', role: 'Colour and finishing', hue: 36 },
  sound: { name: 'Sample Sound Designer', role: 'Sound and music', hue: 352 },
};

/* ---------- Sample reviews (replace with real client words) ---------- */
const SAMPLE_REVIEWS = [
  { name: 'Sample Client', org: 'Music label', stars: 5, date: '2026-03-12', text: 'The look was locked before a single frame was generated, so there were no surprises. Delivered ahead of our release date.' },
  { name: 'Sample Client', org: 'Devotional channel', stars: 5, date: '2026-02-02', text: 'Our audience asked how we shot it. That is the best compliment an AI film can get.' },
  { name: 'Sample Client', org: 'Brand team', stars: 4, date: '2026-01-20', text: 'Fast, clear about cost, and open to changes. One more round on the colour would have made it perfect.' },
  { name: 'Sample Client', org: 'Independent artist', stars: 5, date: '2026-04-08', text: 'They understood the song before they understood the brief. Every cut lands on the beat.' },
  { name: 'Sample Client', org: 'Agency producer', stars: 5, date: '2026-05-15', text: 'We got a festival-scale film on a social budget, and the cut-downs were ready the same week.' },
  { name: 'Sample Client', org: 'Regional broadcaster', stars: 4, date: '2026-06-01', text: 'Strong storytelling and a team that answers the phone. We are already planning the next one.' },
];
const pickReviews = (i) => [0, 1, 2].map((k) => SAMPLE_REVIEWS[(i + k * 2) % SAMPLE_REVIEWS.length]);

/* ---------- Projects ---------- */
const RAW = [
  {
    slug: 'jai-hanumaan', title: 'Jai Hanumaan', kind: 'Devotional song', hue: 18, poster: P.films,
    logline: 'A devotional anthem that follows Hanuman from a single prayer to a leap across the ocean.',
    overview: 'A full music video built around one devotional track. We storyboarded every verse as a chapter of Hanuman\'s devotion, then generated the mythic wide shots and shot close-ups for the human moments in between.',
    theme: { title: 'Devotion as strength', body: 'The film treats faith as a force you can see: light that grows brighter every time the chorus returns, until it carries the hero across the sea.' },
    concept: { title: 'One leap, one song', body: 'The whole edit builds toward a single moment, the leap. Every verse raises the scale of the world around Hanuman so the final jump feels earned, not inserted.' },
    crafts: ['Video editing', 'Script writing', 'Art direction'], team: ['dir', 'ai', 'edit', 'sound'],
  },
  {
    slug: 'mahabharat-war', title: 'Mahabharat War', kind: 'AI film sequence', hue: 352, poster: P.cgi,
    logline: 'Kurukshetra at dawn. Two armies, one field, and the moment before the first arrow flies.',
    overview: 'An epic battle sequence made almost entirely with AI generation, cut like a feature film trailer. We kept the camera grounded at human height so the scale of the armies hits harder.',
    theme: { title: 'Duty against blood', body: 'Every shot asks the question at the heart of the epic: what do you owe the people you are about to fight?' },
    concept: { title: 'The calm before the war', body: 'Instead of starting with chaos, we hold on silence, wind and banners, so that when the conches sound the audience feels the drop in their stomach.' },
    crafts: ['Video editing', 'Art direction'], team: ['dir', 'ai', 'colour', 'sound'],
  },
  {
    slug: 'lord-shiv-stotram', title: 'Lord Shiv Stotram', kind: 'Devotional song', hue: 232, poster: P.coin,
    logline: 'An ancient hymn set to the stillness of Kailash, where every frame breathes with the chant.',
    overview: 'A meditative visual for a Shiv stotram. The pace follows the chant itself: long, slow shots of mountains, smoke and fire that never rush the listener.',
    theme: { title: 'Stillness and power', body: 'Shiva as both the calm mountain and the storm. The film moves between snow-quiet frames and sudden bursts of cosmic energy.' },
    concept: { title: 'Cut to the breath', body: 'Edits fall on the singer\'s breaths, not on the beat, so the video feels like part of the prayer instead of decoration around it.' },
    crafts: ['Video editing', 'Art direction'], team: ['dir', 'ai', 'edit'],
  },
  {
    slug: 'trilokpati', title: 'Trilokpati', kind: 'Music video', hue: 40, poster: P.cgi,
    logline: 'A journey through the three worlds, heaven, earth and the underworld, in one continuous song.',
    overview: 'A music video that travels through three distinct worlds, each with its own palette and light. AI-built environments let us move between realms in a single shot.',
    theme: { title: 'Lord of three worlds', body: 'Power that holds every realm together. The visuals shift from gold to green to ember as the song moves between worlds.' },
    concept: { title: 'Three palettes, one thread', body: 'A single glowing thread of light guides the camera through each world, so the viewer never loses their place as the scenery changes.' },
    crafts: ['Video editing', 'Script writing', 'Art direction'], team: ['dir', 'write', 'ai', 'colour'],
  },
  {
    slug: 'devyug', title: 'Devyug', kind: 'Trailer', hue: 268, poster: P.rest,
    logline: 'The age of the gods returns. A trailer for a mythic saga told at blockbuster scale.',
    overview: 'A cinematic trailer built to sell a world. We designed the gods, the cities and the weapons first, then cut a two-minute tease that reveals just enough.',
    theme: { title: 'Gods among us', body: 'What happens when the divine walks the earth again? The trailer plays with awe and fear in equal measure.' },
    concept: { title: 'Reveal less, promise more', body: 'Faces stay in shadow and silhouette until the final title card, building curiosity the way a studio trailer does.' },
    crafts: ['Video editing', 'Script writing', 'Art direction'], team: ['dir', 'write', 'ai', 'edit', 'sound'],
  },
  {
    slug: 'kaju-katli-vs-soan-papdi', title: 'Kaju Katli vs Soan Papdi', kind: 'Comedy short', hue: 30, poster: P.photo,
    logline: 'Every Diwali, one sweet is loved and one is re-gifted. This year, they settle it.',
    overview: 'A comedic short that stages the great Indian sweet rivalry as an action film. Slow-motion entrances, dramatic dialogue and a showdown on a mithai box.',
    theme: { title: 'Festive rivalry', body: 'A joke every Indian family knows, told with a straight face and full blockbuster treatment.' },
    concept: { title: 'Mithai, but make it epic', body: 'We shot it exactly like a serious action film. The comedy comes from treating two sweets with total cinematic respect.' },
    crafts: ['Video editing', 'Script writing'], team: ['write', 'dir', 'ai', 'edit'],
  },
  {
    slug: 'bajrangbali', title: 'Bajrangbali', kind: 'Music video', hue: 8, poster: P.films,
    logline: 'Raw power and pure devotion. A high-energy anthem for the mightiest devotee.',
    overview: 'A high-tempo music video where every drum hit drives a visual impact: mountains lifted, demons scattered, fire and dust on every beat.',
    theme: { title: 'Strength in service', body: 'The strongest hero in the epics uses his power only in service of others. The video keeps that humility inside the spectacle.' },
    concept: { title: 'Hit on the beat', body: 'We mapped the track drum by drum and built an impact for each one, so the visuals feel played like an instrument.' },
    crafts: ['Video editing', 'Art direction'], team: ['dir', 'ai', 'edit', 'sound'],
  },
  {
    slug: 'namaste-narsimhaya', title: 'Namaste Narsimhaya', kind: 'Devotional song', hue: 24, poster: P.coin,
    logline: 'The fierce protector bursts from the pillar. A devotional song of fear turned into faith.',
    overview: 'A devotional video telling the story of Narasimha and Prahlad. We balanced the ferocity of the avatar with the gentleness of the child who believed.',
    theme: { title: 'Faith that protects', body: 'A child\'s belief summons the fiercest form of the divine. The film keeps the child\'s view at the centre of every scene.' },
    concept: { title: 'Fire and calm', body: 'Narasimha arrives in fire and storm, but every cut back to Prahlad drops into stillness and warm light.' },
    crafts: ['Video editing', 'Art direction'], team: ['dir', 'ai', 'colour'],
  },
  {
    slug: 'train-sequence', title: 'Train Sequence', kind: 'AI film sequence', hue: 210, poster: P.prod,
    logline: 'A night train, a stranger in the next seat, and a journey that does not go where the ticket says.',
    overview: 'A short cinematic test built to show how far AI filmmaking can push mood and tension. Rain on glass, flickering cabin light and a slow-building mystery.',
    theme: { title: 'Strangers in transit', body: 'Trains as places where strangers share a few hours and a few secrets, then never meet again.' },
    concept: { title: 'One carriage, total mood', body: 'The entire sequence stays inside one carriage. Light, weather and sound do all the storytelling.' },
    crafts: ['Video editing', 'Art direction'], team: ['dir', 'ai', 'sound'],
  },
  {
    slug: 'vulture-sequence', title: 'Vulture Sequence', kind: 'AI film sequence', hue: 250, poster: P.cgi,
    logline: 'Above a broken battlefield, Jatayu makes his last stand.',
    overview: 'An aerial sequence inspired by the epic flight of Jatayu. Sweeping wide shots across cliffs and clouds, built entirely in our AI pipeline.',
    theme: { title: 'Sacrifice in flight', body: 'An old warrior who fights a battle he cannot win, because it is the right thing to do.' },
    concept: { title: 'Fly with him', body: 'The camera never leaves the sky. We stay at wing height so the audience feels the wind, the height and the fall.' },
    crafts: ['Video editing', 'Art direction'], team: ['dir', 'ai', 'colour'],
  },
  {
    slug: 'anmol-tv-diwali', title: 'Anmol TV Diwali', kind: 'Festival campaign', hue: 36, poster: P.photo,
    logline: 'A Diwali greeting for a channel\'s audience, glowing with diyas, rangoli and family.',
    overview: 'A festive campaign film for a television channel, delivered with cut-downs for every platform. Warm, bright and made to be shared on family groups.',
    theme: { title: 'Light comes home', body: 'Diwali as homecoming: the lamps are lit because someone is on their way back.' },
    concept: { title: 'One diya at a time', body: 'The film starts with a single lamp and ends with a whole street glowing, one light passed hand to hand.' },
    crafts: ['Video editing', 'Script writing', 'Art direction'], team: ['write', 'dir', 'edit', 'colour'],
  },
  {
    slug: 'bohagor-rongot', title: 'Bohagor Rongot', kind: 'Music video', hue: 160, poster: P.rest,
    logline: 'The colours of Bohag. A spring song from Assam, in fields, rivers and dance.',
    overview: 'A music video celebrating Bohag Bihu and the Assamese spring. Green fields, river light and festival colour, rooted in the place the song comes from.',
    theme: { title: 'Spring and belonging', body: 'A new year, a new season and the joy of being home for it.' },
    concept: { title: 'Paint with the season', body: 'Each verse adds a new colour to the frame, until the final chorus is a full festival in bloom.' },
    crafts: ['Video editing', 'Art direction'], team: ['dir', 'ai', 'edit'],
  },
  {
    slug: 'sher-singh', title: 'Sher Singh', kind: 'Character film', hue: 14, poster: P.films,
    logline: 'A warrior with a lion\'s name, and a story told in the scars he carries.',
    overview: 'A character piece built around one hero. We designed his look, his armour and his world before writing a single line of the film.',
    theme: { title: 'Courage has a cost', body: 'Bravery is not the absence of fear. Sher Singh is afraid in every scene, and goes anyway.' },
    concept: { title: 'Character first', body: 'The film is a portrait. Every shot reveals something about who he is, rather than what he does.' },
    crafts: ['Video editing', 'Script writing', 'Art direction'], team: ['write', 'dir', 'ai', 'colour'],
  },
  {
    slug: 'ozeg', title: 'Ozeg', kind: 'Music video', hue: 286, poster: P.prod,
    logline: 'A neon dream that bends between memory and night.',
    overview: 'A stylised music video for an independent artist, mixing performance footage with AI-generated dreamscapes that shift with the track.',
    theme: { title: 'Memory and night', body: 'The song lives in the hour after midnight, when old memories come back brighter than they were.' },
    concept: { title: 'The world follows the voice', body: 'The environment changes only when the vocal changes, so the artist stays the anchor of every frame.' },
    crafts: ['Video editing', 'Art direction'], team: ['dir', 'ai', 'edit', 'sound'],
  },
];

export const PROJECTS = RAW.map((p, i) => ({
  year: 2026,
  video: '',
  youtube: '',
  sample: true,
  reviews: pickReviews(i),
  ...p,
}));

export const projectBySlug = (slug) => PROJECTS.find((p) => p.slug === slug);
