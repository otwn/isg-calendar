import { CONFIG } from '../config'

// Day-cell classification for the schedule calendar.
// dow: 0=Sun … 6=Sat. month: 0=Jan … 11=Dec.
export function getDayCellClasses(date, rules = CONFIG.shiftRules) {
  const dow = date.getDay()
  const dom = date.getDate()
  const month = date.getMonth()

  // New Year's Day is always closed, regardless of weekday.
  if (month === 0 && dom === 1) return ['no-shift-day']

  // Year-end holiday block: from this day of December through Dec 31.
  if (month === 11 && dom >= rules.yearEndBlockStartDay) return ['no-shift-day']

  return rules.shiftWeekdays.includes(dow) ? [] : ['no-shift-day']
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Reminder shown after assigning a shift, e.g. "Monday 11am - 2pm".
export function getShiftTimeReminder(date, rules = CONFIG.shiftRules) {
  const dow = date.getDay()
  const time = rules.shiftTimes[dow]
  return time ? `${DAY_NAMES[dow]} ${time}` : DAY_NAMES[dow]
}
