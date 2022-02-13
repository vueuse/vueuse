import type { MaybeRef } from '@vueuse/shared'
import { computed, unref } from 'vue-demi'

export type UDate = Date | number | string | undefined

const REGEX_PARSE = /* #__PURE__ */ /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
const REGEX_FORMAT = /* #__PURE__ */ /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g

export const padStart = (string: number, length: number, pad: string) => {
  const s = String(string)
  if (!s || s.length >= length) return string
  return `${Array((length + 1) - s.length).join(pad)}${string}`
}

export const formatDate = (date: Date, formatStr: string) => {
  const years = date.getFullYear()
  const month = date.getMonth()
  const days = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()
  const matches: Record<string, string|number> = {
    YY: String(years).slice(-2),
    YYYY: years,
    M: month + 1,
    MM: padStart(month + 1, 2, '0'),
    D: String(days),
    DD: padStart(days, 2, '0'),
    H: String(hours),
    HH: padStart(hours, 2, '0'),
    h: padStart(hours % 12 || 12, 1, '0'),
    hh: padStart(hours % 12 || 12, 2, '0'),
    m: String(minutes),
    mm: padStart(minutes, 2, '0'),
    s: String(seconds),
    ss: padStart(seconds, 2, '0'),
    SSS: padStart(milliseconds, 3, '0'),
  }
  return formatStr.replace(REGEX_FORMAT, (match, $1) => $1 || matches[match])
}

export const parseDate = (date: UDate) => {
  if (date === null) return new Date(NaN) // null is invalid
  if (date === undefined) return new Date()
  if (date instanceof Date) return new Date(date)
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
 */

export function useDateFormat(date: MaybeRef<UDate>, formatStr: MaybeRef<string> = 'HH:mm:ss') {
  return computed(() => formatDate(parseDate(unref(date)), unref(formatStr)))
}

export type UseDateFormatReturn = ReturnType<typeof useDateFormat>
