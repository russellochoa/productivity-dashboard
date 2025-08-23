const test = require('node:test');
const assert = require('node:assert');
const { getCurrentEvent, evaluate } = require('../public/status-utils.js');

test('getCurrentEvent returns first overlapping event', () => {
  const calendar = [
    { startTime: '9:00 am', endTime: '10:00 am', summary: 'Event A' },
    { startTime: '9:30 am', endTime: '10:30 am', summary: 'Event B' }
  ];
  const now = new Date();
  now.setHours(9, 45, 0, 0);
  const event = getCurrentEvent(now, calendar);
  assert.strictEqual(event.summary, 'Event A');
});

test('getCurrentEvent handles all-day events', () => {
  const calendar = [
    { startTime: '12:00 am', endTime: '12:00 am', summary: 'All Day Event' }
  ];
  const now = new Date();
  now.setHours(15, 0, 0, 0);
  const event = getCurrentEvent(now, calendar);
  assert.ok(event, 'Expected to find all-day event');
  assert.strictEqual(event.summary, 'All Day Event');
});

test('evaluate triggers setStatus based on real events', () => {
  const calendar = [
    { startTime: '12:00 pm', endTime: '1:00 pm', summary: 'Lunch with team' }
  ];
  const now = new Date();
  now.setHours(12, 30, 0, 0);
  const config = { statusConfig: { fallback_statuses: {}, images: {} } };
  let status = null;
  function setStatus(s) { status = s; }
  evaluate(now, calendar, config, setStatus);
  assert.strictEqual(status, 'Out at Lunch');
});
