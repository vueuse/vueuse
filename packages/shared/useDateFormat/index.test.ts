import { formatDate, normalizeDate, useDateFormat } from '../useDateFormat'

describe('useDateFormat', () => {
  it('should export module', () => {
    expect(normalizeDate).toBeDefined()
    expect(formatDate).toBeDefined()
    expect(useDateFormat).toBeDefined()
  })
  it('should normalize date', () => {
    const date = new Date(2022, 0, 1, 0, 0, 0)
    const currentDate = new Date().toDateString()
    expect(normalizeDate(undefined).toDateString()).toBe(currentDate)
    // @ts-expect-error test null
    expect(normalizeDate(null).toString()).toBe('Invalid Date')
    expect(normalizeDate(new Date()).toDateString()).toBe(currentDate)
    expect(normalizeDate(new Date().toString()).toDateString()).toBe(currentDate)
    expect(normalizeDate(new Date().toISOString().replace('Z', '')).toDateString()).toBe(currentDate)
    expect(normalizeDate('2022-01')).toEqual(date)
    expect(normalizeDate('2022-01-01')).toEqual(date)
    expect(normalizeDate('2022-01-01T00:00:00.000')).toEqual(date)
  })
  it('should work with default', () => {
    expect(useDateFormat(new Date('2022-01-01 10:24:00')).value).toBe('10:24:00')
  })
  it('should work with time string ', () => {
    expect(useDateFormat('2022-01-01 20:24:24', 'YYYY—MM-DD HH:mm:ss').value).toBe('2022—01-01 20:24:24')
  })
  it('should work with YYYY-MM-DD', () => {
    expect(useDateFormat(new Date('2022-01-01 10:24:00'), 'YYYY-MM-DD').value).toBe('2022-01-01')
  })
  it('should work with YY-M-D', () => {
    expect(useDateFormat(new Date('2022-01-01 10:24:00'), 'YY-M-D').value).toBe('22-1-1')
  })
  it('should work with H:m:ss', () => {
    expect(useDateFormat(new Date('2022-01-01 10:24:00'), 'H:m:s').value).toBe('10:24:0')
  })
  it('should work with h:m:s', () => {
    expect(useDateFormat(new Date('2022-01-01 00:05:00'), 'h:m:s').value).toBe('12:5:0')
    expect(useDateFormat(new Date('2022-01-01 08:05:00'), 'h:m:s').value).toBe('8:5:0')
  })
  it('should work with hh:mm:ss', () => {
    expect(useDateFormat(new Date('2022-01-01 00:05:05'), 'hh:mm:ss').value).toBe('12:05:05')
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'hh:mm:ss').value).toBe('03:05:05')
  })
  it('should work with HH:mm:ss', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'HH:mm:ss').value).toBe('15:05:05')
  })
  it('should work with HH:mm:ss:SSS', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05:999'), 'HH:mm:ss:SSS').value).toBe('15:05:05:999')
  })
  it('should work with HH:mm:ss d', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'HH:mm:ss d').value).toBe('15:05:05 6')
  })
  it('should work with YYYY/MM/DD dd', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'YYYY/MM/DD dd', { locales: 'en-US' }).value).toBe('2022/01/01 S')
  })
  it('should work with YYYY/MM/DD ddd', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'YYYY/MM/DD ddd', { locales: 'en-US' }).value).toBe('2022/01/01 Sat')
  })
  it('should work with YYYY/MM/DD dddd', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'YYYY/MM/DD dddd', { locales: 'en-US' }).value).toBe('2022/01/01 Saturday')
  })
  it('should work with MMM DD YYYY', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'MMM DD YYYY', { locales: 'en-US' }).value).toBe('Jan 01 2022')
  })
  it('should work with MMMM DD YYYY', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'MMMM DD YYYY', { locales: 'en-US' }).value).toBe('January 01 2022')
  })

  describe('meridiem', () => {
    it.each([
      // AM
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss A', expected: '03:05:05 AM' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss AA', expected: '03:05:05 A.M.' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss a', expected: '03:05:05 am' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss aa', expected: '03:05:05 a.m.' },
      // PM
      { dateStr: '2022-01-01 15:05:05', formatStr: 'hh:mm:ss A', expected: '03:05:05 PM' },
      { dateStr: '2022-01-01 15:05:05', formatStr: 'hh:mm:ss AA', expected: '03:05:05 P.M.' },
      { dateStr: '2022-01-01 15:05:05', formatStr: 'hh:mm:ss a', expected: '03:05:05 pm' },
      { dateStr: '2022-01-01 15:05:05', formatStr: 'hh:mm:ss aa', expected: '03:05:05 p.m.' },
    ])('should work with $formatStr', ({ dateStr, formatStr, expected }) => {
      expect(useDateFormat(new Date(dateStr), formatStr).value).toBe(expected)
    })

    const customMeridiem = (hours: number, minutes: number, isLowercase?: boolean, hasPeriod?: boolean) => {
      const m = hours > 11 ? (isLowercase ? 'μμ' : 'ΜΜ') : (isLowercase ? 'πμ' : 'ΠΜ')
      return hasPeriod ? m.split('').reduce((acc, curr) => acc += `${curr}.`, '') : m
    }

    it.each([
      // AM
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss A', expected: '03:05:05 ΠΜ' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss AA', expected: '03:05:05 Π.Μ.' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss a', expected: '03:05:05 πμ' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss aa', expected: '03:05:05 π.μ.' },
      // PM
      { dateStr: '2022-01-01 15:05:05', formatStr: 'hh:mm:ss A', expected: '03:05:05 ΜΜ' },
      { dateStr: '2022-01-01 15:05:05', formatStr: 'hh:mm:ss AA', expected: '03:05:05 Μ.Μ.' },
      { dateStr: '2022-01-01 15:05:05', formatStr: 'hh:mm:ss a', expected: '03:05:05 μμ' },
      { dateStr: '2022-01-01 15:05:05', formatStr: 'hh:mm:ss aa', expected: '03:05:05 μ.μ.' },
    ])('should work with custom meridiem with $formatStr', ({ dateStr, formatStr, expected }) => {
      expect(useDateFormat(new Date(dateStr), formatStr, { customMeridiem }).value).toBe(expected)
    })
  })
})
