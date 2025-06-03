import type { MaybeRefOrGetter, Ref } from 'vue'
import { Temporal } from '@js-temporal/polyfill'
import { computed, shallowRef, toValue, watch } from 'vue'

export interface UseTemporalOptions {
  /**
   * Initial timezone
   * @default 'UTC'
   */
  timezone?: string
  /**
   * Calendar system to use
   * @default 'gregory'
   */
  calendar?: string
  /**
   * Update interval in milliseconds
   * @default 1000
   */
  interval?: number
  /**
   * Whether to start immediately
   * @default true
   */
  immediate?: boolean
}

export interface UseTemporalReturn {
  /**
   * Current Temporal.ZonedDateTime
   */
  now: Ref<Temporal.ZonedDateTime>
  /**
   * Current timezone
   */
  timezone: Ref<string>
  /**
   * Current calendar
   */
  calendar: Ref<string>
  /**
   * Convert to different timezone
   */
  toTimezone: (tz: string) => Temporal.ZonedDateTime
  /**
   * Convert to different calendar
   */
  toCalendar: (cal: string) => Temporal.ZonedDateTime
  /**
   * Get PlainDate (date only)
   */
  toPlainDate: () => Temporal.PlainDate
  /**
   * Get PlainTime (time only)
   */
  toPlainTime: () => Temporal.PlainTime
  /**
   * Get PlainDateTime (local date/time)
   */
  toPlainDateTime: () => Temporal.PlainDateTime
  /**
   * Format date/time
   */
  format: (options?: Intl.DateTimeFormatOptions) => string
  /**
   * Add duration
   */
  add: (duration: Temporal.Duration | string) => Temporal.ZonedDateTime
  /**
   * Subtract duration
   */
  subtract: (duration: Temporal.Duration | string) => Temporal.ZonedDateTime
  /**
   * Compare with another date
   */
  compare: (other: Temporal.ZonedDateTime | string) => number
  /**
   * Start/stop auto-update
   */
  pause: () => void
  resume: () => void
  /**
   * Whether auto-update is active
   */
  isActive: Ref<boolean>
}

/**
 * Reactive Temporal API with timezone and calendar support
 *
 * @param options - Configuration options
 */
export function useTemporal(options: UseTemporalOptions = {}): UseTemporalReturn {
  const {
    timezone: initialTimezone = 'UTC',
    calendar: initialCalendar = 'gregory',
    interval = 1000,
    immediate = true,
  } = options

  const timezone = shallowRef(initialTimezone)
  const calendar = shallowRef(initialCalendar)
  const isActive = shallowRef(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const now = shallowRef(
    Temporal.Now.zonedDateTimeISO(timezone.value).withCalendar(calendar.value),
  )

  const updateNow = () => {
    now.value = Temporal.Now.zonedDateTimeISO(timezone.value).withCalendar(calendar.value)
  }

  const pause = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isActive.value = false
  }

  const resume = () => {
    if (intervalId)
      pause()

    intervalId = setInterval(updateNow, interval)
    isActive.value = true
  }

  // Watch for timezone/calendar changes and update
  watch([timezone, calendar], updateNow)

  // Auto-start if immediate
  if (immediate) {
    resume()
  }

  const toTimezone = (tz: string) => {
    return now.value.withTimeZone(tz)
  }

  const toCalendar = (cal: string) => {
    return now.value.withCalendar(cal)
  }

  const toPlainDate = () => {
    return now.value.toPlainDate()
  }

  const toPlainTime = () => {
    return now.value.toPlainTime()
  }

  const toPlainDateTime = () => {
    return now.value.toPlainDateTime()
  }

  const format = (options?: Intl.DateTimeFormatOptions) => {
    return now.value.toLocaleString(undefined, options)
  }

  const add = (duration: Temporal.Duration | string) => {
    const dur = typeof duration === 'string'
      ? Temporal.Duration.from(duration)
      : duration
    return now.value.add(dur)
  }

  const subtract = (duration: Temporal.Duration | string) => {
    const dur = typeof duration === 'string'
      ? Temporal.Duration.from(duration)
      : duration
    return now.value.subtract(dur)
  }

  const compare = (other: Temporal.ZonedDateTime | string) => {
    const otherDate = typeof other === 'string'
      ? Temporal.ZonedDateTime.from(other)
      : other
    return Temporal.ZonedDateTime.compare(now.value, otherDate)
  }

  return {
    now,
    timezone,
    calendar,
    toTimezone,
    toCalendar,
    toPlainDate,
    toPlainTime,
    toPlainDateTime,
    format,
    add,
    subtract,
    compare,
    pause,
    resume,
    isActive,
  }
}

/**
 * Create a static Temporal date/time utility
 */
export function createTemporal(
  input?: MaybeRefOrGetter<string | Temporal.ZonedDateTime>,
  timezone?: MaybeRefOrGetter<string>,
  calendar?: MaybeRefOrGetter<string>,
) {
  const zonedDateTime = computed(() => {
    const inputValue = toValue(input)
    const tz = toValue(timezone) || 'UTC'
    const cal = toValue(calendar) || 'gregory'

    if (!inputValue) {
      return Temporal.Now.zonedDateTimeISO(tz).withCalendar(cal)
    }

    if (typeof inputValue === 'string') {
      return Temporal.ZonedDateTime.from(inputValue).withTimeZone(tz).withCalendar(cal)
    }

    return inputValue.withTimeZone(tz).withCalendar(cal)
  })

  return {
    zonedDateTime,
    toTimezone: (tz: string) => zonedDateTime.value.withTimeZone(tz),
    toCalendar: (cal: string) => zonedDateTime.value.withCalendar(cal),
    toPlainDate: () => zonedDateTime.value.toPlainDate(),
    toPlainTime: () => zonedDateTime.value.toPlainTime(),
    toPlainDateTime: () => zonedDateTime.value.toPlainDateTime(),
    format: (options?: Intl.DateTimeFormatOptions) =>
      zonedDateTime.value.toLocaleString(undefined, options),
  }
}
