export function createStatusManager(config, elements) {
    return {
        primaryStatus: 'Available',
        easterEggActive: false,
        lastEasterEggTime: 0,
        currentFallbackIndex: 0,
        fallbackRotationInterval: null,

        // Easter egg statuses
        easterEggStatuses: {
            tooManyMeetings: 'Too Many Meetings (warning)',
            chillDay: 'What a chill day today'
        },

        // Time-based fallback statuses with rotation
        fallbackStatuses: {
            early_morning: [
                'Booting Up… Breakfast First',
                'Working Out (Mentally and Physically)',
                'System Not Ready'
            ],
            start_of_day: [
                'Starting the Day Strong',
                'Thoughts Loading… Please Wait',
                'Warming Up Slack Fingers'
            ],
            end_of_day: [
                'Workday Shutdown in Progress',
                'Office Evacuation in Progress'
            ],
            after_work: [
                'Logging Out IRL',
                'Goodbye Desk, Hello Couch',
                'Out for the Day — Try Again Tomorrow'
            ],
            evening: [
                'Do Not Disturb — Life in Progress',
                'Battery Depleted — Recharging'
            ]
        },

        setStatus(newStatus, isEasterEgg = false) {
            if (isEasterEgg) {
                this.easterEggActive = true;
                this.renderStatus(newStatus);
                // Easter egg shows for exactly 10 seconds, then returns to fallback
                setTimeout(() => {
                    this.easterEggActive = false;
                    this.startFallbackRotation();
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
            
            // Check if text is too long and add sliding animation
            this.checkAndAddSlidingAnimation();
            
            // Use GitHub images from organized folders
            this.loadStatusImage(statusText);
        },

        checkAndAddSlidingAnimation() {
            // Remove any existing sliding class
            elements.statusTitle.classList.remove('sliding');
            
            // Check if text overflows the container
            const titleElement = elements.statusTitle;
            const containerWidth = titleElement.parentElement.offsetWidth;
            const textWidth = titleElement.scrollWidth;
            
            // If text is wider than container, add sliding animation
            if (textWidth > containerWidth) {
                titleElement.classList.add('sliding');
            }
        },

        loadStatusImage(statusText) {
            const extensions = ['png', 'jpg', 'jpeg'];
            let currentIndex = 0;
            
            const tryNextExtension = () => {
                if (currentIndex < extensions.length) {
                    const imageUrl = this.getPlaceholderImage(statusText, extensions[currentIndex]);
                    elements.statusImage.src = imageUrl;
                    currentIndex++;
                }
            };
            
            // Set up error handler to try next extension BEFORE first attempt
            elements.statusImage.onerror = tryNextExtension;
            
            // Try .png first (index 0)
            tryNextExtension();
        },

        getPlaceholderImage(statusText, extension = 'png') {
            // Use GitHub images from the organized folders
            const baseUrl = 'https://github.com/russellochoa/productivity-dashboard/raw/main/public/images';
            
            // Map status text to actual folder names
            const statusToFolderMap = {
                // Primary Calendar Event Statuses
                'In a Meeting': 'In a Meeting',
                'In a Zoom Meeting': 'In a Zoom Meeting',
                'Focus Time': 'Focus Time',
                'Out at Lunch': 'Out at Lunch',
                'Out of Office': 'Out of Office',
                'Out Sick': 'Out Sick',
                'Overloaded Human': 'Overloaded Human',
                
                // Easter Egg Statuses
                'Too Many Meetings (warning)': 'Too Many Meetings (warning)',
                'What a chill day today': 'What a chill day today',
                
                // Time-Based Fallback Statuses
                'Booting Up… Breakfast First': 'Booting Up Breakfast First',
                'Working Out (Mentally and Physically)': 'Working Out (Mentally and Physically)',
                'System Not Ready': 'System Not Ready',
                'Starting the Day Strong': 'Starting the Day Strong',
                'Thoughts Loading… Please Wait': 'Thoughts Loading Please Wait',
                'Warming Up Slack Fingers': 'Warming Up Slack Fingers',
                'Workday Shutdown in Progress': 'Workday Shutdown in Progress',
                'Office Evacuation in Progress': 'Office Evacuation in Progress',
                'Logging Out IRL': 'Logging Out IRL',
                'Goodbye Desk, Hello Couch': 'Goodbye Desk, Hello Couch',
                'Out for the Day — Try Again Tomorrow': 'Out for the Day  Try Again Tomorrow',
                'Do Not Disturb — Life in Progress': 'Do Not Disturb  Life in Progress',
                'Battery Depleted — Recharging': 'Battery Depleted  Recharging',
                'Available': 'Available'
            };
            
            const folderName = statusToFolderMap[statusText] || statusText;
            const encodedFolder = encodeURIComponent(folderName);
            
            // Try the specified extension (.png or .jpg)
            return `${baseUrl}/${encodedFolder}/image.${extension}`;
        },

        getCurrentFallbackStatus() {
            const now = new Date();
            const hour = now.getHours();
            let statusList;
            let category;

            if (hour >= 6 && hour < 8) {
                statusList = this.fallbackStatuses.early_morning;
                category = 'early_morning';
            } else if (hour >= 8 && hour < 9) {
                statusList = this.fallbackStatuses.start_of_day;
                category = 'start_of_day';
            } else if (hour >= 16 && hour < 16.5) {
                statusList = this.fallbackStatuses.end_of_day;
                category = 'end_of_day';
            } else if (hour >= 16.5 && hour < 18) {
                statusList = this.fallbackStatuses.after_work;
                category = 'after_work';
            } else if (hour >= 18) {
                statusList = this.fallbackStatuses.evening;
                category = 'evening';
            } else {
                return 'Available';
            }

            // Rotate through the status list every 10 seconds
            const index = Math.floor((Date.now() / 10000) % statusList.length);
            return statusList[index];
        },

        startFallbackRotation() {
            // Clear any existing rotation interval
            if (this.fallbackRotationInterval) {
                clearInterval(this.fallbackRotationInterval);
            }

            // Start rotating fallback statuses every 10 seconds
            this.fallbackRotationInterval = setInterval(() => {
                if (!this.easterEggActive) {
                    const fallbackStatus = this.getCurrentFallbackStatus();
                    this.setStatus(fallbackStatus);
                }
            }, 10000);

            // Show initial fallback status immediately
            if (!this.easterEggActive) {
                const fallbackStatus = this.getCurrentFallbackStatus();
                this.setStatus(fallbackStatus);
            }
        },

        stopFallbackRotation() {
            if (this.fallbackRotationInterval) {
                clearInterval(this.fallbackRotationInterval);
                this.fallbackRotationInterval = null;
            }
        },

        // Initialize the status manager
        init() {
            // Start with fallback status rotation
            this.startFallbackRotation();
        },

        // Cleanup when status manager is destroyed
        destroy() {
            this.stopFallbackRotation();
        }
    };
}

export function updateMasterStatus(statusManager, currentCalendar) {
    const now = new Date();
    const timeSinceLastEgg = now.getTime() - statusManager.lastEasterEggTime;

    // Check for easter eggs every 20 minutes (1200000 ms)
    if (timeSinceLastEgg > 20 * 60 * 1000) {
        // Calculate meeting count and free time for the day
        const dayStart = new Date(now);
        dayStart.setHours(9, 0, 0, 0); // 9 AM
        
        const dayEnd = new Date(now);
        dayEnd.setHours(17, 0, 0, 0); // 5 PM

        // Filter events between 9 AM and 5 PM
        const workdayEvents = currentCalendar.filter(event => {
            const eventStart = new Date(event.start.dateTime || event.start.date);
            const eventEnd = new Date(event.end.dateTime || event.end.date);
            return eventStart < dayEnd && eventEnd > dayStart;
        });

        const meetingCount = workdayEvents.length;

        // Calculate free time between 9 AM and 5 PM
        let totalFreeTime = 0;
        let currentTime = new Date(dayStart);

        while (currentTime < dayEnd) {
            const hasMeeting = workdayEvents.some(event => {
                const eventStart = new Date(event.start.dateTime || event.start.date);
                const eventEnd = new Date(event.end.dateTime || event.end.date);
                return currentTime >= eventStart && currentTime < eventEnd;
            });

            if (!hasMeeting) {
                totalFreeTime += 1; // Add 1 hour
            }

            currentTime.setHours(currentTime.getHours() + 1);
        }

        // Check easter egg conditions
        if (meetingCount > 6 && totalFreeTime <= 1) {
            // Too Many Meetings easter egg
            statusManager.stopFallbackRotation();
            statusManager.setStatus(statusManager.easterEggStatuses.tooManyMeetings, true);
            statusManager.lastEasterEggTime = now.getTime();
            return; // Exit early, easter egg is active
        } else if (meetingCount <= 3) {
            // Chill day easter egg
            statusManager.stopFallbackRotation();
            statusManager.setStatus(statusManager.easterEggStatuses.chillDay, true);
            statusManager.lastEasterEggTime = now.getTime();
            return; // Exit early, easter egg is active
        }
    }

    // Check for current calendar events (Primary Status Logic)
    const currentEvent = getCurrentEvent(currentCalendar, now);
    if (currentEvent) {
        const primaryStatus = getStatusFromEvent(currentEvent, currentCalendar);
        if (primaryStatus) {
            statusManager.stopFallbackRotation();
            statusManager.setStatus(primaryStatus);
            return; // Exit early, primary status is active
        }
    }

    // If no easter egg or primary status is active, ensure fallback rotation is running
    if (!statusManager.easterEggActive && !statusManager.fallbackRotationInterval) {
        statusManager.startFallbackRotation();
    }
}

// Helper function to get current event
function getCurrentEvent(calendar, now) {
    return calendar.find(event => {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const eventEnd = new Date(event.end.dateTime || event.start.date);
        return now >= eventStart && now < eventEnd;
    });
}

// Helper function to determine status from event
function getStatusFromEvent(event, calendar) {
    const title = event.summary?.toLowerCase() || '';
    const eventType = event.eventType;
    const hasVideoLink = event.conferenceData?.conferenceId || 
                        event.hangoutLink || 
                        event.conferenceData?.entryPoints?.some(ep => ep.entryPointType === 'video');

    // Check for special event types first
    if (eventType === 'outOfOffice' || title.includes('ooo')) {
        return 'Out of Office';
    }

    // Check for specific title patterns
    if (title.includes('sick')) {
        return 'Out Sick';
    }
    if (title.includes('lunch')) {
        return 'Out at Lunch';
    }
    if (title.includes('focus time')) {
        return 'Focus Time';
    }

    // Check for video meetings and location logic
    if (hasVideoLink) {
        // Check if event has a physical location
        const hasLocation = event.location && event.location.trim() !== '';
        
        if (hasLocation) {
            // Has both zoom link AND location
            return 'In a Meeting';
        } else {
            // Has zoom link but NO location
            return 'In a Zoom Meeting';
        }
    }

    // Check for triple-booking (overloaded)
    const eventStart = new Date(event.start.dateTime || event.start.date);
    const eventEnd = new Date(event.end.dateTime || event.start.date);
    const overlappingEvents = calendar.filter(otherEvent => {
        if (otherEvent === event) return false;
        const otherStart = new Date(otherEvent.start.dateTime || otherEvent.start.date);
        const otherEnd = new Date(otherEvent.end.dateTime || otherEvent.start.date);
        return eventStart < otherEnd && eventEnd > otherStart;
    });

    if (overlappingEvents.length >= 2) { // Triple-booked or more
        return 'Overloaded Human';
    }

    // Default meeting status (no zoom link)
    return 'In a Meeting';
}
