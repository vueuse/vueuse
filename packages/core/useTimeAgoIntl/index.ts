import type { Pausable } from '@vueuse/shared'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { useNow } from '../useNow'

export interface FormatTimeAgoIntlOptions {
  /**
   * The locale to format with
   *
   * @default undefined
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat#locales
   */
  locale?: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat#options
   */
  relativeTimeFormatOptions?: Intl.RelativeTimeFormatOptions

  /**
   * Whether to insert spaces between parts
   */
  insertSpace?: boolean
}

export interface UseTimeAgoIntlOptions<Controls extends boolean> extends FormatTimeAgoIntlOptions {
  /**
   * Expose more controls
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

type UseTimeAgoReturn<Controls extends boolean = false> = Controls extends true ? { timeAgoIntl: ComputedRef<string> } & Pausable : ComputedRef<string>

export interface TimeAgoUnit {
  name: Intl.RelativeTimeFormatUnit
  ms: number
}

const UNITS: TimeAgoUnit[] = [
  { name: 'year', ms: 31536000000 },
  { name: 'month', ms: 2592000000 },
  { name: 'week', ms: 604800000 },
  { name: 'day', ms: 86400000 },
  { name: 'hour', ms: 3600000 },
  { name: 'minute', ms: 60000 },
  { name: 'second', ms: 1000 },
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
  const timeAgoIntl = computed(() => formatTimeAgoIntl(new Date(toValue(time)), options, toValue(now)))

  return exposeControls
    ? { timeAgoIntl, ...controls }
    : timeAgoIntl
}

/**
 * Format time ago with `Intl.RelativeTimeFormat`.
 */
export function formatTimeAgoIntl(
  from: Date,
  options: FormatTimeAgoIntlOptions = {},
  now: Date | number = Date.now(),
): string {
  const {
    locale = undefined,
    relativeTimeFormatOptions = {
      numeric: 'auto',
    },
    insertSpace = true,
  } = options
  const rtf = new Intl.RelativeTimeFormat(locale, relativeTimeFormatOptions)

  const diff = +from - +now
  const absDiff = Math.abs(diff)

  let parts: Intl.RelativeTimeFormatPart[] = []
  for (const { name, ms } of UNITS) {
    if (absDiff >= ms) {
      parts = rtf.formatToParts(Math.round(diff / ms), name)
      break
    }
  }

  if (parts.length === 0)
    parts = rtf.formatToParts(0, 'second')

  return formatTimeAgoIntlParts(parts, insertSpace)
}

export function formatTimeAgoIntlParts(parts: Intl.RelativeTimeFormatPart[], insertSpace = false): string {
  if (!insertSpace)
    return parts.map(part => part.value).join('')

  return parts
    .map(part => part.value.trim())
    .join(' ')
}
