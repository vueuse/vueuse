import { MaybeRef, Pausable } from '@vueuse/shared'
import { computed, ComputedRef, unref } from 'vue-demi'
import { useNow } from '../useNow'

export type UseTimeAgoFormatter<T = number> = (value: T, isPast: boolean) => string

export interface UseTimeAgoMessages {
  justNow: string
  past: string | UseTimeAgoFormatter<string>
  future: string | UseTimeAgoFormatter<string>
  year: string | UseTimeAgoFormatter<number>
  month: string | UseTimeAgoFormatter<number>
  day: string | UseTimeAgoFormatter<number>
  week: string | UseTimeAgoFormatter<number>
  hour: string | UseTimeAgoFormatter<number>
  minute: string | UseTimeAgoFormatter<number>
  second: string | UseTimeAgoFormatter<number>
}

export interface UseTimeAgoOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Intervals to update, set 0 to disable auto update
   *
   * @default 30_000
   */
  updateInterval?: number

  /**
   * Maximum unit (of diff in milliseconds) to display the full date instead of relative
   *
   * @default undefined
   */
  max?: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' | number

  /**
   * Formatter for full date
   */
  fullDateFormatter?: (date: Date) => string

  /**
   * Messages for formating the string
   */
  messages?: UseTimeAgoMessages
}

interface UseTimeAgoUnit {
  max: number
  value: number
  name: keyof UseTimeAgoMessages
}

const UNITS: UseTimeAgoUnit[] = [
  { max: 60000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Infinity, value: 31536000000, name: 'year' },
]

const DEFAULT_MESSAGES: UseTimeAgoMessages = {
  justNow: 'just now',
  past: n => n.match(/\d/) ? `${n} ago` : n,
  future: n => n.match(/\d/) ? `in ${n}` : n,
  month: (n, past) => n === 1
    ? past
      ? 'last month'
      : 'next month'
    : `${n} month${n > 1 ? 's' : ''}`,
  year: (n, past) => n === 1
    ? past
      ? 'last year'
      : 'next year'
    : `${n} year${n > 1 ? 's' : ''}`,
  day: (n, past) => n === 1
    ? past
      ? 'yesterday'
      : 'tomorrow'
    : `${n} day${n > 1 ? 's' : ''}`,
  week: (n, past) => n === 1
    ? past
      ? 'last week'
      : 'next week'
    : `${n} week${n > 1 ? 's' : ''}`,
  hour: n => `${n} hour${n > 1 ? 's' : ''}`,
  minute: n => `${n} minute${n > 1 ? 's' : ''}`,
  second: n => `${n} second${n > 1 ? 's' : ''}`,
}

const DEFAULT_FORMATTER = (date: Date) => date.toISOString().slice(0, 10)

/**
 * Reactive time ago formatter.
 *
 * @see https://vueuse.org/useTimeAgo
 * @param options
 */
export function useTimeAgo(time: MaybeRef<Date | number | string>, options?: UseTimeAgoOptions<false>): ComputedRef<string>
export function useTimeAgo(time: MaybeRef<Date | number | string>, options: UseTimeAgoOptions<true>): { timeAgo: ComputedRef<string> } & Pausable
export function useTimeAgo(time: MaybeRef<Date | number | string>, options: UseTimeAgoOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    max,
    updateInterval = 30_000,
    messages = DEFAULT_MESSAGES,
    fullDateFormatter = DEFAULT_FORMATTER,
  } = options

  const { abs, round } = Math
  const { now, ...controls } = useNow({ interval: updateInterval, controls: true })

  function getTimeago(from: Date, now: Date) {
    const diff = +now - +from
    const absDiff = abs(diff)

    // less than a minute
    if (absDiff < 60000)
      return messages.justNow

    if (typeof max === 'number' && absDiff > max)
      return fullDateFormatter(new Date(from))

    if (typeof max === 'string') {
      const unitMax = UNITS.find(i => i.name === max)?.max
      if (unitMax && absDiff > unitMax)
        return fullDateFormatter(new Date(from))
    }

    for (const unit of UNITS) {
      if (absDiff < unit.max)
        return format(diff, unit)
    }
  }

  function applyFormat(name: keyof UseTimeAgoMessages, val: number | string, isPast: boolean) {
    const formatter = messages[name]
    if (typeof formatter === 'function')
      return formatter(val as never, isPast)
    return formatter.replace('{0}', val.toString())
  }

  function format(diff: number, unit: UseTimeAgoUnit) {
    const val = round(abs(diff) / unit.value)
    const past = diff > 0

    const str = applyFormat(unit.name, val, past)
    return applyFormat(past ? 'past' : 'future', str, past)
  }

  const timeAgo = computed(() => getTimeago(new Date(unref(time)), unref(now.value)))

  if (exposeControls) {
    return {
      timeAgo,
      ...controls,
    }
  }
  else {
    return timeAgo
  }
}
