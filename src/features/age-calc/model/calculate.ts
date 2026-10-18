import type { Age } from './types'

/**
 * Calendar age from `birth` to `now`, borrowing from the next-larger unit the
 * way people actually count birthdays: if days go negative, borrow the number
 * of days in the month preceding `now`; if months go negative, borrow 12.
 */
export const calculateAge = (birth: Date, now: Date = new Date()): Age => {
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()

  if (days < 0) {
    months -= 1
    // Days in the month just before `now` (month index 0 == December of prev year).
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  // Guard the rare overflow where the birth day exceeds the borrowed month's
  // length (e.g. born on the 31st) so the display never shows a negative count.
  return { years, months: Math.max(0, months), days: Math.max(0, days) }
}
