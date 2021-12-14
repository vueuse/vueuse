import { ref, computed } from 'vue-demi'
import { noop, timestamp, useIntervalFn, parseDate, parseMs, formatDate, UDate } from '@vueuse/shared'

export interface UseCountDownOptions {

  /**
   * CountDown interval
   *
   * @default 1000
   */
  interval?: number

  /**
   * Trigger it when countdown completes
   *
   */
  onEnd?: () => void

  /**
   * Get the formatted date according to the string of tokens
   *
   * @default HH:mm:ss
   */
  format?: string
}

const countDown = (d?: UDate) => {
  if (!d) return 0
  const result = parseDate(d).getTime() - timestamp()
  if (result < 0) return 0
  return result
}

/**
 * CountDown controller.
 *
 * @see https://vueuse.org/useCountdown
 * @param options
 */

export function useCountdown(date: UDate, options: UseCountDownOptions = {}) {
  const {
    interval = 1000,
    onEnd = noop,
    format = 'HH:mm:ss',
  } = options

  const timestamp = ref(countDown(date))
  const parsedMs = computed(() => parseMs(timestamp.value))
  const formatted = computed(() => formatDate(parsedMs.value, format))
  const { pause } = useIntervalFn(() => {
    const targetLeft = countDown(date)
    timestamp.value = targetLeft
    if (targetLeft === 0) {
      pause()
      onEnd()
    }
  }, interval)
  return {
    timestamp,
    parsedMs,
    formatted,
  }
}

export type UseCountDownReturn = ReturnType<typeof useCountdown>
