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
```

### `config.json`

Alternatively, create a `config.json` file at the project root:

```
{
  "quoteUrl": "...",
  "weatherUrl": "...",
  "eventsUrl": "...",
  "personalPhotosUrl": "...",
  "companyPhotosUrl": "..."
}
```

Both `.env` and `config.json` are ignored by git to keep secrets local.

- **Weather**: [WeatherAPI](https://www.weatherapi.com/)
  - Endpoint: `https://api.weatherapi.com/v1/forecast.json`
  - Key: `WEATHERAPI_KEY`
- **Events**: [Google Calendar API](https://developers.google.com/calendar)
  - Endpoint: `https://www.googleapis.com/calendar/v3/calendars/primary/events`
  - Key: `GOOGLE_CALENDAR_API_KEY`
- **Photos**: [Unsplash API](https://unsplash.com/developers)
  - Endpoint: `https://api.unsplash.com/photos/random`
  - Key: `UNSPLASH_ACCESS_KEY`

### CORS

Requests are proxied through `https://cors-anywhere.herokuapp.com/`. You may need to request temporary access from that service for local development or configure your own proxy.
