import { type ComputedRef, computed } from 'vue-demi'
import { type MaybeComputedRef, resolveRef } from '@vueuse/shared'

const
  msSecond = 1000
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

function format(ts: TimeSpan) {
  let str = ''
  const isNegative = (ts.totalMilliseconds.value < 0)
  const d = Math.abs(ts.days.value)
  const h = Math.abs(ts.hours.value)
  const m = Math.abs(ts.minutes.value)
  const s = Math.abs(ts.seconds.value)
  const f = Math.abs(ts.milliseconds.value)

  if (isNegative)
    str += '-'
  if (d)
    str += `${d.toString().padStart(2, '0')}.`
  if (h || d)
    str += `${h.toString().padStart(2, '0')}:`
  str += `${m.toString().padStart(2, '0')}:`
  str += `${s.toString().padStart(2, '0')}`
  if (f)
    str += `.${f.toString().slice(0, 2).padEnd(2, '0')}`

  return str
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
    formatted: computed(() => format(ts)),
  }

  return ts
}
