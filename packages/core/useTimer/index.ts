import { computed, ref, unref, watchEffect } from 'vue-demi'
import type { MaybeRef } from '../../shared/utils/types'

export interface UseTimerOptions {
  /**
   * Start the timer immediate after calling this function
   *
   * @default false
   */
  immediate?: boolean
}

export type TimerStatus = 'RUNNING' | 'PAUSED' | 'FINISHED' | 'STOPPED'

/**
 * Timer with callback option
 *
 * @param startSeconds
 * @param callback
 * @param options
 */
export function useTimer(
  startSeconds: MaybeRef<number>,
  callback?: (...args: unknown[]) => any,
  options?: UseTimerOptions,
) {
  const intervalId = ref<number>()
  const secondsLeft = ref(unref(startSeconds))
  const seconds = ref(0)
  const minutes = ref(0)
  const hours = ref(0)
  const days = ref(0)
  const status = ref<TimerStatus>('STOPPED')

  const padValue = (timeframe: number) => String(timeframe).padStart(2, '0')

  const timer = computed(() => [
    hours.value, minutes.value, seconds.value,
  ].map((padValue)).join(':'))

  watchEffect(() => {
    seconds.value = secondsLeft.value % 60
    minutes.value = Math.floor((secondsLeft.value % (60 * 60)) / 60)
    hours.value = Math.floor((secondsLeft.value % (60 * 60 * 24)) / (60 * 60))
    days.value = Math.floor(secondsLeft.value / (60 * 60 * 24))
  })

  function handleTimerStart() {
    intervalId.value = window.setInterval(() => {
      secondsLeft.value -= 1
      if (secondsLeft.value <= 0)
        handleTimeover()
    }, 1000)
  }

  function handleTimerStop() {
    clearInterval(intervalId.value)
  }

  function handleTimeover() {
    handleTimerStop()
    status.value = 'FINISHED'
    if (callback)
      callback()
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
    handleTimerStop()
    status.value = 'PAUSED'
  }

  function reset() {
    handleTimerStop()
    status.value = 'STOPPED'
    handleTimerReset()
  }

  if (options?.immediate)
    start()

  return { start, pause, reset, status, timer, seconds, minutes, hours, days }
}
