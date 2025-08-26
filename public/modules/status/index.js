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
            // Placeholder images - will be replaced with config system later
            const placeholderImages = {
                'Too Many Meetings (warning)': 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Too+Many+Meetings',
                'What a chill day today': 'https://via.placeholder.com/400x300/51cf66/ffffff?text=Chill+Day',
                'Booting Up… Breakfast First': 'https://via.placeholder.com/400x300/ffd43b/ffffff?text=Early+Morning',
                'Working Out (Mentally and Physically)': 'https://via.placeholder.com/400x300/ffd43b/ffffff?text=Early+Morning',
                'System Not Ready': 'https://via.placeholder.com/400x300/ffd43b/ffffff?text=Early+Morning',
                'Starting the Day Strong': 'https://via.placeholder.com/400x300/74c0fc/ffffff?text=Start+of+Day',
                'Thoughts Loading… Please Wait': 'https://via.placeholder.com/400x300/74c0fc/ffffff?text=Start+of+Day',
                'Warming Up Slack Fingers': 'https://via.placeholder.com/400x300/74c0fc/ffffff?text=Start+of+Day',
                'Workday Shutdown in Progress': 'https://via.placeholder.com/400x300/ffa8a8/ffffff?text=End+of+Day',
                'Office Evacuation in Progress': 'https://via.placeholder.com/400x300/ffa8a8/ffffff?text=End+of+Day',
                'Logging Out IRL': 'https://via.placeholder.com/400x300/ffc078/ffffff?text=After+Work',
                'Goodbye Desk, Hello Couch': 'https://via.placeholder.com/400x300/ffc078/ffffff?text=After+Work',
                'Out for the Day — Try Again Tomorrow': 'https://via.placeholder.com/400x300/ffc078/ffffff?text=After+Work',
                'Do Not Disturb — Life in Progress': 'https://via.placeholder.com/400x300/be4bdb/ffffff?text=Evening',
                'Battery Depleted — Recharging': 'https://via.placeholder.com/400x300/be4bdb/ffffff?text=Evening',
                'Available': 'https://via.placeholder.com/400x300/868e96/ffffff?text=Available'
            };
            return placeholderImages[statusText] || 'https://via.placeholder.com/400x300/868e96/ffffff?text=Default';
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

            // Rotate through the status list every 5 seconds
            const index = Math.floor((Date.now() / 5000) % statusList.length);
            return statusList[index];
        },

        startFallbackRotation() {
            // Clear any existing rotation interval
            if (this.fallbackRotationInterval) {
                clearInterval(this.fallbackRotationInterval);
            }

            // Start rotating fallback statuses every 5 seconds
            this.fallbackRotationInterval = setInterval(() => {
                if (!this.easterEggActive) {
                    const fallbackStatus = this.getCurrentFallbackStatus();
                    this.setStatus(fallbackStatus);
                }
            }, 5000);

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
        } else if (meetingCount <= 3) {
            // Chill day easter egg
            statusManager.stopFallbackRotation();
            statusManager.setStatus(statusManager.easterEggStatuses.chillDay, true);
            statusManager.lastEasterEggTime = now.getTime();
        }
    }

    // If no easter egg is active, ensure fallback rotation is running
    if (!statusManager.easterEggActive && !statusManager.fallbackRotationInterval) {
        statusManager.startFallbackRotation();
    }
}
