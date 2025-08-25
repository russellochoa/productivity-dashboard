export async function updateWeather(config, elements) {
    try {
        const response = await fetch(config.weatherUrl);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data && data.current && data.location) {
            const forecastDay = data.forecast?.forecastday?.[0]?.day || {};
            elements.weatherLocation.textContent = data.location.name || 'Unknown';
            elements.weatherTemp.textContent = `${Math.round(data.current.temp_f)}°`;
            elements.weatherHighLow.textContent = `H:${Math.round(forecastDay.maxtemp_f || data.current.temp_f)}° L:${Math.round(forecastDay.mintemp_f || data.current.temp_f)}°`;
            elements.uvIndex.textContent = data.current.uv ?? '--';
            elements.aqiValue.textContent = data.current.air_quality?.['us-epa-index'] ?? '--';
            elements.humidityValue.textContent = `${data.current.humidity}%`;
            elements.weatherIcon.innerHTML = getWeatherIcon(data.current.condition.text);
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
    }
}

function getWeatherIcon(condition) {
    const iconSize = '2.5em';
    const commonProps = `width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
    switch (condition.toLowerCase()) {
        case 'sunny':
        case 'clear':
            return `<svg ${commonProps}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        default:
            return `<svg ${commonProps}><path d="M20 16.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><path d="M16 16v6"></path><path d="M8 16v6"></path><path d="M12 16v6"></path></svg>`;
    }
}
