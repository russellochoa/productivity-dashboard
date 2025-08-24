export function createStatusManager(config, elements) {
    return {
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

        evaluate(currentCalendar) {
            const now = new Date();
            const currentEvent = this.getCurrentEvent(now, currentCalendar);
            const status = currentEvent
                ? this.getStatusFromEvent(currentEvent)
                : this.getFallbackStatus(now.getHours());
            this.setStatus(status);
        },

        getCurrentEvent(now, currentCalendar) {
            for (const event of currentCalendar) {
                if (event.start && event.end && now >= event.start && now <= event.end) {
                    return event;
                }
            }
            return null;
        },

        getStatusFromEvent(event) {
            if (event.summary.toLowerCase().includes('lunch')) return 'Out at Lunch';
            if (event.summary.toLowerCase().includes('focus time')) return 'Focus Time';
            if (event.conferenceData) return 'In a Zoom Meeting';
            return 'In a Meeting';
        },

        getFallbackStatus(hour) {
            let statusList;
            if (hour >= 6 && hour < 8) statusList = config.statusConfig.fallback_statuses.early_morning;
            else if (hour >= 8 && hour < 9) statusList = config.statusConfig.fallback_statuses.start_of_day;
            else if (hour >= 16 && hour < 16.5) statusList = config.statusConfig.fallback_statuses.end_of_day;
            else if (hour >= 16.5 && hour < 18) statusList = config.statusConfig.fallback_statuses.after_work;
            else if (hour >= 18) statusList = config.statusConfig.fallback_statuses.evening;
            else return 'Available';

            const index = Math.floor((Date.now() / 10000) % statusList.length);
            return statusList[index];
        },
    };
}

export function updateMasterStatus(statusManager, currentCalendar) {
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
        statusManager.evaluate(currentCalendar);
    }
}
