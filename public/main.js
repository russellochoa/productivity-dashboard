import { loadConfig } from '../src/config.js';
import { createStatusManager, updateMasterStatus } from './modules/status/index.js';
import { updateWeather } from './modules/weather/index.js';
import { updateEvents } from './modules/events/index.js';
import { createSlideshow } from './modules/slideshow/index.js';

let lastQuote = null;
let lastQuoteTime = 0;

document.addEventListener('DOMContentLoaded', async function() {
    const apiConfig = await loadConfig();

    const config = {
        dashboardTitle: "Russell's Desk",
        profileImageUrl: "https://www.dropbox.com/scl/fi/7fsfrr4yixqmmh0i0p67p/C2E599B7-FF0F-4740-8EB0-BD57C60723AB.jpg?rlkey=pawp5kwzu81n1hrqzxxric8lm&st=b2yrbs29&raw=1",
        dataRefreshInterval: 15 * 60 * 1000,
        infoModuleMode: 'rotate',
        activeInfoModule: 'quote',
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

    function fitText(el, maxVH, minVH, container = el.parentElement) {
        if (!el) return;
        const maxVHCap = (20 / window.innerHeight) * 100;
        maxVH = Math.min(maxVH, maxVHCap);
        minVH = Math.min(minVH, maxVH);
        let size = maxVH;
        el.style.fontSize = `${size}vh`;
        el.style.wordBreak = 'break-word';
        while (size > minVH && container.scrollHeight > container.clientHeight) {
            size -= 0.1;
            el.style.fontSize = `${size}vh`;
        }
        if (container.scrollHeight > container.clientHeight) {
            let text = el.textContent;
            while (text.length > 0 && container.scrollHeight > container.clientHeight) {
                text = text.trim().slice(0, -1);
                el.textContent = text + '…';
            }
        }
    }

    function renderQuote() {
        elements.quoteText.textContent = lastQuote?.text || "--";
        elements.quoteAuthor.textContent = lastQuote?.author ? `- ${lastQuote.author}` : "";
        fitText(elements.quoteText, Math.min(2.5, (20 / window.innerHeight) * 100), 1.2, elements.quoteModule);
    }

    async function updateQuote() {
        try {
            if (Date.now() - lastQuoteTime < 30 * 60 * 1000 && lastQuote) {
                renderQuote();
                return;
            }
            const { text, author } = await fetch(config.quoteUrl).then(r => r.json());
            lastQuote = { text, author };
            lastQuoteTime = Date.now();
            renderQuote();
        } catch (error) {
            console.error('Error updating quote:', error);
            lastQuote = { text: "--", author: "" };
            renderQuote();
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
                  elements.stockChange.textContent = '';
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
              elements.stockChange.textContent = '';
              elements.stockChange.className = 'text-[1.8vh] stock-change';
          }
      }

    async function fetchNews(mode) {
        try {
            const response = await fetch(`${config.newsUrl}?mode=${mode}`);
            const data = await response.json();
            newsArticles = Array.isArray(data) ? data : (data?.articles || []);
            newsArticles = newsArticles.slice(0, 5);
            if (newsIndex >= newsArticles.length) {
                newsIndex = 0;
            }
            rotateNews();
        } catch (error) {
            console.error('Fetch error:', error);
            newsArticles = [];
            elements.newsHeadline.textContent = 'News unavailable';
            fitText(elements.newsHeadline, Math.min(2.5, (20 / window.innerHeight) * 100), 1.2, elements.newsModule);
            fitText(elements.newsMode, 2, 1.2, elements.newsModule);
        }
    }

    function rotateNews() {
        try {
            if (newsArticles.length === 0) {
                elements.newsHeadline.textContent = 'News unavailable';
                fitText(elements.newsHeadline, Math.min(2.5, (20 / window.innerHeight) * 100), 1.2, elements.newsModule);
                fitText(elements.newsMode, 2, 1.2, elements.newsModule);
                return;
            }
            elements.newsHeadline.textContent = newsArticles[newsIndex]?.title || 'News unavailable';
            fitText(elements.newsHeadline, Math.min(2.5, (20 / window.innerHeight) * 100), 1.2, elements.newsModule);
            fitText(elements.newsMode, 2, 1.2, elements.newsModule);
            newsIndex = (newsIndex + 1) % newsArticles.length;
        } catch (error) {
            elements.newsHeadline.textContent = 'News unavailable';
            fitText(elements.newsHeadline, Math.min(2.5, (20 / window.innerHeight) * 100), 1.2, elements.newsModule);
            fitText(elements.newsMode, 2, 1.2, elements.newsModule);
            console.error(error);
            return;
        }
    }

    elements.newsMode.addEventListener('change', (e) => {
        currentMode = e.target.value;
        newsIndex = 0;
        fetchNews(currentMode);
    });
    elements.newsMode.addEventListener('click', e => e.stopPropagation());
    elements.newsMode.addEventListener('touchstart', e => e.stopPropagation());

    function applyInitialConfig() {
        elements.dashboardTitle.textContent = config.dashboardTitle;
        elements.profileImage.src = config.profileImageUrl;
    }

    async function updateInfoModule() {
        elements.quoteModule.classList.remove('active');
        elements.stockModule.classList.remove('active');
        elements.newsModule.classList.remove('active');

        if (config.activeInfoModule === 'quote') {
            elements.quoteModule.classList.add('active');
            renderQuote();
        } else if (config.activeInfoModule === 'stock') {
            elements.stockModule.classList.add('active');
            await updateStock();
        } else if (config.activeInfoModule === 'news') {
            elements.newsModule.classList.add('active');
            rotateNews();
        }
    }

    function cycleInfoModule() {
        const modules = ['quote', 'stock', 'news'];
        const currentIndex = modules.indexOf(config.activeInfoModule);
        config.activeInfoModule = modules[(currentIndex + 1) % modules.length];
        updateInfoModule();
    }

    [elements.quoteModule, elements.stockModule, elements.newsModule].forEach(module => {
        if (module) {
            module.addEventListener('click', cycleInfoModule);
            module.addEventListener('touchstart', cycleInfoModule);
        }
    });

    async function fetchAllData() {
        const [calendar] = await Promise.all([
            updateEvents(config, elements, fetchWithMock, activeIntervals),
            updateWeather(config, elements, fetchWithMock),
            updateInfoModule()
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
        // Rotate through news headlines every 30 seconds
        activeIntervals.push(setInterval(rotateNews, 30 * 1000));
        activeIntervals.push(setInterval(() => fetchNews(currentMode), 5 * 60 * 1000));

        await createSlideshow(elements.personalAlbumContainer, config.personalAlbum, config.personalPhotosUrl, fetchWithMock, activeIntervals);
        await createSlideshow(elements.companyAlbumContainer, config.companyAlbum, config.companyPhotosUrl, fetchWithMock, activeIntervals);

        activeIntervals.push(setInterval(updateClock, 1000));
        activeIntervals.push(setInterval(fetchAllData, config.dataRefreshInterval));
        activeIntervals.push(setInterval(() => updateMasterStatus(statusManager, currentCalendar), 5000));

        if (config.infoModuleMode === 'rotate') {
            activeIntervals.push(setInterval(cycleInfoModule, 60000));
        }
    }

    initializeApp();
});
