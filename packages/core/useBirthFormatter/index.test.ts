import { describe, expect, it } from 'vitest'
import { useBirthFormatter } from './index'

describe('useBirthFormatter', () => {
  const makeEvent = (value: string) =>
    ({ target: { value } } as unknown as Event)

  it('returns raw when length <= 4', () => {
    expect(useBirthFormatter('-', makeEvent(''))).toBe('')
    expect(useBirthFormatter('-', makeEvent('1'))).toBe('1')
    expect(useBirthFormatter('-', makeEvent('199'))).toBe('199')
    expect(useBirthFormatter('-', makeEvent('1990'))).toBe('1990')
  })

  it('inserts one division when length is 5 or 6', () => {
    expect(useBirthFormatter('-', makeEvent('19901'))).toBe('1990-1')
    expect(useBirthFormatter('-', makeEvent('199012'))).toBe('1990-12')
    expect(useBirthFormatter('/', makeEvent('19901'))).toBe('1990/1')
    expect(useBirthFormatter('/', makeEvent('199012'))).toBe('1990/12')
  })

  it('inserts two divisions when length > 6 (up to 8 digits)', () => {
    expect(useBirthFormatter('-', makeEvent('1990010'))).toBe('1990-01-0')
    expect(useBirthFormatter('-', makeEvent('19900102'))).toBe('1990-01-02')
    expect(useBirthFormatter('/', makeEvent('19900102'))).toBe('1990/01/02')
  })

  it('ignores any non-digit characters in the input', () => {
    expect(useBirthFormatter('-', makeEvent('1990-01-02'))).toBe('1990-01-02')
    expect(useBirthFormatter('/', makeEvent('birth:19900102!'))).toBe('1990/01/02')
    expect(useBirthFormatter('-', makeEvent('19a90b0102'))).toBe('1990-01-02')
  })

  it('truncates extra digits beyond 8 (only first 8 digits are used)', () => {
    expect(useBirthFormatter('-', makeEvent('1990010203'))).toBe('1990-01-02')
    expect(useBirthFormatter('/', makeEvent('199001020304'))).toBe('1990/01/02')
  })

  it('works when division is an empty string (no separators inserted)', () => {
    expect(useBirthFormatter('', makeEvent('19900102'))).toBe('19900102')
    expect(useBirthFormatter('', makeEvent('19901'))).toBe('19901')
  })

  it('returns empty string when there are no digits', () => {
    expect(useBirthFormatter('-', makeEvent('abc-def'))).toBe('')
  })
})
