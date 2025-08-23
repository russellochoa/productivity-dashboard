(function(global) {
  function parseTimeToDate(timeStr, referenceDate) {
    if (!timeStr) return null;
    const match = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2] || '0', 10);
    const period = match[3] ? match[3].toLowerCase() : null;
    if (period) {
      if (period === 'pm' && hours !== 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;
    }
    const date = new Date(referenceDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  function isAllDay(event) {
    return event.startTime === '12:00 am' && event.endTime === '12:00 am';
  }

  function getCurrentEvent(now, calendar) {
    if (!Array.isArray(calendar)) return null;
    for (const event of calendar) {
      if (isAllDay(event)) {
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        if (now >= startOfDay && now < endOfDay) {
          return event;
        }
      } else {
        const start = parseTimeToDate(event.startTime, now);
        const end = parseTimeToDate(event.endTime, now);
        if (start && end && start <= now && now < end) {
          return event;
        }
      }
    }
    return null;
  }

  function getStatusFromEvent(event) {
    if (!event || !event.summary) return 'In a Meeting';
    const summary = event.summary.toLowerCase();
    if (summary.includes('lunch')) return 'Out at Lunch';
    if (summary.includes('focus time')) return 'Focus Time';
    if (event.conferenceData) return 'In a Zoom Meeting';
    return 'In a Meeting';
  }

  function getFallbackStatus(hour, config) {
    const statuses = config.statusConfig.fallback_statuses;
    let statusList;
    if (hour >= 6 && hour < 8) statusList = statuses.early_morning;
    else if (hour >= 8 && hour < 9) statusList = statuses.start_of_day;
    else if (hour >= 16 && hour < 16.5) statusList = statuses.end_of_day;
    else if (hour >= 16.5 && hour < 18) statusList = statuses.after_work;
    else if (hour >= 18) statusList = statuses.evening;
    else return 'Available';
    const index = Math.floor((Date.now() / 10000) % statusList.length);
    return statusList[index];
  }

  function evaluate(now, calendar, config, setStatus) {
    const currentEvent = getCurrentEvent(now, calendar);
    if (currentEvent) {
      setStatus(getStatusFromEvent(currentEvent));
      return;
    }
    setStatus(getFallbackStatus(now.getHours(), config));
  }

  const exportsObj = { getCurrentEvent, getStatusFromEvent, getFallbackStatus, evaluate };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  } else {
    global.statusUtils = exportsObj;
  }
})(this);
