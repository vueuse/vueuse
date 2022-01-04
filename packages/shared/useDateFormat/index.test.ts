import { useDateFormat } from '../useDateFormat'

describe('useDateFormat', () => {
  it('should work with default', () => {
    expect(useDateFormat(new Date('2022-01-01 10:24:00'))).toBe('10:24:00')
  })
  it('should work with time string ', () => {
    expect(useDateFormat('2022-01-01 20:24:24', 'YYYY—MM-DD HH:mm:ss')).toBe('2022—01-01 20:24:24')
  })
  it('should work with YYYY-MM-DD', () => {
    expect(useDateFormat(new Date('2022-01-01 10:24:00'), 'YYYY-MM-DD')).toBe('2022-01-01')
  })
  it('should work with YY-M-D', () => {
    expect(useDateFormat(new Date('2022-01-01 10:24:00'), 'YY-M-D')).toBe('22-1-1')
  })
  it('should work with h:m:s', () => {
    expect(useDateFormat(new Date('2022-01-01 08:05:00'), 'h:m:s')).toBe('8:5:0')
  })
  it('should work with hh:mm:ss', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'hh:mm:ss')).toBe('03:05:05')
  })
  it('should work with HH:mm:ss', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'HH:mm:ss')).toBe('15:05:05')
  })
  it('should work with HH:mm:ss:SSS', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05:999'), 'HH:mm:ss:SSS')).toBe('15:05:05:999')
  })
})
