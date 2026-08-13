import type { Pausable } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { useIntervalFn } from '@vueuse/shared'
import { computed, shallowRef, toValue, watch } from 'vue'

export interface UseTemporalOptions {
  /**
   * Initial timezone
   *
   * @default 'UTC'
   */
  timezone?: string
  /**
   * Calendar system to use
   *
   * @default 'gregory'
   */
  calendar?: string
  /**
   * Update interval in milliseconds
   *
   * @default 1000
   */
  interval?: MaybeRefOrGetter<number>
  /**
   * Whether to start immediately
   *
   * @default true
   */
  immediate?: boolean
}

export interface UseTemporalReturn extends Pausable {
  /**
   * Current `Temporal.ZonedDateTime`
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
   * Convert to a different timezone
   */
  toTimezone: (timezone: string) => Temporal.ZonedDateTime
  /**
   * Convert to a different calendar
   */
  toCalendar: (calendar: string) => Temporal.ZonedDateTime
  /**
   * Get the `Temporal.PlainDate` (date only)
   */
  toPlainDate: () => Temporal.PlainDate
  /**
   * Get the `Temporal.PlainTime` (time only)
   */
  toPlainTime: () => Temporal.PlainTime
  /**
   * Get the `Temporal.PlainDateTime` (local date/time)
   */
  toPlainDateTime: () => Temporal.PlainDateTime
  /**
   * Format the current date/time
   */
  format: (options?: Intl.DateTimeFormatOptions) => string
  /**
   * Add a duration
   */
  add: (duration: Temporal.DurationLike) => Temporal.ZonedDateTime
  /**
   * Subtract a duration
   */
  subtract: (duration: Temporal.DurationLike) => Temporal.ZonedDateTime
  /**
   * Compare with another date/time
   */
  compare: (other: Temporal.ZonedDateTime | string) => number
}

function assertTemporalSupport() {
  if (typeof Temporal === 'undefined') {
    throw new Error(
      '[VueUse] `useTemporal` requires a global `Temporal` object. '
      + 'It is natively available in modern JS engines; for environments without native support, '
      + 'install a polyfill (e.g. `temporal-polyfill`) and load it before calling this function. '
      + 'See https://vueuse.org/useTemporal for details.',
    )
  }
}

/**
 * Reactive Temporal API with timezone and calendar support.
 *
 * @see https://vueuse.org/useTemporal
 * @param options - Configuration options
 */
export function useTemporal(options: UseTemporalOptions = {}): UseTemporalReturn {
  assertTemporalSupport()

  const {
    timezone: initialTimezone = 'UTC',
    calendar: initialCalendar = 'gregory',
    interval = 1000,
    immediate = true,
  } = options

  const timezone = shallowRef(initialTimezone)
  const calendar = shallowRef(initialCalendar)

  const now = shallowRef(
    Temporal.Now.zonedDateTimeISO(timezone.value).withCalendar(calendar.value),
  )

  function updateNow() {
    now.value = Temporal.Now.zonedDateTimeISO(timezone.value).withCalendar(calendar.value)
  }

  const { isActive, pause, resume } = useIntervalFn(updateNow, interval, { immediate })

  // Update immediately when timezone/calendar change, rather than waiting for the next tick
  watch([timezone, calendar], updateNow)

  const toTimezone = (tz: string) => now.value.withTimeZone(tz)
  const toCalendar = (cal: string) => now.value.withCalendar(cal)
  const toPlainDate = () => now.value.toPlainDate()
  const toPlainTime = () => now.value.toPlainTime()
  const toPlainDateTime = () => now.value.toPlainDateTime()
  const format = (formatOptions?: Intl.DateTimeFormatOptions) => now.value.toLocaleString(undefined, formatOptions)
  const add = (duration: Temporal.DurationLike) => now.value.add(duration)
  const subtract = (duration: Temporal.DurationLike) => now.value.subtract(duration)
  const compare = (other: Temporal.ZonedDateTime | string) => Temporal.ZonedDateTime.compare(now.value, other)

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
    isActive,
    pause,
    resume,
  }
}

export interface CreateTemporalReturn {
  /**
   * The resolved `Temporal.ZonedDateTime`
   */
  zonedDateTime: ComputedRef<Temporal.ZonedDateTime>
  /**
   * Convert to a different timezone
   */
  toTimezone: (timezone: string) => Temporal.ZonedDateTime
  /**
   * Convert to a different calendar
   */
  toCalendar: (calendar: string) => Temporal.ZonedDateTime
  /**
   * Get the `Temporal.PlainDate` (date only)
   */
  toPlainDate: () => Temporal.PlainDate
  /**
   * Get the `Temporal.PlainTime` (time only)
   */
  toPlainTime: () => Temporal.PlainTime
  /**
   * Get the `Temporal.PlainDateTime` (local date/time)
   */
  toPlainDateTime: () => Temporal.PlainDateTime
  /**
   * Format the resolved date/time
   */
  format: (options?: Intl.DateTimeFormatOptions) => string
}

/**
 * Create a static, computed Temporal date/time utility.
 *
 * @see https://vueuse.org/useTemporal
 */
export function createTemporal(
  input?: MaybeRefOrGetter<string | Temporal.ZonedDateTime | undefined>,
  timezone?: MaybeRefOrGetter<string | undefined>,
  calendar?: MaybeRefOrGetter<string | undefined>,
): CreateTemporalReturn {
  assertTemporalSupport()

  const zonedDateTime = computed(() => {
    const inputValue = toValue(input)
    const tz = toValue(timezone) || 'UTC'
    const cal = toValue(calendar) || 'gregory'

    if (!inputValue)
      return Temporal.Now.zonedDateTimeISO(tz).withCalendar(cal)

    if (typeof inputValue === 'string')
      return Temporal.ZonedDateTime.from(inputValue).withTimeZone(tz).withCalendar(cal)

    return inputValue.withTimeZone(tz).withCalendar(cal)
  })

  return {
    zonedDateTime,
    toTimezone: (tz: string) => zonedDateTime.value.withTimeZone(tz),
    toCalendar: (cal: string) => zonedDateTime.value.withCalendar(cal),
    toPlainDate: () => zonedDateTime.value.toPlainDate(),
    toPlainTime: () => zonedDateTime.value.toPlainTime(),
    toPlainDateTime: () => zonedDateTime.value.toPlainDateTime(),
    format: (formatOptions?: Intl.DateTimeFormatOptions) =>
      zonedDateTime.value.toLocaleString(undefined, formatOptions),
  }
}
