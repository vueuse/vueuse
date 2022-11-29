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
  toString(format?: string): string
}

// This regex will generate 2 groups and only one is defined with literal
// It could generate one group for both case ('' & \) but unfortunately
// JS doesn't support Branch Reset Group (?|...) and Safari doesn't
// support Lookbehind (?<=...)
// Branch Reset exp => (?|'([^']+)'|\\(.))
// Lookbehind exp => ((?<=')[^']+(?=')|(?<=\\).)
const REGEX_LITERAL = /(?:'([^']+)'|\\(.))/
const REGEX_SYMBOLS = /[+-]|d+|h{1,2}|m{1,2}|s{1,2}|S+|f{1,3}/
const REGEX_FORMAT = new RegExp(`${REGEX_LITERAL.source}|${REGEX_SYMBOLS.source}`, 'g')
const REGEX_OPT_FORMAT = new RegExp(`\\[${REGEX_LITERAL.source}?(${REGEX_SYMBOLS.source})${REGEX_LITERAL.source}?]`, 'g')

const matches: Record<string, (ts: TimeSpan, pad: number, opt?: boolean) => string> = {
  '+': ({ totalMilliseconds: ms }) => (ms.value >= 0) ? '+' : '-',
  '-': ({ totalMilliseconds: ms }) => (ms.value < 0) ? '-' : '',
  'd': (ts, pad, opt) => (!opt || Math.abs(ts.totalDays.value) >= 1) ? String(Math.abs(ts.days.value)).padStart(pad, '0') : '',
  'h': (ts, pad, opt) => (!opt || Math.abs(ts.totalHours.value) >= 1) ? String(Math.abs(ts.hours.value)).padStart(pad, '0') : '',
  'm': (ts, pad, opt) => (!opt || Math.abs(ts.totalMinutes.value) >= 1) ? String(Math.abs(ts.minutes.value)).padStart(pad, '0') : '',
  's': (ts, pad, opt) => (!opt || Math.abs(ts.totalSeconds.value) >= 1) ? String(Math.abs(ts.seconds.value)).padStart(pad, '0') : '',
  'S': (ts, pad, opt) => {
    const s = Math.trunc(Math.abs(ts.totalSeconds.value))
    return (!opt || s >= 1) ? String(s).padStart(pad, '0') : ''
  },
  'f': (ts, pad, opt) => {
    const ms = String(Math.abs(ts.milliseconds.value)).padStart(3, '0').slice(0, pad)
    return (!opt || !/^0+$/.test(ms)) ? ms : ''
  },
}

export const formatTimeSpan = (ts: TimeSpan, formatStr: string) => {
  return formatStr.replace(REGEX_OPT_FORMAT, (_, $1, $2, $3, $4, $5) => {
    const f = matches[$3[0]](ts, $3.length, true)
    return f ? `${$1 ?? $2 ?? ''}${f}${$4 ?? $5 ?? ''}` : ''
  }).replace(REGEX_FORMAT, (match, $1, $2) => $1 || $2 || matches[match[0]](ts, match.length))
}

const REGEX_SPARSE = /^(?:(\d+(?:\.\d+)?)d)?(?:(\d+(?:\.\d+)?)h)?(?:(\d+(?:\.\d+)?)m)?(?:(\d+(?:\.\d+)?)s)?(?:(\d+(?:\.\d+)?)ms)?$/i
const REGEX_TPARSE = /^(?:(?:(\d+)(?:\.|:))?(\d{1,2}):)?(\d{1,2}):(\d{1,2})(?:(?:\.|:)(\d+))?$/

/**
 * Get reactive TimeSpan object that represents a time interval value
 * in days, hours, minutes, seconds, and fractions of a second.
 *
 * @param milliseconds A time period expressed in milliseconds
 * @returns TimeSpan object
 */
export function useTimeSpan(milliseconds: MaybeComputedRef<number>): TimeSpan
export function useTimeSpan(minutes: number, seconds: number): TimeSpan
export function useTimeSpan(hours: number, minutes: number, seconds: number): TimeSpan
export function useTimeSpan(days: number, hours: number, minutes: number, seconds: number): TimeSpan
export function useTimeSpan(days: number, hours: number, minutes: number, seconds: number, milliseconds: number): TimeSpan
export function useTimeSpan(value: MaybeComputedRef<number>, ...args: number[]): TimeSpan {
  const ms = resolveRef((!args.length)
    ? value
    : (args.length === 1)
        ? ((value as number) * msMinute + args[0] * msSecond)
        : (args.length === 2)
            ? ((value as number) * msHour + args[0] * msMinute + args[1] * msSecond)
            : ((value as number) * msDay + args[0] * msHour + args[1] * msMinute + args[2] * msSecond + (args[3] ?? 0)))

  const ts: TimeSpan = {
    totalMilliseconds: ms,
    totalSeconds: computed(() => ms.value / msSecond),
    totalMinutes: computed(() => ms.value / msMinute),
    totalHours: computed(() => ms.value / msHour),
    totalDays: computed(() => ms.value / msDay),
    milliseconds: computed(() => ms.value % msSecond),
    seconds: computed(() => Math.trunc(ts.totalSeconds.value) % secMinute),
    minutes: computed(() => Math.trunc(ts.totalMinutes.value) % minHour),
    hours: computed(() => Math.trunc(ts.totalHours.value) % hrDay),
    days: computed(() => Math.trunc(ts.totalDays.value)),
    formatted: computed(() => ts.toString()),
    toString(format = '-[d\\.][hh\\:]mm:ss[\\.ff]') {
      return formatTimeSpan(ts, format)
    },
  }

  return ts
}

function fromNum(value: MaybeComputedRef<number>, scale: number) {
  const val = resolveRef(value)
  return useTimeSpan(() => val.value * scale)
}

useTimeSpan.fromSeconds = (value: MaybeComputedRef<number>) => fromNum(value, msSecond)
useTimeSpan.fromMinutes = (value: MaybeComputedRef<number>) => fromNum(value, msMinute)
useTimeSpan.fromHours = (value: MaybeComputedRef<number>) => fromNum(value, msHour)
useTimeSpan.fromDays = (value: MaybeComputedRef<number>) => fromNum(value, msDay)

useTimeSpan.parse = (str: string) => {
  const num = Number(str)
  if (Number.isNaN(num)) {
    const match = str.match(REGEX_SPARSE) ?? str.match(REGEX_TPARSE)
    if (match)
      return useTimeSpan(Number(match[1] ?? 0), Number(match[2] ?? 0), Number(match[3] ?? 0), Number(match[4] ?? 0), Number(match[5] ?? 0))
  }

  return useTimeSpan(num)
}
