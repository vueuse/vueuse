import { Temporal } from '@js-temporal/polyfill'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createTemporal, useTemporal } from '.'

// Mock timers
vi.useFakeTimers()

describe('useTemporal', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.useFakeTimers()
  })

  it('should initialize with default options', () => {
    const temporal = useTemporal()

    expect(temporal.timezone.value).toBe('UTC')
    expect(temporal.calendar.value).toBe('gregory')
    expect(temporal.isActive.value).toBe(true)
    expect(temporal.now.value).toBeInstanceOf(Temporal.ZonedDateTime)
  })

  it('should initialize with custom options', () => {
    const temporal = useTemporal({
      timezone: 'America/New_York',
      calendar: 'islamic',
      immediate: false,
    })

    expect(temporal.timezone.value).toBe('America/New_York')
    expect(temporal.calendar.value).toBe('islamic')
    expect(temporal.isActive.value).toBe(false)
  })

  it('should update timezone reactively', async () => {
    const temporal = useTemporal({ immediate: false })
    const initialTz = temporal.now.value.timeZoneId

    temporal.timezone.value = 'Asia/Tokyo'
    await nextTick()

    expect(temporal.now.value.timeZoneId).toBe('Asia/Tokyo')
    expect(temporal.now.value.timeZoneId).not.toBe(initialTz)
  })

  it('should update calendar reactively', async () => {
    const temporal = useTemporal({ immediate: false })
    const initialCal = temporal.now.value.calendarId

    temporal.calendar.value = 'islamic'
    await nextTick()

    expect(temporal.now.value.calendarId).toBe('islamic')
    expect(temporal.now.value.calendarId).not.toBe(initialCal)
  })

  it('should convert to different timezone', () => {
    const temporal = useTemporal({ timezone: 'UTC', immediate: false })
    const converted = temporal.toTimezone('America/New_York')

    expect(converted.timeZoneId).toBe('America/New_York')
    expect(temporal.now.value.timeZoneId).toBe('UTC') // Original unchanged
  })

  it('should convert to different calendar', () => {
    const temporal = useTemporal({ calendar: 'gregory', immediate: false })
    const converted = temporal.toCalendar('islamic')

    expect(converted.calendarId).toBe('islamic')
    expect(temporal.now.value.calendarId).toBe('gregory') // Original unchanged
  })

  it('should convert to plain date', () => {
    const temporal = useTemporal({ immediate: false })
    const plainDate = temporal.toPlainDate()

    expect(plainDate).toBeInstanceOf(Temporal.PlainDate)
    expect(plainDate.toString()).toMatch(/^\d{4}-\d{2}-\d{2}(\[u-ca=\w+\])?$/)
  })

  it('should convert to plain time', () => {
    const temporal = useTemporal({ immediate: false })
    const plainTime = temporal.toPlainTime()

    expect(plainTime).toBeInstanceOf(Temporal.PlainTime)
    expect(plainTime.toString()).toMatch(/^\d{2}:\d{2}:\d{2}/)
  })

  it('should convert to plain datetime', () => {
    const temporal = useTemporal({ immediate: false })
    const plainDateTime = temporal.toPlainDateTime()

    expect(plainDateTime).toBeInstanceOf(Temporal.PlainDateTime)
    expect(plainDateTime.toString()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('should format datetime', () => {
    const temporal = useTemporal({ immediate: false })
    const formatted = temporal.format({ dateStyle: 'short' })

    expect(typeof formatted).toBe('string')
    expect(formatted).toMatch(/\d/)
  })

  it('should add duration', () => {
    const temporal = useTemporal({ immediate: false })
    const original = temporal.now.value
    const added = temporal.add('P1D') // Add 1 day

    expect(Temporal.ZonedDateTime.compare(added, original)).toBe(1)
    expect(added.epochNanoseconds - original.epochNanoseconds).toBe(BigInt(24 * 60 * 60 * 1000 * 1000 * 1000))
  })

  it('should add duration object', () => {
    const temporal = useTemporal({ immediate: false })
    const original = temporal.now.value
    const duration = Temporal.Duration.from({ hours: 2 })
    const added = temporal.add(duration)

    expect(Temporal.ZonedDateTime.compare(added, original)).toBe(1)
  })

  it('should subtract duration', () => {
    const temporal = useTemporal({ immediate: false })
    const original = temporal.now.value
    const subtracted = temporal.subtract('P1D') // Subtract 1 day

    expect(Temporal.ZonedDateTime.compare(subtracted, original)).toBe(-1)
    expect(original.epochNanoseconds - subtracted.epochNanoseconds).toBe(BigInt(24 * 60 * 60 * 1000 * 1000 * 1000))
  })

  it('should compare dates', () => {
    const temporal = useTemporal({ immediate: false })
    const future = temporal.add('P1D')
    const past = temporal.subtract('P1D')

    expect(temporal.compare(future)).toBe(-1) // now is before future
    expect(temporal.compare(past)).toBe(1) // now is after past
    expect(temporal.compare(temporal.now.value)).toBe(0) // now equals now
  })

  it('should compare with string dates', () => {
    const temporal = useTemporal({ immediate: false })
    const futureString = temporal.add('P1D').toString()

    expect(temporal.compare(futureString)).toBe(-1)
  })

  it('should pause and resume updates', () => {
    const temporal = useTemporal({ interval: 100 })

    expect(temporal.isActive.value).toBe(true)

    temporal.pause()
    expect(temporal.isActive.value).toBe(false)

    temporal.resume()
    expect(temporal.isActive.value).toBe(true)
  })

  it('should update automatically with interval', () => {
    const temporal = useTemporal({ interval: 100 })
    const initialTime = temporal.now.value.epochNanoseconds

    vi.advanceTimersByTime(150)

    expect(temporal.now.value.epochNanoseconds).toBeGreaterThan(initialTime)
  })

  it('should not start immediately when immediate is false', () => {
    const temporal = useTemporal({ immediate: false })

    expect(temporal.isActive.value).toBe(false)
  })
})

describe('createTemporal', () => {
  it('should create from current time', () => {
    const temporal = createTemporal()

    expect(temporal.zonedDateTime.value).toBeInstanceOf(Temporal.ZonedDateTime)
    expect(temporal.zonedDateTime.value.timeZoneId).toBe('UTC')
    expect(temporal.zonedDateTime.value.calendarId).toBe('gregory')
  })

  it('should create with custom timezone and calendar', () => {
    const temporal = createTemporal(undefined, 'America/New_York', 'islamic')

    expect(temporal.zonedDateTime.value.timeZoneId).toBe('America/New_York')
    expect(temporal.zonedDateTime.value.calendarId).toBe('islamic')
  })

  it('should create from string input', () => {
    const dateString = '2023-12-25T15:30:00[America/New_York]'
    const temporal = createTemporal(dateString)

    expect(temporal.zonedDateTime.value.toString()).toMatch(/2023-12-25T\d{2}:\d{2}:\d{2}/)
  })

  it('should create from ZonedDateTime input', () => {
    const zonedDateTime = Temporal.Now.zonedDateTimeISO('Asia/Tokyo')
    const temporal = createTemporal(zonedDateTime)

    expect(temporal.zonedDateTime.value.timeZoneId).toBe('UTC') // Converted to default
  })

  it('should convert to timezone', () => {
    const temporal = createTemporal()
    const converted = temporal.toTimezone('Asia/Tokyo')

    expect(converted.timeZoneId).toBe('Asia/Tokyo')
  })

  it('should convert to calendar', () => {
    const temporal = createTemporal()
    const converted = temporal.toCalendar('islamic')

    expect(converted.calendarId).toBe('islamic')
  })

  it('should convert to plain date', () => {
    const temporal = createTemporal()
    const plainDate = temporal.toPlainDate()

    expect(plainDate).toBeInstanceOf(Temporal.PlainDate)
  })

  it('should convert to plain time', () => {
    const temporal = createTemporal()
    const plainTime = temporal.toPlainTime()

    expect(plainTime).toBeInstanceOf(Temporal.PlainTime)
  })

  it('should convert to plain datetime', () => {
    const temporal = createTemporal()
    const plainDateTime = temporal.toPlainDateTime()

    expect(plainDateTime).toBeInstanceOf(Temporal.PlainDateTime)
  })

  it('should format datetime', () => {
    const temporal = createTemporal()
    const formatted = temporal.format({ dateStyle: 'short' })

    expect(typeof formatted).toBe('string')
    expect(formatted).toMatch(/\d/)
  })
})

describe('edge cases', () => {
  it('should handle invalid timezone gracefully', () => {
    expect(() => {
      useTemporal({ timezone: 'Invalid/Timezone' })
    }).toThrow()
  })

  it('should handle invalid calendar gracefully', () => {
    expect(() => {
      useTemporal({ calendar: 'invalid-calendar' })
    }).toThrow()
  })

  it('should handle invalid duration strings', () => {
    const temporal = useTemporal({ immediate: false })

    expect(() => {
      temporal.add('invalid-duration')
    }).toThrow()
  })

  it('should handle multiple pause/resume calls', () => {
    const temporal = useTemporal()

    temporal.pause()
    temporal.pause() // Should not throw
    expect(temporal.isActive.value).toBe(false)

    temporal.resume()
    temporal.resume() // Should not throw
    expect(temporal.isActive.value).toBe(true)
  })
})
