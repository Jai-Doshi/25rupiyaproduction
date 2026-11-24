# 25 Rupiya Productions: Design Package (Tier 1)

## 1. Brand premise
The name is a joke and a promise: a 25 rupee coin. A small coin that lands and opens a whole world. The site sells one idea: **small coin, big cinema.** Epic, mythic, festival-scale films made by a tiny AI-first crew, fast and at a budget you can say out loud. The hero film is the coin falling into a temple of light. The interactive moment is tossing that coin.

## 2. Palette
```css
:root{
  --canvas:#0b0d1f;        /* cosmic indigo, from the hero smoke */
  --panel:#141834;
  --accent:#e8492f;        /* sindoor vermilion, from the embers. CTA and rare emphasis only */
  --accent-hover:#ff6448;
  --accent-muted:rgba(232,73,47,.32);
  --copper:#d08a52;        /* the coin. Signature, not accent */
  --text-secondary:#a9aac6;
  --text-primary:#f2eadb;  /* ivory, from the smoke highlights */
}
```

## 3. Type trio
- Display: **Teko** 500, 600 (Indian Type Foundry, condensed poster face, Bollywood title-card energy)
- Body: **Hind** 400, 500 (Indian Type Foundry, quiet)
- Mono: **IBM Plex Mono** 400 (labels, frame counters)

## 4. Band map (hero 460vh)
| Band | Range | Footage moment | Copy | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.22 | coin hangs in the light shaft | "Every epic starts small." / "An AI film studio from Mumbai." | drift-down (the fall) |
| 2 | 0.26 to 0.48 | coin tumbles, rim flashes | "Gods. Wars. Whole worlds." / "Mythology, music videos and brand films, made with AI and a real crew." | scatter (embers) |
| 3 | 0.52 to 0.72 | coin nears the mandala | "Shot in days, not months." / "First cuts land fast, so your release date stays yours." | grid snap-align |
| 4 | 0.80 to 1.00 | coin lands, rests on the lotus | "Small coin. Big cinema." / "AI-powered films for brands, labels and artists." / CTA | word rise into staged settle |

Bands 1 and 3 sit left, band 2 sits right (two-sided scrims, centre lane stays bright). Band 4 sits upper centre, above the coin.

## 5. Static hero copy (phones, reduced motion)
"Small coin. Big cinema." / "An AI film studio from Mumbai, making mythology, music videos and brand films that look like they cost a fortune." / Start a project · See the work

## 6. Below the fold
1. Proof strip: 100M+ views · 50+ projects · 24 hr social cuts · Since 2023
2. Services (4, each with a still): AI Brand Films · Culture-Led Photography · CGI and Visual Worlds · AI-Powered Production
3. The Work: filmstrip of 12 real titles
4. Why 25 Rupiya (the interactive moment: press and hold to toss the coin; three promises light up)
5. Process: Brief, Concept, Produce, Deliver, joined by a self-drawing thread
6. FAQ: real objections (fake look, all AI?, speed, cost, ownership, changes)
7. Start a project form (JS-only thank-you state)
8. Footer with logo, tagline, AI-imagery note

## 7. Vector layer
Lotus mandala line art (self-draws behind the coin toss), the process thread, film-sprocket edges on the work strip, whisper embers drifting in the fixed background.

## 8. Engineering
Blob fetch with loading ring, dt-normalised lerp, gated seeks, delta-gated writes, band pacing in vh, four-layer legibility, five live static-hero gates, complete without video, reduced motion live in both directions. Built in React (Vite) at the client's request; the scrub engine runs imperatively in refs, never through React state per frame.

## 9. Copy gate
All lines ship verbatim. Zero em dashes, zero stock words, body sweep for AI tells before anyone sees it.
