import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

export type DateLike = Date | number | string | undefined

export interface UseDateFormatOptions {
  /**
   * The locale(s) to used for dd/ddd/dddd/MMM/MMMM format
   *
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).
   */
  locales?: Intl.LocalesArgument

  /**
   * A custom function to re-modify the way to display meridiem
   *
   */
  customMeridiem?: (hours: number, minutes: number, isLowercase?: boolean, hasPeriod?: boolean) => string
}

const REGEX_PARSE = /* #__PURE__ */ /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
const REGEX_FORMAT = /* #__PURE__ */ /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a{1,2}|A{1,2}|m{1,2}|s{1,2}|Z{1,2}|SSS/g

const defaultMeridiem = (hours: number, minutes: number, isLowercase?: boolean, hasPeriod?: boolean) => {
  let m = (hours < 12 ? 'AM' : 'PM')
  if (hasPeriod)
    m = m.split('').reduce((acc, curr) => acc += `${curr}.`, '')
  return isLowercase ? m.toLowerCase() : m
}

export const formatDate = (date: Date, formatStr: string, options: UseDateFormatOptions = {}) => {
  const years = date.getFullYear()
  const month = date.getMonth()
  const days = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()
  const day = date.getDay()
  const meridiem = options.customMeridiem ?? defaultMeridiem
  const matches: Record<string, () => string | number> = {
    YY: () => String(years).slice(-2),
    YYYY: () => years,
    M: () => month + 1,
    MM: () => `${month + 1}`.padStart(2, '0'),
    MMM: () => date.toLocaleDateString(options.locales, { month: 'short' }),
    MMMM: () => date.toLocaleDateString(options.locales, { month: 'long' }),
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
    dd: () => date.toLocaleDateString(options.locales, { weekday: 'narrow' }),
    ddd: () => date.toLocaleDateString(options.locales, { weekday: 'short' }),
    dddd: () => date.toLocaleDateString(options.locales, { weekday: 'long' }),
    A: () => meridiem(hours, minutes),
    AA: () => meridiem(hours, minutes, false, true),
    a: () => meridiem(hours, minutes, true),
    aa: () => meridiem(hours, minutes, true, true),
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

  return new Date(date)
}

/**
 * Get the formatted date according to the string of tokens passed in.
 *
 * @see https://vueuse.org/useDateFormat
 * @param date - The date to format, can either be a `Date` object, a timestamp, or a string
 * @param formatStr - The combination of tokens to format the date
 * @param options - UseDateFormatOptions
 */

export function useDateFormat(date: MaybeComputedRef<DateLike>, formatStr: MaybeComputedRef<string> = 'HH:mm:ss', options: UseDateFormatOptions = {}) {
  return computed(() => formatDate(normalizeDate(resolveUnref(date)), resolveUnref(formatStr), options))
}

export type UseDateFormatReturn = ReturnType<typeof useDateFormat>
