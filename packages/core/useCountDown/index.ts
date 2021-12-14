// reference https://github.com/youzan/vant/blob/dev/packages/vant-use/src/useCountDown/index.ts
import { isClient } from '@vueuse/shared'
import {
  ref,
  computed,
} from 'vue-demi'
import { useRafFn } from '../useRafFn'

export type CurrentTime = {
  days: number
  hours: number
  total: number
  minutes: number
  seconds: number
  milliseconds: number
}

export type UseCountDownOptions = {
  time: number
  millisecond?: boolean
  format?: string
  onChange?: (current: CurrentTime) => void
  onFinish?: () => void
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function parseTime(time: number): CurrentTime {
  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE)
  const seconds = Math.floor((time % MINUTE) / SECOND)
  const milliseconds = Math.floor(time % SECOND)

  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  }
}

function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
}

/**
 * CountDown controller
 *
 * @see https://vueuse.org/useCountDown
 * @param options
 */
export function useCountDown(options: UseCountDownOptions) {
  let endTime: number
  let counting: boolean

  const remain = ref(options.time)
  const current = computed(() => parseTime(remain.value))
  const formatted = computed(() => parseFormat(options.format || 'HH:mm:ss', current.value))

  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0)

  const pausable = useRafFn(() => {
    const remainRemain = getCurrentRemain()

    if (options.millisecond || !isSameSecond(remainRemain, remain.value) || remainRemain === 0)
      setRemain(remainRemain)

    if (remain.value <= 0)
      pausable!.pause()
  }, { immediate: false })

  function pause() {
    counting = false
    pausable.pause()
  }

  function setRemain(value: number) {
    remain.value = value
    options.onChange?.(current.value)

    if (value === 0) {
      pausable.pause()
      options.onFinish?.()
    }
  }

  function tick() {
    if (!isClient)
      return

    pausable.resume()
  }

  function start() {
    if (!counting) {
      endTime = Date.now() + remain.value
      counting = true
      tick()
    }
  }

  function reset(totalTime: number = options.time) {
    pause()
    remain.value = totalTime
  }

  return {
    start,
    pause,
    reset,
    current,
    formatted,
  }
}

export function parseFormat(format: string, currentTime: CurrentTime): string {
  const { days } = currentTime
  let { hours, minutes, seconds, milliseconds } = currentTime

  if (format.includes('DD'))
    format = format.replace('DD', padZero(days, 2))

  else
    hours += days * 24

  if (format.includes('HH'))
    format = format.replace('HH', padZero(hours, 2))

  else
    minutes += hours * 60

  if (format.includes('mm'))
    format = format.replace('mm', padZero(minutes, 2))

  else
    seconds += minutes * 60

  if (format.includes('ss'))
    format = format.replace('ss', padZero(seconds, 2))

  else
    milliseconds += seconds * 1000

  if (format.includes('S')) {
    const ms = padZero(milliseconds, 3)

    if (format.includes('SSS'))
      format = format.replace('SSS', ms)

    else if (format.includes('SS'))
      format = format.replace('SS', ms.slice(0, 2))

    else
      format = format.replace('S', ms.charAt(0))
  }

  return format
}

function padZero(num: number | string, len: number): string {
  return num.toString().padStart(len, '0')
}
