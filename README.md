# Productivity Dashboard

A modern, real-time productivity dashboard that displays your calendar events, current status, weather, and more in a beautiful, always-on interface.

## Features

### 🎯 Smart Status System
- **Real-time status detection** based on your Google Calendar events
- **Intelligent status mapping**: Automatically detects meetings, focus time, out of office, etc.
- **Easter egg statuses**: Special statuses for "Too Many Meetings" and "Chill Day" scenarios
- **Time-based fallback statuses**: Contextual statuses based on time of day
- **Working location indicators**: Shows office vs. remote work status

### 📅 Calendar Integration
- **Google Calendar integration** via API
- **Today's events display** with smart filtering
- **Event categorization**: Separates timed events, all-day events, and working location events
- **Current event highlighting** with visual indicators
- **Working location icons** in the events module title

### 🌤️ Weather Module
- **Current weather conditions** with icons
- **Temperature and conditions** display
- **Location-based weather** (configurable)

### 🖼️ Photo Albums
- **Personal and company photo collections**
- **Slideshow functionality** with smooth transitions
- **Configurable photo sources**

### 📰 News & Information
- **Stock market data** display
- **News headlines** integration
- **Daily quotes** for inspiration

## Quick Start

### Prerequisites
- Node.js 18 or later (uses built-in `fetch` API)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your API endpoints (see Configuration section)
4. Start the server: `npm start`
5. Access the dashboard at `http://localhost:3000`

## Configuration

The dashboard uses a `config.json` file for API endpoints. Create this file in the project root:

```json
{
  "quoteUrl": "https://your-proxy.com/api/quote",
  "weatherUrl": "https://your-proxy.com/api/weather?location=YourCity,State&days=1&aqi=yes",
  "eventsUrl": "https://your-proxy.com/api/events",
  "personalPhotosUrl": "https://your-photo-api.com/personal",
  "companyPhotosUrl": "https://your-photo-api.com/company",
  "stockUrl": "https://your-proxy.com/api/stock",
  "newsUrl": "https://your-proxy.com/api/news"
}
```

### API Requirements

- **Events**: Google Calendar API integration for calendar events
- **Weather**: Weather API for current conditions
- **Photos**: Photo API for personal/company image collections
- **Stocks**: Stock market data API
- **News**: News API for headlines
- **Quotes**: Daily inspirational quotes API

## Status Logic

The dashboard features a sophisticated status system with three priority levels:

### Priority 1: Easter Eggs (Override Everything)
- **"Too Many Meetings (warning)"** - Triggers when >6 meetings AND ≤1 hour free time (9 AM-5 PM)
- **"What a chill day today"** - Triggers when ≤3 meetings for the day
- **Timing**: Appears every 20 minutes for 10 seconds, only during work hours (9 AM - 5 PM)

### Priority 2: Current Calendar Events
- **"Out of Office"** - Event type is outOfOffice OR title contains "ooo"
- **"Out Sick"** - Title contains "sick"
- **"Out at Lunch"** - Title contains "lunch"
- **"Focus Time"** - Title contains "focus time"
- **"In a Meeting"** - Has zoom link AND physical location
- **"In a Zoom Meeting"** - Has zoom link but NO physical location
- **"Overloaded Human"** - Triple-booked or more (overlapping events)

### Priority 3: Time-Based Fallback
- **6:00-8:00 AM**: "Booting Up… Breakfast First", "Working Out", "System Not Ready"
- **8:00-9:00 AM**: "Starting the Day Strong", "Thoughts Loading", "Warming Up Slack Fingers"
- **4:00-4:30 PM**: "Workday Shutdown in Progress", "Office Evacuation in Progress"
- **4:30-6:00 PM**: "Logging Out IRL", "Goodbye Desk, Hello Couch"
- **6:00 PM-12:00 AM**: "Do Not Disturb — Life in Progress", "Battery Depleted — Recharging"
- **Other times**: "Available"

## Technical Details

### Architecture
- **Frontend**: Vanilla JavaScript with ES6 modules
- **Backend**: Node.js with Express server
- **Styling**: Tailwind CSS for modern, responsive design
- **Real-time updates**: 5-second status evaluation, 15-minute data refresh

### Key Features
- **Responsive design** that works on various screen sizes
- **Real-time status updates** without page refresh
- **Smart event filtering** (today's events only)
- **Working location detection** and visual indicators
- **Performance optimized** with minimal console logging
- **Modular architecture** for easy maintenance and extension

## Development

### Project Structure
```
productivity-dashboard/
├── public/
│   ├── modules/          # Feature modules
│   │   ├── events/       # Calendar events
│   │   ├── status/       # Status management
│   │   ├── weather/      # Weather display
│   │   ├── albums/       # Photo albums
│   │   └── slideshow/    # Photo slideshow
│   ├── main.js          # Main application logic
│   └── styles.css       # Global styles
├── server/
│   └── index.js         # Express server
├── config.json          # API configuration
└── package.json         # Dependencies
```

### Scripts
- `npm start` - Start the development server
- `npm test` - Run tests (placeholder)

## License

ISC License