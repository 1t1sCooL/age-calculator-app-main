import { describe, expect, it } from 'vitest'
import { validateDate } from './validate'
import { calculateAge } from './calculate'
import type { FormValues } from './types'

const NOW = new Date(2023, 0, 1) // 1 Jan 2023 (month index 0)

const vals = (day: string, month: string, year: string): FormValues => ({ day, month, year })

describe('validateDate', () => {
  it('flags every empty field as required', () => {
    expect(validateDate(vals('', '', ''), NOW)).toEqual({
      day: 'This field is required',
      month: 'This field is required',
      year: 'This field is required',
    })
  })

  it('flags a single empty field', () => {
    expect(validateDate(vals('12', '', '1990'), NOW)).toEqual({
      month: 'This field is required',
    })
  })

  it('rejects out-of-range day and month', () => {
    const e = validateDate(vals('98', '14', '1990'), NOW)
    expect(e.day).toBe('Must be a valid day')
    expect(e.month).toBe('Must be a valid month')
  })

  it('rejects a future year as in-the-past', () => {
    expect(validateDate(vals('1', '1', '2177'), NOW).year).toBe('Must be in the past')
  })

  it('rejects an impossible calendar date (31 April) and reds all fields', () => {
    // Whole-date error: message under day, month/year red-only (empty marker).
    expect(validateDate(vals('31', '4', '1991'), NOW)).toEqual({
      day: 'Must be a valid date',
      month: '',
      year: '',
    })
  })

  it('rejects 29 Feb on a common year but accepts it on a leap year', () => {
    expect(validateDate(vals('29', '2', '2021'), NOW).day).toBe('Must be a valid date')
    expect(validateDate(vals('29', '2', '2020'), NOW)).toEqual({})
  })

  it('rejects a date later today-this-year but in the future', () => {
    expect(validateDate(vals('2', '1', '2023'), NOW).year).toBe('Must be in the past')
  })

  it('accepts a valid past date', () => {
    expect(validateDate(vals('24', '9', '1984'), NOW)).toEqual({})
  })
})

describe('calculateAge', () => {
  it('matches the design example (24/09/1984 → 38y 3m 26d on 19/01/2023)', () => {
    const age = calculateAge(new Date(1984, 8, 24), new Date(2023, 0, 19))
    expect(age).toEqual({ years: 38, months: 3, days: 26 })
  })

  it('is all zeros on the exact birth date', () => {
    expect(calculateAge(new Date(2000, 5, 15), new Date(2000, 5, 15))).toEqual({
      years: 0,
      months: 0,
      days: 0,
    })
  })

  it('borrows days from the previous month', () => {
    // born 10 Jan 2020, now 5 Mar 2020 → 0y 1m, days borrow from Feb (29 in 2020): 19 + 5
    const age = calculateAge(new Date(2020, 0, 10), new Date(2020, 2, 5))
    expect(age).toEqual({ years: 0, months: 1, days: 24 })
  })

  it('never returns negative days when born on the 31st and the borrow month is shorter', () => {
    const age = calculateAge(new Date(2020, 0, 31), new Date(2020, 2, 1))
    expect(age.days).toBeGreaterThanOrEqual(0)
    expect(age.months).toBeGreaterThanOrEqual(0)
  })

  it('borrows months across a year boundary', () => {
    // born 15 Dec 2000, now 10 Jan 2001 → 0y 0m 26d
    expect(calculateAge(new Date(2000, 11, 15), new Date(2001, 0, 10))).toEqual({
      years: 0,
      months: 0,
      days: 26,
    })
  })
})
