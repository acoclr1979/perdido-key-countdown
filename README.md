# Perdido Key Countdown (PKC)

A single-page countdown site for the group trip to Perdido Key, FL.

**Live site:** https://acoclr1979.github.io/perdido-key-countdown/
**Trip dates:** July 11–18, 2026

---

## What this is

One self-contained `index.html` (no build step, no framework) deployed via GitHub Pages. It's a fun hub for the group: a live countdown, a rotating quote, a culinary spotlight, a mock "breaking news" ticker, a photo carousel, and the VREI (Vacation Rick Energy Index) hype meter.

Edit the file, commit, push — GitHub Pages handles the rest. No build process.

---

## Page structure (top to bottom)

1. **Breaking News Ticker** — scrolling red banner, headline text changes based on days remaining (see `updateTicker()`)
2. **Culinary Spotlight** — collapsible card for the current featured restaurant
3. **Photo Carousel** — auto-advancing slideshow, 4s interval
4. **Countdown Banner** — days / hours / minutes / seconds to July 11, 2026
5. **Quote of the moment** — random vacation-themed quote, re-rolls every page load... actually every second (see note below)
6. **Weather link** — NWS forecast for Perdido Key
7. **VREI** — Vacation Rick Energy Index meter + rotating Rick quotes
8. **Food links** — Tripadvisor "best places to eat" + archived spotlight links

---

## File inventory

| File | Purpose |
|---|---|
| `index.html` | Everything — markup, styles, and script live in one file |
| `vrei-jokes.json` | External data file holding Vacation Rick quote banks (`simmering` / `building` / `fullSend`) |
| `Photo-00-PKC.jpeg` … `Photo-14-PKC.jpeg` | Carousel images |
| `Photo-7-PKC.JPEG` | ⚠️ Capitalization exception — `.JPEG` not `.jpeg`. Don't "fix" this casing or the image will 404 on case-sensitive hosts. |
| `IMG_1144.jpeg` | One carousel image that didn't get renamed to the `Photo-##-PKC` convention |
| `Photo-18-PKC.jpg` | Tiled background image (note: `.jpg`, not `.jpeg`) |

**Naming convention going forward:** new carousel photos should follow `Photo-##-PKC.jpeg` and get added both as a `<div class="carousel-slide">` block and (implicitly) picked up by the dot generator in JS, which just counts existing slide divs — no separate count to update.

---

## VREI — Vacation Rick Energy Index

The hype meter. Score and tier scale with days-remaining:

- **Tiers:** `simmering` (>15 days out) → `building` (4–15 days) → `fullSend` (0–3 days, or trip has started)
- **Score:** linear scale from a 21-day baseline up to 100 at zero days out, floored at 5 (Rick is never *fully* off)
- **Quotes:** pulled from `vrei-jokes.json`, one random pick per tier change (not every second — see `lastVreiTier` guard in `refreshVrei()`)

### Manual override

```js
const VREI_SCORE_OVERRIDE = null; // set to a number (0–100) to pin the score
```

Use this for a one-off "breaking news" spike effect. Set back to `null` to resume normal days-based calculation.

### Editing jokes

Just edit `vrei-jokes.json` — no HTML/JS changes needed. Keep three keys: `simmering`, `building`, `fullSend`, each an array of strings.

---

## Culinary Spotlight

Pattern for rotating in a new restaurant:

1. Swap the name/tagline/rating/body copy/must-try list/address/links inside `.spotlight-container`
2. Move the *previous* spotlight's link down into the "Archived Spotlight" food-link block near the bottom of the page (this is how Cobalt got archived when Pedro's came in)
3. The collapsible toggle (`spotlightToggle` / `expanded` class) doesn't need touching — it's just reading whatever's in the panel

**Current spotlight:** Pedro's Tacos & Tequila Bar
**Archived:** Cobalt, The Restaurant

---

## Known quirks / things to leave alone

- **Quote re-roll cadence:** `displayQuote()` for the main vacation quote is currently called once at load — it does *not* re-roll on the 1-second interval (only VREI does, and only on tier change). If quotes seem static, that's expected, not a bug.
- **Background tile image** (`Photo-18-PKC.jpg`) animates via `bgScroll` — disabled automatically for users with `prefers-reduced-motion`.
- **Countdown target** is hardcoded as `"July 11, 2026 00:00:00"` — uses the visitor's local timezone, not US Central. Fine for this use case, just don't expect perfect precision across timezones.

---

## Deployment

```bash
git add .
git commit -m "description of change"
git push
```

GitHub Pages serves directly from the repo — changes go live within ~1 minute, no build step.

**Before pushing a redesign or big change:** the site has no staging environment, so test locally first (just open `index.html` in a browser) and keep changes easy to roll back (small commits) since the working style here is iterate-on-live and revert-if-it-doesn't-land.

---

## Roadmap / ideas not yet built

- Next spotlight candidate: TBD after Pedro's
- (add anything else you're planning here so it doesn't get lost)
