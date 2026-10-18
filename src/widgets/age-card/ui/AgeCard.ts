import m from 'mithril'
import { assets } from '@/shared/config/assets'
import { calculateAge, validateDate, type Field, type FieldErrors, type FormValues } from '@/features/age-calc'
import { countUp } from '@/shared/lib/countUp'
import './AgeCard.css'

type DisplayAge = Record<'years' | 'months' | 'days', number | null>

export const AgeCard: m.ClosureComponent = () => {
  const values: FormValues = { day: '', month: '', year: '' }
  let errors: FieldErrors = {}
  const display: DisplayAge = { years: null, months: null, days: null }
  let cancelAnim = () => {}

  const onInput = (field: Field) => (event: Event) => {
    values[field] = (event.target as HTMLInputElement).value
    if (errors[field]) delete errors[field]
  }

  const submit = (event: Event) => {
    event.preventDefault()
    cancelAnim()
    errors = validateDate(values)

    if (Object.keys(errors).length > 0) {
      display.years = display.months = display.days = null
      return
    }

    const birth = new Date(Number(values.year), Number(values.month) - 1, Number(values.day))
    const age = calculateAge(birth)
    const cancels = [
      countUp(age.years, 850, (v) => {
        display.years = v
        m.redraw()
      }),
      countUp(age.months, 850, (v) => {
        display.months = v
        m.redraw()
      }),
      countUp(age.days, 850, (v) => {
        display.days = v
        m.redraw()
      }),
    ]
    cancelAnim = () => cancels.forEach((c) => c())
  }

  const field = (name: Field, label: string, placeholder: string, maxlength: number): m.Vnode => {
    const hasError = name in errors // key present === red state (message may be empty)
    const message = errors[name]
    return m('div.field', { class: hasError ? 'field--error' : '' }, [
      m('label.field__label', { for: name }, label),
      m('input.field__input', {
        id: name,
        name,
        type: 'text',
        inputmode: 'numeric',
        placeholder,
        maxlength,
        autocomplete: 'off',
        value: values[name],
        'aria-invalid': hasError ? 'true' : 'false',
        'aria-describedby': message ? `${name}-error` : undefined,
        oninput: onInput(name),
      }),
      message ? m('span.field__error', { id: `${name}-error` }, message) : null,
    ])
  }

  const resultLine = (value: number | null, word: string): m.Vnode =>
    m('p.result', [
      m('span.result__num', value === null ? '--' : String(value)),
      m('span.result__word', word),
    ])

  return {
    view() {
      return m('section.card', [
        m('form.form', { onsubmit: submit, novalidate: true }, [
          m('div.fields', [
            field('day', 'Day', 'DD', 2),
            field('month', 'Month', 'MM', 2),
            field('year', 'Year', 'YYYY', 4),
          ]),
          m('div.divider', [
            m('hr.divider__line'),
            m(
              'button.submit',
              { type: 'submit', 'aria-label': 'Calculate age' },
              m('img', { src: assets.iconArrow, alt: '', width: 44, height: 44 }),
            ),
          ]),
        ]),
        m('div.results', { 'aria-live': 'polite' }, [
          resultLine(display.years, 'years'),
          resultLine(display.months, 'months'),
          resultLine(display.days, 'days'),
        ]),
      ])
    },
  }
}
