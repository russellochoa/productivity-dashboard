const { formatTimeRange, formatLocationName, getStatusFromEvent } = require('../public/helpers');

describe('formatTimeRange', () => {
  test('omits meridian on start when both times share it', () => {
    expect(formatTimeRange('10:00 AM', '11:30 AM')).toBe('10 - 11:30 am');
  });

  test('keeps meridian when times differ', () => {
    expect(formatTimeRange('11:00 AM', '1:00 PM')).toBe('11 am - 1 pm');
  });

  test('returns empty string for missing inputs', () => {
    expect(formatTimeRange(null, '1:00 PM')).toBe('');
  });
});

describe('formatLocationName', () => {
  test('extracts room name from structured location', () => {
    const location = 'Company - HQ - Conference Room A (Building 1)';
    expect(formatLocationName(location)).toBe('Conference Room A');
  });

  test('falls back to original when structure missing', () => {
    const location = 'Remote';
    expect(formatLocationName(location)).toBe('Remote');
  });
});

describe('getStatusFromEvent', () => {
  test('detects lunch meetings', () => {
    const event = { summary: 'Lunch with team' };
    expect(getStatusFromEvent(event)).toBe('Out at Lunch');
  });

  test('detects focus time', () => {
    const event = { summary: 'Focus Time - Deep work' };
    expect(getStatusFromEvent(event)).toBe('Focus Time');
  });

  test('detects zoom meetings', () => {
    const event = { summary: 'Weekly Sync', conferenceData: {} };
    expect(getStatusFromEvent(event)).toBe('In a Zoom Meeting');
  });

  test('defaults to meeting', () => {
    const event = { summary: 'Planning session' };
    expect(getStatusFromEvent(event)).toBe('In a Meeting');
  });
});
