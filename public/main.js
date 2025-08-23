document.addEventListener('DOMContentLoaded', function() {
    
    const config = {
        dashboardTitle: "Russell's Desk",
        profileImageUrl: "https://www.dropbox.com/scl/fi/7fsfrr4yixqmmh0i0p67p/C2E599B7-FF0F-4740-8EB0-BD57C60723AB.jpg?rlkey=pawp5kwzu81n1hrqzxxric8lm&st=b2yrbs29&raw=1",
        dataRefreshInterval: 15 * 60 * 1000,
        leftModuleMode: 'rotate', // Change to 'static' to disable rotation
        activeLeftModule: 'quote', // Used only if mode is 'static'
        quoteUrl: 'https://zenquotes.io/api/quotes/keyword=inspiration&maxLength=150',
        weatherUrl: 'https://api.weatherapi.com/v1/forecast.json?key=YOUR_WEATHERAPI_KEY&q=Lehi&days=1&aqi=yes',
        eventsUrl: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?key=YOUR_GOOGLE_CALENDAR_API_KEY',
        personalPhotosUrl: 'https://api.unsplash.com/photos/random?count=10&query=personal&client_id=YOUR_UNSPLASH_ACCESS_KEY',
        companyPhotosUrl: 'https://api.unsplash.com/photos/random?count=10&query=office&client_id=YOUR_UNSPLASH_ACCESS_KEY',
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

    // --- Core Functions ---
    function stopAllIntervals() {
        activeIntervals.forEach(clearInterval);
        activeIntervals = [];
    }

    async function fetchWithMock(url, mockData = null) {
        try {
            const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            return mockData;
        }
    }

    function updateClock() {
        const now = new Date();
        elements.time.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        elements.date.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    // --- Status Logic ---
    const statusManager = {
        primaryStatus: 'Available',
        easterEggActive: false,
        lastEasterEggTime: 0,
        
        setStatus(newStatus, isEasterEgg = false) {
            if (isEasterEgg) {
                this.easterEggActive = true;
                this.renderStatus(newStatus);
                setTimeout(() => {
                    this.easterEggActive = false;
                    this.renderStatus(this.primaryStatus);
                }, 10000); 
            } else {
                this.primaryStatus = newStatus;
                if (!this.easterEggActive) {
                    this.renderStatus(newStatus);
                }
            }
        },

        renderStatus(statusText) {
            elements.statusTitle.textContent = statusText;
            const imageUrl = config.statusConfig.images[statusText] || config.statusConfig.images['default'];
            elements.statusImage.src = imageUrl;
        },

        evaluate() {
            const now = new Date();
            const currentHour = now.getHours();
            const currentEvent = this.getCurrentEvent(now);
            if (currentEvent) {
                this.setStatus(this.getStatusFromEvent(currentEvent));
                return;
            }
            this.setStatus(this.getFallbackStatus(currentHour));
        },

        getCurrentEvent(now) {
            return statusUtils.getCurrentEvent(now, currentCalendar);
        },

        getStatusFromEvent(event) {
            return statusUtils.getStatusFromEvent(event);
        },

        getFallbackStatus(hour) {
            return statusUtils.getFallbackStatus(hour, config);
        },
    };

    function updateMasterStatus() {
        const now = new Date();
        const timeSinceLastEgg = now.getTime() - statusManager.lastEasterEggTime;
        
        if (timeSinceLastEgg > 20 * 60 * 1000) {
            const meetingCount = currentCalendar.length;
            if (meetingCount > 6) { 
                statusManager.setStatus('Too Many Meetings (warning)', true);
                statusManager.lastEasterEggTime = now.getTime();
            } else if (meetingCount <= 3) {
                statusManager.setStatus('What a chill day today', true);
                statusManager.lastEasterEggTime = now.getTime();
            }
        }
        
        if (!statusManager.easterEggActive) {
            statusManager.evaluate();
        }
    }

    // --- UI Update Functions ---
    async function updateWeather() {
        const data = await fetchWithMock(config.weatherUrl);
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
    }

    function getWeatherIcon(condition) {
        const iconSize = "2.5em";
        const commonProps = `width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
        switch(condition.toLowerCase()) {
            case 'sunny':
            case 'clear':
                return `<svg ${commonProps}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
            case 'cloudy':
            case 'partly cloudy':
                return `<svg ${commonProps}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
            case 'rain':
            case 'drizzle':
                return `<svg ${commonProps}><line x1="8" y1="19" x2="8" y2="21"></line><line x1="16" y1="19" x2="16" y2="21"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`;
            default:
                return `<svg ${commonProps}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
        }
    }

    async function updateQuote() {
        const mockData = [{ q: "The journey of a thousand miles begins with a single step.", a: "Lao Tzu" }];
        const data = await fetchWithMock(config.quoteUrl, mockData);
        if (data && data[0] && data[0].q) {
            elements.quoteText.textContent = `"${data[0].q}"`;
            elements.quoteAuthor.textContent = `- ${data[0].a || 'Unknown'}`;
        }
    }
    
    async function updateStock() {
        const mockData = { price: 543.21, change: 1.23, changePercent: 0.23 };
        elements.stockPrice.textContent = mockData.price.toFixed(2);
        const changeSign = mockData.change > 0 ? '+' : '';
        elements.stockChange.textContent = `${changeSign}${mockData.change.toFixed(2)} (${changeSign}${mockData.changePercent.toFixed(2)}%)`;
        elements.stockChange.className = `text-[1.8vh] stock-change ${mockData.change > 0 ? 'positive' : 'negative'}`;
    }
    
    function updateNews() {
        const mockHeadlines = ["Global Tech Summit Announces Breakthrough in AI.", "New Space Telescope Reveals Secrets of Distant Galaxies.", "Artists and Engineers Collaborate on Immersive Digital Art."];
        const headlineIndex = Math.floor((Date.now() / (30 * 60 * 1000)) % mockHeadlines.length);
        elements.newsHeadline.textContent = mockHeadlines[headlineIndex];
    }


    async function updateEvents() {
        const data = await fetchWithMock(config.eventsUrl);
        currentCalendar = (data?.items || []).map(event => ({
            startTime: formatToTime(event.start.dateTime || event.start.date),
            endTime: formatToTime(event.end.dateTime || event.end.date),
            summary: event.summary || '',
            location: event.location || ''
        }));
        elements.eventsList.innerHTML = '';
        
        if (currentCalendar && currentCalendar.length > 0) {
            const eventGroups = groupEventsByTime(currentCalendar); 
            eventGroups.slice(0, 3).forEach(group => {
                const li = document.createElement('li');
                if (group.length > 1) {
                    li.className = 'event-group';
                    group.forEach(event => li.innerHTML += createEventBubbleHTML(event));
                } else {
                    li.className = 'event-item';
                    li.innerHTML = createEventBubbleHTML(group[0]);
                }
                elements.eventsList.appendChild(li);
            });
            
            document.querySelectorAll('.event-group').forEach(animateEventGroup);
        } else {
            elements.eventsList.innerHTML = '<li class="text-slate-300 text-center p-4">No upcoming events.</li>';
        }
    }

    function formatToTime(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
    }

    function createEventBubbleHTML(event) {
        return `<div class="event-bubble">
                    <p class="font-medium text-white text-[1.5vh] truncate">${event.summary}</p>
                    <div class="flex items-center text-slate-300 gap-2 mt-0.5">
                        <span class="event-details font-light whitespace-nowrap text-[1.3vh]">${formatTimeRange(event.startTime, event.endTime)}</span>
                        <span class="text-slate-400 font-light">&middot;</span>
                        <span class="event-details font-light truncate text-[1.3vh]">${formatLocationName(event.location)}</span>
                    </div>
                </div>`;
    }

    function groupEventsByTime(events) {
        const groups = {};
        events.forEach(event => {
            const startTime = event.startTime;
            if (!groups[startTime]) groups[startTime] = [];
            groups[startTime].push(event);
        });
        return Object.values(groups);
    }
    
    function animateEventGroup(groupElement) {
        const bubbles = groupElement.querySelectorAll('.event-bubble');
        const numBubbles = bubbles.length;
        if (numBubbles <= 1) return;

        let currentIndex = 0;
        const expandedBasis = 80;
        const shrunkenBasis = (100 - expandedBasis) / (numBubbles - 1);

        const animationCycle = () => {
            bubbles.forEach((bubble, index) => {
                bubble.style.flexBasis = index === currentIndex ? `${expandedBasis}%` : `${shrunkenBasis}%`;
            });
            currentIndex = (currentIndex + 1) % numBubbles;
        };
        
        animationCycle();
        activeIntervals.push(setInterval(animationCycle, 5000));
    }
    
    async function createSlideshow(container, settings, photosUrl, mockData = null) {
        const data = await fetchWithMock(photosUrl, mockData);
        let imageList = data?.imageUrls;
        if (!imageList && Array.isArray(data)) {
            imageList = data.map(photo => photo.urls?.regular).filter(Boolean);
        }
        if (!imageList || !imageList.length) return;

        if (settings.order === 'random') imageList.sort(() => Math.random() - 0.5);
        
        container.innerHTML = '';
        const img1 = document.createElement('img');
        const img2 = document.createElement('img');
        container.appendChild(img1);
        container.appendChild(img2);

        let currentIndex = 0;
        let activeImageIndex = 0;
        const imageElements = [img1, img2];

        const showNextImage = () => {
            const currentImg = imageElements[activeImageIndex];
            const nextImg = imageElements[1 - activeImageIndex];
            
            nextImg.src = imageList[currentIndex];
            currentImg.style.opacity = '0';
            nextImg.style.opacity = '1';

            activeImageIndex = 1 - activeImageIndex;
            currentIndex = (currentIndex + 1) % imageList.length;
        };
        
        showNextImage();
        activeIntervals.push(setInterval(showNextImage, settings.rotateSpeed));
    }


    // --- Initialization ---
    async function initializeApp() {
        stopAllIntervals();
        
        applyInitialConfig();
        updateClock();
        
        await fetchAllData();
        
        createSlideshow(elements.personalAlbumContainer, config.personalAlbum, config.personalPhotosUrl);
        createSlideshow(elements.companyAlbumContainer, config.companyAlbum, config.companyPhotosUrl);
        
        activeIntervals.push(setInterval(updateClock, 1000));
        activeIntervals.push(setInterval(fetchAllData, config.dataRefreshInterval));
        activeIntervals.push(setInterval(updateMasterStatus, 5000));

        if(config.leftModuleMode === 'rotate') {
            let moduleIndex = 0;
            const modules = ['quote', 'stock', 'news'];
            activeIntervals.push(setInterval(() => {
                moduleIndex = (moduleIndex + 1) % modules.length;
                config.activeLeftModule = modules[moduleIndex];
                updateLeftModule();
            }, 60000)); // Rotate every 1 minute
        }
    }
    
    function applyInitialConfig() {
        elements.dashboardTitle.textContent = config.dashboardTitle;
        elements.profileImage.src = config.profileImageUrl;
    }

    function updateLeftModule() {
        elements.quoteModule.style.display = 'none';
        elements.stockModule.style.display = 'none';
        elements.newsModule.style.display = 'none';

        if (config.activeLeftModule === 'quote') {
            elements.quoteModule.style.display = 'flex';
            updateQuote();
        } else if (config.activeLeftModule === 'stock') {
            elements.stockModule.style.display = 'flex';
            updateStock();
        } else if (config.activeLeftModule === 'news') {
            elements.newsModule.style.display = 'flex';
            updateNews();
        }
    }

    async function fetchAllData() {
        await Promise.all([
            updateEvents(),
            updateWeather(),
            updateLeftModule()
        ]);
    }
    
    function formatTimeRange(start, end) {
        if (!start || !end) return "";
        const simplifyTime = (timeStr) => timeStr.replace(':00', '').toLowerCase();
        let simpleStart = simplifyTime(start);
        let simpleEnd = simplifyTime(end);
        const startMeridian = simpleStart.includes('am') ? 'am' : 'pm';
        const endMeridian = simpleEnd.includes('am') ? 'am' : 'pm';
        if (startMeridian === endMeridian) {
            simpleStart = simpleStart.replace(startMeridian, '').trim();
        }
        return `${simpleStart} - ${simpleEnd}`;
    }

    function formatLocationName(location) {
        if (!location) return "";
        const parts = location.split('-');
        if (parts.length >= 3) {
            let roomName = parts[2];
            const parenIndex = roomName.indexOf('(');
            if (parenIndex !== -1) {
                roomName = roomName.substring(0, parenIndex).trim();
            }
            return roomName;
        }
        return location;
    }

    initializeApp();
});
