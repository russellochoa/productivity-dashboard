# Productivity Dashboard

## Tooling Evaluation

This project began as a static HTML page and does not require a heavy front‑end framework. React, Vue, and Svelte would all necessitate rewriting the interface into components, increasing complexity. Between bundlers, Webpack offers extensive configuration but is slower to start and more verbose. Vite provides an instant dev server, minimal setup, and production builds with built‑in minification and hashed filenames for cache busting. Given the project's goals, Vite with vanilla JavaScript is the most streamlined choice.

## Development and Deployment

1. Install dependencies with `npm install`.
2. Start a development server using `npm run dev`.
3. Create a production build via `npm run build`. The optimized output in `dist/` includes minified assets with cache‑busting hashes.
4. Deploy the contents of `dist/` to your static host (e.g., GitHub Pages). Ensure the `CNAME` file is preserved if using a custom domain.

## API Configuration

This dashboard relies on several external APIs. Supply the required keys to Vite through a `.env` file in the project root:

```
VITE_WEATHERAPI_KEY=your_weatherapi_key
VITE_GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

These variables are read in `src/main.js` via `import.meta.env` and injected at build time.

- **Weather**: [WeatherAPI](https://www.weatherapi.com/)
  - Endpoint: `https://api.weatherapi.com/v1/forecast.json`
  - Key: `VITE_WEATHERAPI_KEY`
- **Events**: [Google Calendar API](https://developers.google.com/calendar)
  - Endpoint: `https://www.googleapis.com/calendar/v3/calendars/primary/events`
  - Key: `VITE_GOOGLE_CALENDAR_API_KEY`
- **Photos**: [Unsplash API](https://unsplash.com/developers)
  - Endpoint: `https://api.unsplash.com/photos/random`
  - Key: `VITE_UNSPLASH_ACCESS_KEY`

### CORS

Requests are proxied through `https://cors-anywhere.herokuapp.com/`. You may need to request temporary access from that service for local development or configure your own proxy.
