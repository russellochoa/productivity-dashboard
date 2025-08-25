import { loadConfig } from '../src/config.js';
import { createStatusManager, updateMasterStatus } from './modules/status/index.js';
import { updateWeather } from './modules/weather/index.js';
import { updateEvents } from './modules/events/index.js';
import { createSlideshow } from './modules/slideshow/index.js';

document.addEventListener('DOMContentLoaded', async function() {
    const apiConfig = await loadConfig();

    const config = {
        dashboardTitle: "Russell's Desk",
        profileImageUrl: "https://www.dropbox.com/scl/fi/7fsfrr4yixqmmh0i0p67p/C2E599B7-FF0F-4740-8EB0-BD57C60723AB.jpg?rlkey=pawp5kwzu81n1hrqzxxric8lm&st=b2yrbs29&raw=1",
        dataRefreshInterval: 15 * 60 * 1000,
        leftModuleMode: 'rotate',
        activeLeftModule: 'quote',
        quoteUrl: apiConfig.quoteUrl,
        weatherUrl: apiConfig.weatherUrl,
        eventsUrl: apiConfig.eventsUrl,
        personalPhotosUrl: apiConfig.personalPhotosUrl,
        companyPhotosUrl: apiConfig.companyPhotosUrl,
        stockUrl: apiConfig.stockUrl,
        newsUrl: apiConfig.newsUrl,
        personalAlbum: { rotateSpeed: 5000, order: 'random', transition: 'fade', transitionSpeed: 1.5 },
        companyAlbum: { rotateSpeed: 10000, order: 'sequential', transition: 'fade', transitionSpeed: 1.5 },
        statusConfig: {
            images: {
                'In a Meeting': 'https://images.unsplash.com/photo-1554224312-3b5013403484?q=80&w=2070&auto=format=fit',
                'In a Zoom Meeting': 'https://images.unsplash.com/photo-1554224312-3b5013403484?q=80&w=2070&auto=format=fit',
                'Focus Time': 'https://cdn.pixabay.com/animation/2024/05/16/21/45/21-45-34-3_512.gif',
                'Out at Lunch': 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1887&auto=format=fit',
                'Out of Office': 'https://images.unsplash.com/photo-1508985249468-5352e5ebd89a?q=80&w=2070&auto=format=fit',
                'Out Sick': 'https://images.unsplash.com/photo-1555883523-c3942355656c?q=80&w=1887&auto=format=fit',
                'Overloaded Human': 'https://images.unsplash.com/photo-1531393326464-18593243a069?q=80&w=1887&auto=format=fit',
                'Available': 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format=fit=crop',
                'default': 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format=fit=crop'
            },
            fallback_statuses: {
                early_morning: ["Booting Up… Breakfast First", "Working Out (Mentally and Physically)", "System Not Ready"],
                start_of_day: ["Starting the Day Strong", "Thoughts Loading… Please Wait", "Warming Up Slack Fingers"],
                end_of_day: ["Workday Shutdown in Progress", "Office Evacuation in Progress"],
                after_work: ["Logging Out IRL", "Goodbye Desk, Hello Couch", "Out for the Day - Try Again Tomorrow"],
                evening: ["Do Not Disturb - Life in Progress", "Battery Depleted - Recharging"]
            }
        }
    };

    const elements = {
        body: document.body,
        dashboardTitle: document.getElementById('dashboard-title'),
        profileImage: document.getElementById('profile-image'),
        time: document.getElementById('time'),
        date: document.getElementById('date'),
        quoteModule: document.getElementById('quote-module'),
        quoteText: document.getElementById('quote-text'),
        quoteAuthor: document.getElementById('quote-author'),
        stockModule: document.getElementById('stock-module'),
        stockPrice: document.getElementById('stock-price'),
        stockChange: document.getElementById('stock-change'),
        newsModule: document.getElementById('news-module'),
        newsHeadline: document.getElementById('news-headline'),
        newsMode: document.getElementById('news-mode'),
        weatherLocation: document.getElementById('weather-location'),
        weatherTemp: document.getElementById('weather-temp'),
        weatherHighLow: document.getElementById('weather-high-low'),
        weatherIcon: document.getElementById('weather-icon'),
        uvIndex: document.getElementById('uv-index'),
        aqiValue: document.getElementById('aqi-value'),
        humidityValue: document.getElementById('humidity-value'),
        statusTitle: document.getElementById('status-title'),
        statusImage: document.getElementById('status-image'),
        eventsList: document.getElementById('events-list'),
        personalAlbumContainer: document.getElementById('personal-album-container'),
        companyAlbumContainer: document.getElementById('company-album-container'),
    };

    let activeIntervals = [];
    let currentCalendar = [];
    let statusManager;
    let newsArticles = [];
    let newsIndex = 0;
    let currentMode = elements.newsMode ? elements.newsMode.value : 'headlines';
    function stopAllIntervals() {
        activeIntervals.forEach(clearInterval);
        activeIntervals = [];
    }

    async function fetchWithMock(url, mockData = null) {
        try {
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return mockData;
        }
    }

    function updateClock() {
        const now = new Date();
        elements.time.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        elements.date.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    async function updateQuote() {
        try {
            const { text, author } = await fetch(config.quoteUrl).then(r => r.json());
            elements.quoteText.textContent = text || "--";
            elements.quoteAuthor.textContent = author ? `- ${author}` : "";
        } catch (error) {
            console.error('Fetch error:', error);
            elements.quoteText.textContent = "--";
            elements.quoteAuthor.textContent = "";
        }
    }

      async function updateStock() {
          try {
              const { price, change, changePct } = await fetch(config.stockUrl).then(r => r.json());
              const parsedPrice = parseFloat(price);
              const parsedChange = parseFloat(change);
              const parsedChangePct = parseFloat(changePct);
              if (isNaN(parsedPrice) || isNaN(parsedChange) || isNaN(parsedChangePct)) {
                  elements.stockPrice.textContent = '--';
                  elements.stockChange.textContent = '--';
                  elements.stockChange.className = 'text-[1.8vh] stock-change';
                  return;
              }
              elements.stockPrice.textContent = parsedPrice.toFixed(2);
              const changeSign = parsedChange > 0 ? '+' : '';
              elements.stockChange.textContent = `${changeSign}${parsedChange.toFixed(2)} (${changeSign}${parsedChangePct.toFixed(2)}%)`;
              elements.stockChange.className = `text-[1.8vh] stock-change ${parsedChange > 0 ? 'positive' : 'negative'}`;
          } catch (error) {
              console.error('Fetch error:', error);
              elements.stockPrice.textContent = '--';
              elements.stockChange.textContent = '--';
              elements.stockChange.className = 'text-[1.8vh] stock-change';
          }
      }

    async function fetchNews(mode) {
        try {
            const response = await fetch(`${config.newsUrl}?mode=${mode}`);
            const data = await response.json();
            newsArticles = Array.isArray(data) ? data : (data?.articles || []);
            if (newsIndex >= newsArticles.length) {
                newsIndex = 0;
            }
            rotateNews();
        } catch (error) {
            console.error('Fetch error:', error);
            newsArticles = [];
            elements.newsHeadline.textContent = 'News unavailable';
        }
    }

    function rotateNews() {
        if (newsArticles.length === 0) {
            elements.newsHeadline.textContent = 'News unavailable';
            return;
        }
        elements.newsHeadline.textContent = newsArticles[newsIndex]?.title || 'News unavailable';
        newsIndex = (newsIndex + 1) % newsArticles.length;
    }

    elements.newsMode.addEventListener('change', (e) => {
        currentMode = e.target.value;
        newsIndex = 0;
        fetchNews(currentMode);
    });

    function applyInitialConfig() {
        elements.dashboardTitle.textContent = config.dashboardTitle;
        elements.profileImage.src = config.profileImageUrl;
    }

    async function updateLeftModule() {
        elements.quoteModule.classList.remove('active');
        elements.stockModule.classList.remove('active');
        elements.newsModule.classList.remove('active');

        if (config.activeLeftModule === 'quote') {
            elements.quoteModule.classList.add('active');
            await updateQuote();
        } else if (config.activeLeftModule === 'stock') {
            elements.stockModule.classList.add('active');
            await updateStock();
        } else if (config.activeLeftModule === 'news') {
            elements.newsModule.classList.add('active');
            rotateNews();
        }
    }

    function cycleLeftModule() {
        const modules = ['quote', 'stock', 'news'];
        const currentIndex = modules.indexOf(config.activeLeftModule);
        config.activeLeftModule = modules[(currentIndex + 1) % modules.length];
        updateLeftModule();
    }

    [elements.quoteModule, elements.stockModule, elements.newsModule].forEach(module => {
        if (module) {
            module.addEventListener('click', cycleLeftModule);
            module.addEventListener('touchstart', cycleLeftModule);
        }
    });

    async function fetchAllData() {
        const [calendar] = await Promise.all([
            updateEvents(config, elements, fetchWithMock, activeIntervals),
            updateWeather(config, elements, fetchWithMock),
            updateLeftModule()
        ]);
        currentCalendar = calendar;
        statusManager.evaluate(currentCalendar);
    }

    async function initializeApp() {
        stopAllIntervals();

        statusManager = createStatusManager(config, elements);
        applyInitialConfig();
        updateClock();

          await fetchAllData();
          await updateQuote();
          activeIntervals.push(setInterval(updateQuote, 30 * 60 * 1000));
          await updateStock();
          activeIntervals.push(setInterval(updateStock, 60 * 1000));

        await fetchNews(currentMode);
        activeIntervals.push(setInterval(rotateNews, 10 * 1000));
        activeIntervals.push(setInterval(() => fetchNews(currentMode), 5 * 60 * 1000));

        await createSlideshow(elements.personalAlbumContainer, config.personalAlbum, config.personalPhotosUrl, fetchWithMock, activeIntervals);
        await createSlideshow(elements.companyAlbumContainer, config.companyAlbum, config.companyPhotosUrl, fetchWithMock, activeIntervals);

        activeIntervals.push(setInterval(updateClock, 1000));
        activeIntervals.push(setInterval(fetchAllData, config.dataRefreshInterval));
        activeIntervals.push(setInterval(() => updateMasterStatus(statusManager, currentCalendar), 5000));

        if (config.leftModuleMode === 'rotate') {
            activeIntervals.push(setInterval(cycleLeftModule, 60000));
        }
    }

    initializeApp();
});
