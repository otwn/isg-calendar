import { CONFIG } from '../config'

// Day-cell classification for the schedule calendar.
// dow: 0=Sun … 6=Sat.
export function getDayCellClasses(date, rules = CONFIG.shiftRules) {
  const dow = date.getDay()
  return rules.shiftWeekdays.includes(dow) ? [] : ['no-shift-day']
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Reminder shown after assigning a shift, e.g. "Monday 11am - 2pm".
export function getShiftTimeReminder(date, rules = CONFIG.shiftRules) {
  const dow = date.getDay()
  const time = rules.shiftTimes[dow]
  return time ? `${DAY_NAMES[dow]} ${time}` : DAY_NAMES[dow]
}
