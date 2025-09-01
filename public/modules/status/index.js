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
            // Use placeholder image for now - will be replaced with config later
            const imageUrl = this.getPlaceholderImage(statusText);
            elements.statusImage.src = imageUrl;
        },

        getPlaceholderImage(statusText) {
            // Use GitHub images from the organized folders
            const baseUrl = 'https://github.com/russellochoa/productivity-dashboard/raw/main/public/images';
            
            // Map each status to its specific image file
            const statusImages = {
                // Primary Calendar Event Statuses
                'In a Meeting': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png',
                'In a Zoom Meeting': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific zoom image later
                'Focus Time': 'Gemini_Generated_Image_psvgl5psvgl5psvg.png',
                'Out at Lunch': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific lunch image later
                'Out of Office': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific OOO image later
                'Out Sick': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific sick image later
                'Overloaded Human': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific overloaded image later
                
                // Easter Egg Statuses
                'Too Many Meetings (warning)': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific warning image later
                'What a chill day today': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific chill image later
                
                // Time-Based Fallback Statuses
                'Booting Up… Breakfast First': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific early morning image later
                'Working Out (Mentally and Physically)': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific workout image later
                'System Not Ready': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific system image later
                'Starting the Day Strong': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific start day image later
                'Thoughts Loading… Please Wait': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific loading image later
                'Warming Up Slack Fingers': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific slack image later
                'Workday Shutdown in Progress': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific shutdown image later
                'Office Evacuation in Progress': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific evacuation image later
                'Logging Out IRL': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific logout image later
                'Goodbye Desk, Hello Couch': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific goodbye image later
                'Out for the Day — Try Again Tomorrow': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific out for day image later
                'Do Not Disturb — Life in Progress': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific evening image later
                'Battery Depleted — Recharging': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png', // You can add a specific battery image later
                'Available': 'ChatGPT Image Aug 4, 2025, 02_36_39 AM.png' // You can add a specific available image later
            };
            
            const imageFile = statusImages[statusText];
            if (imageFile) {
                const encodedFolder = encodeURIComponent(statusText);
                const encodedFile = encodeURIComponent(imageFile);
                return `${baseUrl}/${encodedFolder}/${encodedFile}`;
            }
            
            // Fallback to placeholder if no image found
            return 'https://via.placeholder.com/400x300/868e96/ffffff?text=Default';
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
