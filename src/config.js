export async function loadConfig() {
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  if (
    env.QUOTE_URL ||
    env.WEATHER_URL ||
    env.EVENTS_URL ||
    env.PERSONAL_PHOTOS_URL ||
    env.COMPANY_PHOTOS_URL ||
    env.STOCK_URL ||
    env.NEWS_URL
  ) {
    return {
      quoteUrl: env.QUOTE_URL,
      weatherUrl: env.WEATHER_URL,
      eventsUrl: env.EVENTS_URL,
      personalPhotosUrl: env.PERSONAL_PHOTOS_URL,
      companyPhotosUrl: env.COMPANY_PHOTOS_URL,
      stockUrl: env.STOCK_URL,
      newsUrl: env.NEWS_URL
    };
  }

  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      return await response.json();
    }
    console.warn('Config file not found or invalid');
  } catch (err) {
    console.error('Failed to load config.json', err);
  }

  return {};
}
