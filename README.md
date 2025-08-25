# Productivity Dashboard

## API Configuration

This dashboard relies on several external APIs. API keys and endpoints are read from a configuration module at runtime.
Provide these values via environment variables or a local `config.json` file.

### Environment variables

Create a `.env` file and define the following values. Ensure your build process exposes them to the browser environment.

```
QUOTE_URL=
WEATHER_URL=
EVENTS_URL=
PERSONAL_PHOTOS_URL=
COMPANY_PHOTOS_URL=
STOCK_URL=
NEWS_URL=
```

### `config.json`

Alternatively, create a `config.json` file at the project root:

```
{
  "quoteUrl": "...",
  "weatherUrl": "...",
  "eventsUrl": "...",
  "personalPhotosUrl": "...",
  "companyPhotosUrl": "...",
  "stockUrl": "...",
  "newsUrl": "..."
}
```

Both `.env` and `config.json` are ignored by git to keep secrets local.

- **Weather**: Requests use the `WEATHER_URL` endpoint directly. No API keys are stored in this repo.
- **Events**: [Google Calendar API](https://developers.google.com/calendar)
  - Endpoint: `https://www.googleapis.com/calendar/v3/calendars/primary/events`
  - Key: `GOOGLE_CALENDAR_API_KEY`
- **Photos**: [Unsplash API](https://unsplash.com/developers)
  - Endpoint: `https://api.unsplash.com/photos/random`
  - Key: `UNSPLASH_ACCESS_KEY`
- **Stocks**: [Alpha Vantage](https://www.alphavantage.co/)
  - Endpoint: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_KEY`
  - Key: `ALPHAVANTAGE_API_KEY`
- **News**: [NewsAPI](https://newsapi.org/)
  - Endpoint: `https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_KEY`
  - Key: `NEWSAPI_KEY`
  - Set `NEWSAPI_KEY` in the server environment; the Node server reads this value when handling `/api/news` requests.

### Local proxy

Run the built-in Node server to serve the dashboard and forward API requests with appropriate CORS headers:

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Access the app at `http://localhost:3000`

The client can forward requests through `/api/proxy?url=...` for generic third-party APIs. `/api/news` is available for NewsAPI calls. Weather requests bypass the proxy and use `WEATHER_URL` directly.
