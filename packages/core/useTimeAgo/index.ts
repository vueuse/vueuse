import { MaybeRef } from '@vueuse/shared'
import { computed, unref } from 'vue-demi'
import { useNow } from '../useNow'

export type MessageFormatter<T = number> = (value: T, isPast: boolean) => string

export interface TimeAgoMessages {
  justNow: string
  past: string | MessageFormatter<string>
  future: string | MessageFormatter<string>
  year: string | MessageFormatter<number>
  month: string | MessageFormatter<number>
  day: string | MessageFormatter<number>
  week: string | MessageFormatter<number>
  hour: string | MessageFormatter<number>
  minute: string | MessageFormatter<number>
  second: string | MessageFormatter<number>
}

export interface TimeAgoOptions {
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
  messages?: TimeAgoMessages
}

interface Unit {
  max: number
  value: number
  name: keyof TimeAgoMessages
}

const UNITS: Unit[] = [
  { max: 90000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Infinity, value: 31536000000, name: 'year' },
]

const DEFAULT_MESSAGES: TimeAgoMessages = {
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
 * @see   {@link https://vueuse.org/useTimeAgo}
 * @param options
 */
export function useTimeAgo(
  time: MaybeRef<Date | number | string>,
  options: TimeAgoOptions = {},
) {
  const {
    max,
    updateInterval = 30_000,
    messages = DEFAULT_MESSAGES,
    fullDateFormatter = DEFAULT_FORMATTER,
  } = options

  const { abs, round } = Math
  const { now } = useNow({ interval: updateInterval })

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

  function applyFormat(name: keyof TimeAgoMessages, val: number | string, isPast: boolean) {
    const formatter = messages[name]
    if (typeof formatter === 'function')
      return formatter(val as never, isPast)
    return formatter.replace('{0}', val.toString())
  }

  function format(diff: number, unit: Unit) {
    const val = round(abs(diff) / unit.value)
    const past = diff > 0

    const str = applyFormat(unit.name, val, past)
    return applyFormat(past ? 'past' : 'future', str, past)
  }

  return computed(() => getTimeago(new Date(unref(time)), unref(now.value)))
}
