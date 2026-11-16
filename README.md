# يوم · Yawm

A private, installable web app for the whole day: habits, training, cycle-aware food, money, reading, music and reflection. *Yawm* is Arabic for “day.” One HTML file, no build step, no framework. Works offline and can sync across devices through Cloudflare.

**Live demo:** https://sofiaodeh.github.io/daily-app/ (example data, stays in your browser)

## What it does
- **Today:** checklists with weekday rules and seasonal lists that expire on a date; sleep, energy and a morning and evening mood tap; pills (daily, every other day, or several times a day for a set course); a daily writing prompt (placeholders here; add your own); a small Ledger for coffee, tea and sugar; and “on this day” notes from a week, month and year ago.
- **Train:** a weekly gym schedule you can rearrange day by day (swap two days, or turn one into mobility), a weekly goal of two upper and two lower sessions, set-by-set logging with weight steppers, rest and set timers, personal records, and a rule-based coach.
- **Cycle:** period log, phase ring and evidence-based food priorities for each phase.
- **Food:** recipe book, a flexible meal plan by cycle phase that re-ranks around what you have, and an automatic shopping list.
- **Money:** import bank and card statements (CSV) and investment statements (PDF, read in the browser), categories that learn from your corrections, monthly limits, a monthly check-in, subscription detection, an investments view explained in plain words with a weekly lesson, and a running tally of interest earned to give away.
- **Reflect:** weekly review, yearly goals with linked habits, a reading list with notes and Goodreads import, a commonplace book, and a year in review.
- **Insights:** habits by weekday, sleep and energy, patterns by cycle phase, and, if you connect Spotify, how sad, nostalgic, upbeat, calm, intense or instrumental music lines up with your mood.
- **Design:** six color themes and an optional Raíces · Judhur motif: Spanish and Arabic page names and tatreez cross-stitch dividers.

## Run it yourself
1. Fork or download this repo.
2. Open `index.html` in a browser. Everything works locally; data is stored in your browser.
3. Edit your lists, routines and pills in **Settings** and **Train → Routines** (plain text, one item per line).

## Host it privately with sync (free)
1. **Cloudflare Pages:** Create application → Pages → Connect to Git → this repo. Framework: None, no build command, no output directory.
2. **Storage:** Storage & databases → Workers KV → create a namespace. In the Pages project: Settings → Bindings → KV namespace, variable name `DAILY`.
3. **Login:** Zero Trust → Access → Applications → Self-hosted. Add `yourproject.pages.dev`, a policy that allows only your email, and the One-time PIN login method.
4. Optional: an environment variable `ALLOWED_EMAIL` with your email as a second check.
5. Redeploy, open the site, log in, and check Settings → Sync.

Sync lives in `functions/api/state.js`: your data is stored and returned as raw text (never parsed on the server, so it stays fast on the free plan), the newest write wins, and a daily snapshot is kept for 30 days. Only the main address can sync; per-deployment preview links are refused.

## Optional: Spotify and Last.fm
For Music & mood in Insights you need your own free keys, entered in **Settings → Music**:
1. **Spotify:** create an app at developer.spotify.com (Web API), add the redirect URI shown in Settings (for example `https://yourproject.pages.dev/spotify`), and paste the Client ID. No client secret is used; sign-in uses PKCE in the browser. Spotify Premium is required for apps in development mode.
2. **Last.fm:** create an API account at last.fm/api and paste the API key. It supplies mood tags for artists; your own labels override them.

Spotify no longer provides audio features (valence, energy) to new apps, which is why mood labels come from tags and from you.

## Customise
- Colors and fonts: CSS variables at the top of `index.html`, plus the `PALETTES` list.
- Default lists, routines, recipes, pills and Ledger items: `DEFAULT_CORE`, `DEFAULT_SEASON`, `DEFAULT_ROUTINES`, `SEED_RECIPES`, `PILLS_DEFAULT`, `LEDGER_DEFAULT`.
- Writing prompts: the `PROMPTS` list holds placeholders. Replace them with your own, one per day of the year (each with `t` for the text and `len` for the suggested length; an optional `ref` adds a link).
- Statement categories: the rules in `autoCat`.

Health, nutrition and money notes are general information, not medical or financial advice.

## How it was made
Designed by Sofia Odeh and built with AI-assisted coding (Claude). MIT licensed.
