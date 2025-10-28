import { describe, expect, it } from 'vitest'
import { birthFormatter } from './index'

describe('birthFormatter', () => {
  const makeEvent = (value: string) =>
    ({ target: { value } } as unknown as Event)

  it('returns raw when length <= 4', () => {
    expect(birthFormatter('-', makeEvent(''))).toBe('')
    expect(birthFormatter('-', makeEvent('1'))).toBe('1')
    expect(birthFormatter('-', makeEvent('199'))).toBe('199')
    expect(birthFormatter('-', makeEvent('1990'))).toBe('1990')
  })

  it('inserts one division when length is 5 or 6', () => {
    expect(birthFormatter('-', makeEvent('19901'))).toBe('1990-1')
    expect(birthFormatter('-', makeEvent('199012'))).toBe('1990-12')
    expect(birthFormatter('/', makeEvent('19901'))).toBe('1990/1')
    expect(birthFormatter('/', makeEvent('199012'))).toBe('1990/12')
  })

  it('inserts two divisions when length > 6 (up to 8 digits)', () => {
    expect(birthFormatter('-', makeEvent('1990010'))).toBe('1990-01-0')
    expect(birthFormatter('-', makeEvent('19900102'))).toBe('1990-01-02')
    expect(birthFormatter('/', makeEvent('19900102'))).toBe('1990/01/02')
  })

  it('ignores any non-digit characters in the input', () => {
    expect(birthFormatter('-', makeEvent('1990-01-02'))).toBe('1990-01-02')
    expect(birthFormatter('/', makeEvent('birth:19900102!'))).toBe('1990/01/02')
    expect(birthFormatter('-', makeEvent('19a90b0102'))).toBe('1990-01-02')
  })

  it('truncates extra digits beyond 8 (only first 8 digits are used)', () => {
    expect(birthFormatter('-', makeEvent('1990010203'))).toBe('1990-01-02')
    expect(birthFormatter('/', makeEvent('199001020304'))).toBe('1990/01/02')
  })

  it('works when division is an empty string (no separators inserted)', () => {
    expect(birthFormatter('', makeEvent('19900102'))).toBe('19900102')
    expect(birthFormatter('', makeEvent('19901'))).toBe('19901')
  })

  it('returns empty string when there are no digits', () => {
    expect(birthFormatter('-', makeEvent('abc-def'))).toBe('')
  })
})
