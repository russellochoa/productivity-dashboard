# Productivity Dashboard

## API Configuration

This dashboard relies on several external APIs. Replace the placeholder `YOUR_*` values in `public/main.js` with your own keys.

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

## Testing

This project uses [Jest](https://jestjs.io/) for unit tests.

```bash
npm install
npm test
```

### Continuous Integration

A GitHub Actions workflow runs `npm test` on each push and pull request to ensure helpers continue to work as expected.
