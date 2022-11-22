import { type ComputedRef, computed } from 'vue-demi'
import { type MaybeComputedRef, resolveRef } from '@vueuse/shared'

const msSecond = 1000
const secMinute = 60
const minHour = 60
const hrDay = 24
const msMinute = msSecond * secMinute // 60,000
const msHour = msMinute * minHour // 3,600,000
const msDay = msHour * hrDay // 86,400,000

export interface TimeSpan {
  totalMilliseconds: ComputedRef<number>
  totalSeconds: ComputedRef<number>
  totalMinutes: ComputedRef<number>
  totalHours: ComputedRef<number>
  totalDays: ComputedRef<number>
  milliseconds: ComputedRef<number>
  seconds: ComputedRef<number>
  minutes: ComputedRef<number>
  hours: ComputedRef<number>
  days: ComputedRef<number>
  formatted: ComputedRef<string>
}

const REGEX_LITERAL = /'([^']+)'/
const REGEX_SYMBOLS = /[+-]|d+|h{1,2}|m{1,2}|s{1,2}|f{1,3}/
const REGEX_FORMAT = new RegExp(`${REGEX_LITERAL.source}|${REGEX_SYMBOLS.source}`, 'g')
const REGEX_OPT_FORMAT = new RegExp(`\\[(?:${REGEX_LITERAL.source})?(${REGEX_SYMBOLS.source})(?:${REGEX_LITERAL.source})?]`, 'g')

const matches: Record<string, (ts: TimeSpan, pad: number, opt?: boolean) => string> = {
  '+': (ts, _) => (ts.totalMilliseconds.value >= 0) ? '+' : '-',
  '-': (ts, _) => (ts.totalMilliseconds.value < 0) ? '-' : '',
  'd': (ts, pad, opt) => (!opt || Math.abs(ts.totalDays.value) > 1) ? String(Math.abs(ts.days.value)).padStart(pad, '0') : '',
  'h': (ts, pad, opt) => (!opt || Math.abs(ts.totalHours.value) > 1) ? String(Math.abs(ts.hours.value)).padStart(pad, '0') : '',
  'm': (ts, pad, opt) => (!opt || Math.abs(ts.totalMinutes.value) > 1) ? String(Math.abs(ts.minutes.value)).padStart(pad, '0') : '',
  's': (ts, pad, opt) => (!opt || Math.abs(ts.totalSeconds.value) > 1) ? String(Math.abs(ts.seconds.value)).padStart(pad, '0') : '',
  'f': (ts, pad, opt) => {
    const ms = String(Math.abs(ts.milliseconds.value)).padStart(3, '0').slice(0, pad)
    return (!opt || !/^0+$/.test(ms)) ? ms : ''
  },
}

export const formatTimeSpan = (ts: TimeSpan, formatStr: string) => {
  return formatStr.replace(REGEX_OPT_FORMAT, (_, $1, $2, $3) => {
    const f = matches[$2[0]](ts, $2.length, true)
    return f ? `${$1 ?? ''}${f}${$3 ?? ''}` : ''
  }).replace(REGEX_FORMAT, (match, $1) => $1 || matches[match[0]](ts, match.length))
}

/**
 * Get reactive TimeSpan object that represents a time interval value
 * in days, hours, minutes, seconds, and fractions of a second.
 *
 * @param milliseconds A time period expressed in milliseconds
 * @returns TimeSpan object
 */
export function useTimeSpan(milliseconds: MaybeComputedRef<number>): TimeSpan {
  const ms = resolveRef(milliseconds)
  const totalSeconds = computed(() => ms.value / msSecond)
  const totalMinutes = computed(() => ms.value / msMinute)
  const totalHours = computed(() => ms.value / msHour)
  const totalDays = computed(() => ms.value / msDay)

  const ts: TimeSpan = {
    totalMilliseconds: ms,
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    milliseconds: computed(() => ms.value % msSecond),
    seconds: computed(() => Math.trunc(totalSeconds.value) % secMinute),
    minutes: computed(() => Math.trunc(totalMinutes.value) % minHour),
    hours: computed(() => Math.trunc(totalHours.value) % hrDay),
    days: computed(() => Math.trunc(totalDays.value)),
    formatted: computed(() => formatTimeSpan(ts, '-[d\'.\']hh\':\'mm\':\'ss[\'.\'ff]')),
  }

  return ts
}
