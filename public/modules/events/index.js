export async function updateEvents(config, elements, fetchWithMock, activeIntervals) {
    if (!config?.eventsUrl) {
        elements.eventsList.innerHTML = '<li class="text-slate-300 text-center p-4">No events URL configured.</li>';
        return [];
    }

    try {
        // Call the events API directly instead of using the proxy
        const response = await fetch(config.eventsUrl);
        if (!response.ok) {
            throw new Error(`Events API request failed with status ${response.status}`);
        }
        const data = await response.json();
        
        const currentCalendar = (data?.items || []).map(event => {
            const start = new Date(event.start.dateTime || event.start.date);
            const end = new Date(event.end.dateTime || event.end.date);
            return {
                start,
                end,
                startTime: formatToTime(start),
                endTime: formatToTime(end),
                summary: event.summary || '',
                location: event.location || ''
            };
        });
        
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

            document.querySelectorAll('.event-group').forEach(group => animateEventGroup(group, activeIntervals));
        } else {
            elements.eventsList.innerHTML = '<li class="text-slate-300 text-center p-4">No upcoming events.</li>';
        }
        return currentCalendar;
    } catch (error) {
        console.error('Events fetch error:', error);
        elements.eventsList.innerHTML = '<li class="text-slate-300 text-center p-4">Error loading events.</li>';
        return [];
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

function animateEventGroup(groupElement, activeIntervals) {
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

function formatTimeRange(start, end) {
    if (!start || !end) return '';
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
    if (!location) return '';
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
