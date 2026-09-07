import { describe, it, expect } from 'vitest'
import { getDayCellClasses, getShiftTimeReminder } from '../scheduleRules'

// Reference week: May 2026 - Sun 3, Mon 4, Tue 5, Wed 6, Thu 7, Fri 8, Sat 9
describe('getDayCellClasses', () => {
  it('leaves Mon/Wed/Fri untouched', () => {
    expect(getDayCellClasses(new Date(2026, 4, 4))).toEqual([]) // Mon
    expect(getDayCellClasses(new Date(2026, 4, 6))).toEqual([]) // Wed
    expect(getDayCellClasses(new Date(2026, 4, 8))).toEqual([]) // Fri
  })

  it('greys out Sun/Tue/Thu/Sat', () => {
    expect(getDayCellClasses(new Date(2026, 4, 3))).toContain('no-shift-day') // Sun
    expect(getDayCellClasses(new Date(2026, 4, 5))).toContain('no-shift-day') // Tue
    expect(getDayCellClasses(new Date(2026, 4, 7))).toContain('no-shift-day') // Thu
    expect(getDayCellClasses(new Date(2026, 4, 9))).toContain('no-shift-day') // Sat
  })

  it('greys out Jan 1 even when it falls on a Mon/Wed/Fri', () => {
    expect(getDayCellClasses(new Date(2027, 0, 1))).toEqual(['no-shift-day']) // Fri
  })

  it('greys out Dec 24-31 even when they fall on a Mon/Wed/Fri', () => {
    expect(getDayCellClasses(new Date(2026, 11, 25))).toEqual(['no-shift-day']) // Fri
    expect(getDayCellClasses(new Date(2026, 11, 28))).toEqual(['no-shift-day']) // Mon
    expect(getDayCellClasses(new Date(2026, 11, 30))).toEqual(['no-shift-day']) // Wed
  })

  it('leaves Dec 23 (before the year-end block) untouched if it is a shift day', () => {
    // Dec 23, 2026 is a Wednesday
    expect(getDayCellClasses(new Date(2026, 11, 23))).toEqual([])
  })
})

describe('getShiftTimeReminder', () => {
  it('returns the Monday time', () => {
    expect(getShiftTimeReminder(new Date(2026, 4, 4))).toBe('Monday 11am - 2pm')
  })

  it('returns the Wednesday time', () => {
    expect(getShiftTimeReminder(new Date(2026, 4, 6))).toBe('Wednesday 11am - 2pm')
  })

  it('returns the Friday time', () => {
    expect(getShiftTimeReminder(new Date(2026, 4, 8))).toBe('Friday 11am - 2pm')
  })

  it('returns just the day name for a non-shift day', () => {
    expect(getShiftTimeReminder(new Date(2026, 4, 3))).toBe('Sunday')
  })
})
