# Nutrition Tracker

A lightweight mobile web app for logging food and tracking **calories, protein, and fat**.
Built as static files (no build step, no backend) so it can be added to the iPhone Home
Screen from Safari and used like a native app.

## Features (V1)

- **Running totals** for calories, protein, and fat for the current day.
- **Quick Add** chips — one tap to log a food. Ranked by your own past usage, and seeded
  with common foods on first run.
- **Search bar** — type any food name or category and tap a result to log it.
- **Browse by category** — pick a category, then a food, adjust the amount, and add.
- **Today's log** with per-item macros and one-tap remove.
- **Local persistence** — your log and usage history are stored in the browser
  (`localStorage`). The log automatically rolls over to a fresh list each day.

No data ever leaves the device.

## Add to iPhone Home Screen

1. Host the folder somewhere your phone can reach it (see below) and open it in **Safari**.
2. Tap the **Share** button → **Add to Home Screen**.
3. Launch it from the new icon — it opens full-screen without Safari's chrome
   (thanks to the `apple-mobile-web-app-capable` meta tag and the web app manifest).

## Running it

It's just static files. Any static host works. For a quick local test:

```sh
python3 -m http.server 8000
# then open http://<your-computer-ip>:8000 on the phone (same Wi-Fi)
```

Or drop the folder on GitHub Pages / Netlify / any static host.

## Deploying to Vercel

This is a static site with no build step. `vercel.json` sets sensible cache
headers (icons cached long; HTML/JS/CSS revalidate so updates appear
immediately), and `.vercelignore` keeps dev-only files out of the deploy.

**Option A — Git integration (recommended):**

1. Go to [vercel.com/new](https://vercel.com/new) and import the
   `merlintucao/nutritionapp` repo.
2. Framework Preset: **Other**. Leave build command and output directory empty.
3. Deploy. Vercel serves the files as-is and auto-redeploys on every push.

**Option B — Vercel CLI:**

```sh
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

Once deployed, open the Vercel URL in Safari on your iPhone and
**Share → Add to Home Screen**.

## Project layout

| File | Purpose |
|------|---------|
| `index.html` | App shell and markup |
| `style.css` | Mobile-first dark UI |
| `app.js` | All app logic (log, totals, search, quick-add, persistence) |
| `data.js` | The common-food database (`FOOD_DB`, `CATEGORIES`) |
| `manifest.json` | Web app manifest for installability |
| `icons/` | App icons (180/192/512) |
| `scripts/gen-icons.js` | Regenerates the PNG icons |
| `scripts/smoke.js` | Headless end-to-end smoke test (Playwright) |

## Adding foods

Edit `data.js`. Each entry lists macros **per serving**:

```js
{ id: 'banana', name: 'Banana', category: 'Fruits',
  servingSize: 1, servingUnit: 'medium',
  calories: 105, protein: 1.3, fat: 0.4, common: true }
```

Set `common: true` to surface a food first in category lists and in the default
Quick Add row.
