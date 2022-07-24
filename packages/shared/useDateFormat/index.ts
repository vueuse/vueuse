import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import { computed } from 'vue-demi'

export type DateLike = Date | number | string | undefined

export interface UseDateFormatOptions {
  /**
   * The locale(s) to use
   */
  locales?: Intl.LocalesArgument
}

const REGEX_PARSE = /* #__PURE__ */ /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
const REGEX_FORMAT = /* #__PURE__ */ /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g

export const formatDate = (date: Date, formatStr: string, locales?: Intl.LocalesArgument) => {
  const years = date.getFullYear()
  const month = date.getMonth()
  const days = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()
  const day = date.getDay()
  const matches: Record<string, () => string | number> = {
    YY: () => String(years).slice(-2),
    YYYY: () => years,
    M: () => month + 1,
    MM: () => `${month + 1}`.padStart(2, '0'),
    D: () => String(days),
    DD: () => `${days}`.padStart(2, '0'),
    H: () => String(hours),
    HH: () => `${hours}`.padStart(2, '0'),
    h: () => `${hours % 12 || 12}`.padStart(1, '0'),
    hh: () => `${hours % 12 || 12}`.padStart(2, '0'),
    m: () => String(minutes),
    mm: () => `${minutes}`.padStart(2, '0'),
    s: () => String(seconds),
    ss: () => `${seconds}`.padStart(2, '0'),
    SSS: () => `${milliseconds}`.padStart(3, '0'),
    d: () => day,
    dd: () => date.toLocaleDateString(locales, { weekday: 'narrow' }),
    ddd: () => date.toLocaleDateString(locales, { weekday: 'short' }),
    dddd: () => date.toLocaleDateString(locales, { weekday: 'long' }),
  }
  return formatStr.replace(REGEX_FORMAT, (match, $1) => $1 || matches[match]())
}

export const normalizeDate = (date: DateLike) => {
  if (date === null)
    return new Date(NaN) // null is invalid
  if (date === undefined)
    return new Date()
  if (date instanceof Date)
    return new Date(date)
  if (typeof date === 'string' && !/Z$/i.test(date)) {
    const d = date.match(REGEX_PARSE) as any
    if (d) {
      const m = d[2] - 1 || 0
      const ms = (d[7] || '0').substring(0, 3)
      return new Date(d[1], m, d[3]
        || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms)
    }
  }

  return new Date(date!)
}

/**
 * Get the formatted date according to the string of tokens passed in.
 *
 * @see https://vueuse.org/useDateFormat
 * @param date
 * @param formatStr
 * @param options
 */

export function useDateFormat(date: MaybeComputedRef<DateLike>, formatStr: MaybeComputedRef<string> = 'HH:mm:ss', options: UseDateFormatOptions = {}) {
  return computed(() => formatDate(normalizeDate(resolveUnref(date)), resolveUnref(formatStr), options?.locales))
}

export type UseDateFormatReturn = ReturnType<typeof useDateFormat>
