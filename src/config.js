export async function loadConfig() {
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  let config = {};

  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      config = await response.json();
    } else {
      console.warn('Config file not found or invalid');
    }
  } catch (err) {
    console.error('Failed to load config.json', err);
  }

  if (env.QUOTE_URL) config.quoteUrl = env.QUOTE_URL;
  if (env.WEATHER_URL) config.weatherUrl = env.WEATHER_URL;
  if (env.EVENTS_URL) config.eventsUrl = env.EVENTS_URL;
  if (env.PERSONAL_PHOTOS_URL) config.personalPhotosUrl = env.PERSONAL_PHOTOS_URL;
  if (env.COMPANY_PHOTOS_URL) config.companyPhotosUrl = env.COMPANY_PHOTOS_URL;
  if (env.STOCK_URL) config.stockUrl = env.STOCK_URL;
  if (env.NEWS_URL) config.newsUrl = env.NEWS_URL;

  return config;
}
