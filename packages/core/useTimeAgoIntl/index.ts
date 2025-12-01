import type { Pausable } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { useNow } from '../useNow'

type Locale = Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale

export interface FormatTimeAgoIntlOptions {
  /**
   * The locale to format with
   *
   * @default undefined
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat#locales
   */
  locale?: Locale

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat#options
   */
  relativeTimeFormatOptions?: Intl.RelativeTimeFormatOptions

  /**
   * Whether to insert spaces between parts.
   *
   * Ignored if `joinParts` is provided.
   *
   * @default true
   */
  insertSpace?: boolean

  /**
   * Custom function to join the parts returned by `Intl.RelativeTimeFormat.formatToParts`.
   *
   * If provided, it will be used instead of the default join logic.
   */
  joinParts?: (parts: Intl.RelativeTimeFormatPart[], locale?: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale) => string

  /**
   * Custom units
   */
  units?: TimeAgoUnit[]
}

export interface UseTimeAgoIntlOptions<Controls extends boolean> extends FormatTimeAgoIntlOptions {
  /**
   * Expose more controls and the raw `parts` result.
   *
   * @default false
   */
  controls?: Controls

  /**
   * Update interval in milliseconds, set 0 to disable auto update
   *
   * @default 30_000
   */
  updateInterval?: number
}

type UseTimeAgoReturn<Controls extends boolean = false>
  = Controls extends true
    ? { timeAgoIntl: ComputedRef<string>, parts: ComputedRef<Intl.RelativeTimeFormatPart[]> } & Pausable
    : ComputedRef<string>

export interface TimeAgoUnit {
  name: Intl.RelativeTimeFormatUnit
  ms: number
}

const UNITS: TimeAgoUnit[] = [
  { name: 'year', ms: 31_536_000_000 },
  { name: 'month', ms: 2_592_000_000 },
  { name: 'week', ms: 604_800_000 },
  { name: 'day', ms: 86_400_000 },
  { name: 'hour', ms: 3_600_000 },
  { name: 'minute', ms: 60_000 },
  { name: 'second', ms: 1_000 },
]

/**
 * A reactive wrapper for `Intl.RelativeTimeFormat`.
 */
export function useTimeAgoIntl(time: MaybeRefOrGetter<Date | number | string>, options?: UseTimeAgoIntlOptions<false>): UseTimeAgoReturn<false>
export function useTimeAgoIntl(time: MaybeRefOrGetter<Date | number | string>, options: UseTimeAgoIntlOptions<true>): UseTimeAgoReturn<true>
export function useTimeAgoIntl(time: MaybeRefOrGetter<Date | number | string>, options: UseTimeAgoIntlOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    updateInterval = 30_000,
  } = options

  const { now, ...controls } = useNow({ interval: updateInterval, controls: true })

  const result = computed(() =>
    getTimeAgoIntlResult(new Date(toValue(time)), options, toValue(now)),
  )

  const parts = computed(() => result.value.parts)
  const timeAgoIntl = computed(() =>
    formatTimeAgoIntlParts(parts.value, {
      ...options,
      locale: result.value.resolvedLocale,
    }),
  )

  return exposeControls
    ? { timeAgoIntl, parts, ...controls }
    : timeAgoIntl
}

/**
 * Non-reactive version of useTimeAgoIntl
 */
export function formatTimeAgoIntl(
  from: Date,
  options: FormatTimeAgoIntlOptions = {},
  now: Date | number = Date.now(),
): string {
  const { parts, resolvedLocale } = getTimeAgoIntlResult(from, options, now)
  return formatTimeAgoIntlParts(parts, {
    ...options,
    locale: resolvedLocale,
  })
}

/**
 * Get parts from `Intl.RelativeTimeFormat.formatToParts`.
 */
function getTimeAgoIntlResult(
  from: Date,
  options: FormatTimeAgoIntlOptions = {},
  now: Date | number = Date.now(),
): { parts: Intl.RelativeTimeFormatPart[], resolvedLocale: Locale } {
  const {
    locale,
    relativeTimeFormatOptions = { numeric: 'auto' },
  } = options

  const rtf = new Intl.RelativeTimeFormat(locale, relativeTimeFormatOptions)
  const { locale: resolvedLocale } = rtf.resolvedOptions()

  const diff = +from - +now
  const absDiff = Math.abs(diff)

  const units = options.units ?? UNITS
  for (const { name, ms } of units) {
    if (absDiff >= ms) {
      return {
        resolvedLocale,
        parts: rtf.formatToParts(Math.round(diff / ms), name),
      }
    }
  }

  return {
    resolvedLocale,
    parts: rtf.formatToParts(0, units[units.length - 1].name),
  }
}

/**
 * Format parts into a string
 */
export function formatTimeAgoIntlParts(
  parts: Intl.RelativeTimeFormatPart[],
  options: FormatTimeAgoIntlOptions = {},
): string {
  const {
    insertSpace = true,
    joinParts,
    locale,
  } = options

  if (typeof joinParts === 'function')
    return joinParts(parts, locale)

  if (!insertSpace)
    return parts.map(part => part.value).join('')

  return parts
    .map(part => part.value.trim())
    .join(' ')
}
