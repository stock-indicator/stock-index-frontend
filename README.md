# Stock Index Frontend

Front-end dashboard for the `stock-index-engine`, built with React, Vite, TypeScript, and Recharts. It surfaces real-time indicator summaries, drill-down history views, and an overview grid inspired by dashdot styling.

## Features
- **Dashboard** with ungrouped and category-grouped indicator cards, highlighting high (red) and low (green) signals.
- **Indicator detail** pages featuring historical charts, time-range switches (1W–5Y & Max), and structured value breakdowns.
- **All-history overview** rendering every indicator chart on a single screen with a global time-range control.
- React Query-powered data layer with graceful loading/error states and caching.

## Getting Started
1. Ensure Node.js `>= 20.19.0` (Vite 7 requires the patch release or newer).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and adjust if needed:
   ```bash
   cp .env.example .env.local
   ```
4. Start the dev server (defaults to `http://localhost:5173`):
   ```bash
   npm run dev
   ```
   The dev server proxies API requests sent to `/engine-api` using the host/port defined in `../stock-index-engine/settings.json` (`"api.host"`, `"api.port"`). Override the target by setting `VITE_DEV_ENGINE_PROXY_TARGET` when you need a different backend.

For production deployments, set `VITE_ENGINE_API_BASE_URL` to the absolute URL that fronts the engine (or a reverse-proxy path). When this variable is undefined the app falls back to the dev proxy path.

## Available Scripts
- `npm run dev` – start Vite in development mode.
- `npm run build` – type-check and build the production bundle.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint across the project.

## Project Structure
- `src/pages` – route-level screens (dashboard, indicator detail, all history).
- `src/components` – reusable UI, layout, dashboard, and chart components.
- `src/api` – Axios client, typed responses, and React Query hooks.
- `src/lib` – indicator utilities and shared helpers.
- `dev_step/requirements.md` – evolving product requirements tracked alongside the codebase.

## Data & API Assumptions
- Uses the engine’s `/indicators`, `/summary`, and `/indicators/{slug}/history` endpoints.
- `lookback_days` query params are applied when switching time ranges; “Max” omits the param to fetch the full history file.
- Indicator `status` values map to tone colours: `high` (red), `low` (green), `normal` (neutral), others (muted).

## Notes
- Initial builds may trigger Vite’s bundle size warning because of the charting library; consider code-splitting by route if you notice slowdowns.
- Ensure the engine’s “full refresh” endpoint isn’t triggered from this UI (per backend guidance).
- Styling references dashdot’s card aesthetic while remaining brand-neutral and fully responsive.

