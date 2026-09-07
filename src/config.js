export const CONFIG = {
  // Public Google Calendar embed URL (leave blank to hide the Events tab)
  googleCalendarUrl: '',

  // App name shown in header
  appName: 'Ikeda Sun Group',

  // Shift / calendar grey-out rules. Days-of-week use 0=Sun … 6=Sat.
  shiftRules: {
    // Weekdays that have shifts. All other weekdays are non-shift (greyed out).
    shiftWeekdays: [1, 3, 5],          // Mon, Wed, Fri

    // Year-end holiday block: from this day of December through Dec 31.
    // New Year's Day (Jan 1) is always closed regardless of this setting.
    yearEndBlockStartDay: 24,

    // Shift start/end times shown in the post-assign reminder, keyed by
    // weekday (0=Sun … 6=Sat). Days without an entry have no fixed time.
    shiftTimes: {
      1: '11am - 2pm',  // Mon
      3: '11am - 2pm',  // Wed
      5: '11am - 2pm',  // Fri
    },
  },
}

export function getGoogleCalendarUrl() {
  return CONFIG.googleCalendarUrl
}
