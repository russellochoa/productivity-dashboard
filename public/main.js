import { loadConfig } from '../src/config.js';
import { createStatusManager, updateMasterStatus } from './modules/status/index.js';
import { updateWeather } from './modules/weather/index.js';
import { updateEvents } from './modules/events/index.js';
import { createSlideshow } from './modules/slideshow/index.js';
import { createAlbumManager } from './modules/albums/index.js';

let lastQuote = null;
let lastQuoteTime = 0;

document.addEventListener('DOMContentLoaded', async function() {
    const apiConfig = await loadConfig();

    const config = {
        dashboardTitle: "Russell's Desk",
        profileImageUrl: "https://www.dropbox.com/scl/fi/7fsfrr4yixqmmh0i0p67p/C2E599B7-FF0F-4740-8EB0-BD57C60723AB.jpg?rlkey=pawp5kwzu81n1hrqzxxric8lm&st=b2yrbs29&raw=1",
        dataRefreshInterval: 5 * 60 * 1000, // 5 minutes instead of 15
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
        // Status configuration removed - now handled by the status module itself
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
    let albumManager;
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
            updateWeather(config, elements),
            updateInfoModule()
        ]);
        currentCalendar = calendar;
        // Status manager now handles its own logic - no need to call evaluate
    }

    async function initializeApp() {
        stopAllIntervals();

        statusManager = createStatusManager(config, elements);
        statusManager.init(); // Initialize the status manager
        
        albumManager = createAlbumManager(config, elements);
        albumManager.init(); // Initialize the album manager
        
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
        
        // Update status immediately and then every 5 seconds
        try {
            updateMasterStatus(statusManager, currentCalendar);
        } catch (error) {
            console.error('Error calling updateMasterStatus:', error);
            // Fallback: call status manager directly
            if (statusManager && statusManager.startFallbackRotation) {
                statusManager.startFallbackRotation();
            }
        }
        activeIntervals.push(setInterval(() => {
            try {
                updateMasterStatus(statusManager, currentCalendar);
                // Update current event highlighting
                if (window.updateCurrentEventHighlighting) {
                    window.updateCurrentEventHighlighting();
                }
            } catch (error) {
                console.error('Error in status update interval:', error);
            }
        }, 5000));

        if (config.infoModuleMode === 'rotate') {
            activeIntervals.push(setInterval(cycleInfoModule, 60000));
        }
    }

    // Album Management Event Handlers
    function setupAlbumHandlers() {
        // Add personal image from URL
        const addPersonalBtn = document.getElementById('add-personal-image');
        const personalUrlInput = document.getElementById('personal-image-url');
        
        if (addPersonalBtn && personalUrlInput) {
            addPersonalBtn.addEventListener('click', () => {
                const url = personalUrlInput.value.trim();
                if (url && albumManager) {
                    albumManager.addPersonalImage(url);
                    personalUrlInput.value = '';
                }
            });
            
            personalUrlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addPersonalBtn.click();
                }
            });
        }

        // Add company image from URL
        const addCompanyBtn = document.getElementById('add-company-image');
        const companyUrlInput = document.getElementById('company-image-url');
        
        if (addCompanyBtn && companyUrlInput) {
            addCompanyBtn.addEventListener('click', () => {
                const url = companyUrlInput.value.trim();
                if (url && albumManager) {
                    albumManager.addCompanyImage(url);
                    companyUrlInput.value = '';
                }
            });
            
            companyUrlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addCompanyBtn.click();
                }
            });
        }

        // Mobile image upload
        const uploadBtn = document.getElementById('upload-mobile-images');
        const fileInput = document.getElementById('mobile-image-upload');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (albumManager) {
                            albumManager.addPersonalImage(event.target.result);
                        }
                    };
                    reader.readAsDataURL(file);
                });
                fileInput.value = ''; // Reset input
            });
        }
    }


    setupAlbumHandlers();
    initializeApp();
});
