import type { FieldErrors, FormValues } from './types'

const daysInMonth = (month: number, year: number): number =>
  new Date(year, month, 0).getDate()

/**
 * Validate the three date fields against the Frontend Mentor rules, in the same
 * precedence the design shows: empty → out-of-range → not-a-real-date → future.
 * Returns a per-field error map (empty object means the date is valid).
 *
 * `now` is injected so the "must be in the past" check is deterministic in tests.
 */
export const validateDate = (values: FormValues, now: Date = new Date()): FieldErrors => {
  const errors: FieldErrors = {}

  // 1. Required
  if (values.day.trim() === '') errors.day = 'This field is required'
  if (values.month.trim() === '') errors.month = 'This field is required'
  if (values.year.trim() === '') errors.year = 'This field is required'
  if (errors.day || errors.month || errors.year) return errors

  const day = Number(values.day)
  const month = Number(values.month)
  const year = Number(values.year)

  // 2. Integers in range
  if (!Number.isInteger(day) || day < 1 || day > 31) errors.day = 'Must be a valid day'
  if (!Number.isInteger(month) || month < 1 || month > 12) errors.month = 'Must be a valid month'

  const currentYear = now.getFullYear()
  if (!Number.isInteger(year) || year < 1) {
    errors.year = 'Must be a valid year'
  } else if (year > currentYear) {
    errors.year = 'Must be in the past'
  }
  if (errors.day || errors.month || errors.year) return errors

  // 3. Real calendar date (e.g. reject 31/04, 29/02 on a common year).
  // This is a whole-date error: the design turns every field red but shows the
  // single message under Day, so month/year carry an empty (red-only) marker.
  if (day > daysInMonth(month, year)) {
    return { day: 'Must be a valid date', month: '', year: '' }
  }

  // 4. Whole date must not be in the future
  const birth = new Date(year, month - 1, day)
  if (birth.getTime() > now.getTime()) {
    errors.year = 'Must be in the past'
  }

  return errors
}
