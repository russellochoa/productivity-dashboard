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
            const isAllDay = !event.start.dateTime && event.start.date;
            
            return {
                start,
                end,
                startTime: formatToTime(start),
                endTime: formatToTime(end),
                summary: event.summary || '',
                location: event.location || '',
                isAllDay,
                originalEvent: event
            };
        });
        
        // Filter events for today only
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        
        const todaysEvents = currentCalendar.filter(event => {
            const eventStart = event.start; // Already a Date object from processing
            return eventStart >= startOfToday && eventStart < endOfToday;
        });
        
        // Filter out working location events and separate all-day events
        const { timedEvents, allDayEvents, workingLocationEvents } = separateEventTypes(todaysEvents);
        
        // Debug logging removed for production
        
        // Update the title with working location icon
        updateWorkingLocationIcon(workingLocationEvents);
        
        elements.eventsList.innerHTML = '';

        // Show all-day events below the title
        if (allDayEvents.length > 0) {
            const allDayContainer = document.createElement('div');
            allDayContainer.className = 'all-day-events mb-2';
            allDayContainer.innerHTML = allDayEvents.map(event => 
                `<div class="text-slate-400 text-[1.2vh] font-light">All day: ${event.summary}</div>`
            ).join('');
            elements.eventsList.appendChild(allDayContainer);
        }

        if (timedEvents && timedEvents.length > 0) {
            const eventGroups = groupEventsByTime(timedEvents);
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
        } else if (allDayEvents.length === 0) {
            elements.eventsList.innerHTML = '<li class="text-slate-300 text-center p-4">No upcoming events.</li>';
        }
        return data?.items || [];
    } catch (error) {
        console.error('Events fetch error:', error);
        elements.eventsList.innerHTML = '<li class="text-slate-300 text-center p-4">Error loading events.</li>';
        return [];
    }
}

function updateWorkingLocationIcon(workingLocationEvents) {
    const titleElement = document.querySelector('#events-module .module-title');
    if (!titleElement) return;
    
    if (workingLocationEvents && workingLocationEvents.length > 0) {
        const workingLocationEvent = workingLocationEvents[0]; // Use the first one
        const summary = workingLocationEvent.summary.toLowerCase();
        const isOffice = summary.includes('office') && !summary.includes('work from home') && !summary.includes('wfh');
        const icon = isOffice ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><path d="M9 22v-6h6v6"></path><path d="M9 12h6"></path><path d="M9 16h6"></path></svg>';
        
        // Update the title to include the icon on the right
        const titleSpan = titleElement.querySelector('span');
        if (titleSpan) {
            titleSpan.innerHTML = `Upcoming Events <span class="working-location-icon">${icon}</span>`;
        }
    } else {
        // Reset to original title if no working location
        const titleSpan = titleElement.querySelector('span');
        titleSpan.innerHTML = 'Upcoming Events';
    }
}

function separateEventTypes(events) {
    const timedEvents = [];
    const allDayEvents = [];
    const workingLocationEvents = [];
    
    events.forEach(event => {
        const summary = event.summary.toLowerCase();
        const isWorkingLocation = summary.includes('working location') ||
                                 summary.includes('office') ||
                                 summary.includes('work from') ||
                                 summary.includes('wfh') ||
                                 summary.includes('remote');
        
        if (event.isAllDay) {
            // Include OOO and important all-day events
            if (summary.includes('ooo') || 
                summary.includes('out of office') ||
                summary.includes('vacation') ||
                summary.includes('holiday') ||
                summary.includes('sick') ||
                summary.includes('pto')) {
                allDayEvents.push(event);
            }
            // Don't include working location events in all-day display
        } else if (isWorkingLocation) {
            // Collect working location events for the icon
            workingLocationEvents.push(event);
        } else {
            // Include regular timed events
            timedEvents.push(event);
        }
    });
    
    return { timedEvents, allDayEvents, workingLocationEvents };
}

function formatToTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
}

function createEventBubbleHTML(event) {
    const locationName = formatLocationName(event.location);
    const locationDisplay = locationName ? 
        `<span class="text-slate-400 font-light">&middot;</span>
         <span class="event-details font-light truncate text-[1.3vh]">${locationName}</span>` : '';
    
    // Check if this is a current event
    const now = new Date();
    const eventStart = event.start; // Already a Date object
    const eventEnd = event.end; // Already a Date object
    const isCurrentEvent = now >= eventStart && now < eventEnd;
    
    const bubbleClass = isCurrentEvent ? 
        'event-bubble current-event' : 
        'event-bubble';
    
    return `<div class="${bubbleClass}">
                    <p class="font-medium text-white text-[1.5vh] truncate">${event.summary}</p>
                    <div class="flex items-center text-slate-300 gap-2 mt-0.5">
                        <span class="event-details font-light whitespace-nowrap text-[1.3vh]">${formatTimeRange(event.startTime, event.endTime)}</span>
                        ${locationDisplay}
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
