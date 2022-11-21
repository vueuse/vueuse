import type { ConfigurableFlush, MaybeRef } from '@vueuse/shared'
import { computed, ref, unref, watchEffect } from 'vue-demi'

/**
 * Timer statuses
*/
export type TimerStatus = 'RUNNING' | 'PAUSED' | 'FINISHED' | 'STOPPED'

/**
 * Supported timer formats
 * @see https://www.w3.org/TR/NOTE-datetime
 */
export type TimerFormat = 'DD:hh:mm:ss' | 'hh:mm:ss' | 'mm:ss' | 'ss'

export interface UseTimerOptions extends ConfigurableFlush {
  /**
   * Start the timer immediate after calling this function
   *
   * @default false
   */
  immediate?: boolean
  /**
   * Defines the timer format
   *
   * @default mm:ss
   */
  format?: TimerFormat
  /**
   * Callback function called on timer end
   *
   * @default mm:ss
   */
  onTimerEnd?: (...args: unknown[]) => any
}

/**
 * Reactive timer composable
 *
 * @param startSeconds
 * @param options
 */
export function useTimer(
  startSeconds: MaybeRef<number>,
  options?: UseTimerOptions,
) {
  let intervalId: ReturnType<typeof setInterval> | null = null
  const secondsLeft = ref(unref(startSeconds))
  const seconds = ref(0)
  const minutes = ref(0)
  const hours = ref(0)
  const days = ref(0)
  const status = ref<TimerStatus>('STOPPED')
  const { onTimerEnd, immediate = false, format = 'mm:ss', flush = 'pre' } = options ?? {}

  watchEffect(() => {
    seconds.value = secondsLeft.value % 60
    minutes.value = Math.floor((secondsLeft.value % (60 * 60)) / 60)
    hours.value = Math.floor((secondsLeft.value % (60 * 60 * 24)) / (60 * 60))
    days.value = Math.floor(secondsLeft.value / (60 * 60 * 24))
  }, { flush })

  function padValue(timeframe: number) {
    return String(timeframe).padStart(2, '0')
  }

  const timer = computed(() => {
    const timerFormats = {
      'DD:hh:mm:ss': [days.value, hours.value, minutes.value, seconds.value],
      'hh:mm:ss': [hours.value, minutes.value, seconds.value],
      'mm:ss': [minutes.value, seconds.value],
      'ss': [seconds.value],
    }
    const timeframes = timerFormats[format] || []
    return timeframes.map(padValue).join(':')
  })

  function handleTimerStart() {
    intervalId = setInterval(() => {
      secondsLeft.value -= 1
      if (secondsLeft.value <= 0)
        handleTimeover()
    }, 1000)
  }

  function handleTimerStop() {
    if (intervalId)
      clearInterval(intervalId)
  }

  function handleTimeover() {
    handleTimerStop()
    status.value = 'FINISHED'
    if (onTimerEnd)
      onTimerEnd()
  }

  function handleTimerReset() {
    secondsLeft.value = unref(startSeconds)
  }

  function start() {
    if (status.value === 'RUNNING')
      return
    if (status.value === 'FINISHED')
      handleTimerReset()
    status.value = 'RUNNING'
    handleTimerStart()
  }

  function pause() {
    if (status.value !== 'RUNNING')
      return
    handleTimerStop()
    status.value = 'PAUSED'
  }

  function reset() {
    handleTimerStop()
    status.value = 'STOPPED'
    handleTimerReset()
  }

  if (immediate)
    start()

  return { start, pause, reset, status, timer, seconds, minutes, hours, days }
}
