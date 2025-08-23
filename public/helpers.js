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
        return roomName.trim();
    }
    return location;
}

function getStatusFromEvent(event) {
    if (event.summary.toLowerCase().includes('lunch')) return 'Out at Lunch';
    if (event.summary.toLowerCase().includes('focus time')) return 'Focus Time';
    if (event.conferenceData) return 'In a Zoom Meeting';
    return 'In a Meeting';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatTimeRange, formatLocationName, getStatusFromEvent };
}
if (typeof window !== 'undefined') {
    window.formatTimeRange = formatTimeRange;
    window.formatLocationName = formatLocationName;
    window.getStatusFromEvent = getStatusFromEvent;
}
