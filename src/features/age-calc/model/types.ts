export type Field = 'day' | 'month' | 'year'

export type FormValues = Record<Field, string>

export type FieldErrors = Partial<Record<Field, string>>

export type Age = {
  years: number
  months: number
  days: number
}
