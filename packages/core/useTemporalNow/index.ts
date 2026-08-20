import type { Pausable } from '@vueuse/shared'
import type { Ref } from 'vue'
import type { ConfigurableScheduler } from '../_configurable'
import { shallowRef, watch } from 'vue'
import { useRafFn } from '../useRafFn'

export interface UseTemporalNowOptions extends ConfigurableScheduler {
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
   * Custom `Temporal` implementation to use, e.g. the `Temporal` export from
   * `@js-temporal/polyfill` or another polyfill, instead of relying on the
   * global `Temporal` object.
   *
   * @default globalThis.Temporal
   */
  temporal?: typeof Temporal
}

export interface UseTemporalNowReturn extends Pausable {
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

function resolveTemporal(custom?: typeof Temporal): typeof Temporal | undefined {
  if (custom)
    return custom
  return typeof Temporal === 'undefined' ? undefined : Temporal
}

function assertTemporal(impl: typeof Temporal | undefined): typeof Temporal {
  if (!impl)
    throw new Error('[VueUse] No `Temporal` implementation found. See https://vueuse.org/useTemporalNow for details.')
  return impl
}

/**
 * Reactive Temporal API with timezone and calendar support.
 *
 * @see https://vueuse.org/useTemporalNow
 * @param options - Configuration options
 */
export function useTemporalNow(options: UseTemporalNowOptions = {}): UseTemporalNowReturn {
  const {
    timezone: initialTimezone = 'UTC',
    calendar: initialCalendar = 'gregory',
    scheduler = useRafFn,
    temporal: customTemporal,
  } = options

  const TemporalImpl = assertTemporal(resolveTemporal(customTemporal))

  const timezone = shallowRef(initialTimezone)
  const calendar = shallowRef(initialCalendar)

  const now = shallowRef(
    TemporalImpl.Now.zonedDateTimeISO(timezone.value).withCalendar(calendar.value),
  )

  function updateNow() {
    now.value = TemporalImpl.Now.zonedDateTimeISO(timezone.value).withCalendar(calendar.value)
  }

  const { isActive, pause, resume } = scheduler(updateNow)

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
  const compare = (other: Temporal.ZonedDateTime | string) => TemporalImpl.ZonedDateTime.compare(now.value, other)

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
