import { ref, computed } from 'vue-demi'
import { noop, timestamp, useIntervalFn, parseDate, parseMs, formatDate } from '@vueuse/shared'
import type { UDate, Pausable } from '@vueuse/shared'
import { useRafFn } from '../useRafFn'

export interface UseDateCountDownOptions {

  /**
   * Countdown immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * CountDown interval, or use requestAnimationFrame
   *
   * @default 1000
   */
  interval?: 'requestAnimationFrame' | number

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
 * @see https://vueuse.org/useDateCountdown
 * @param options
 */

export function useDateCountdown(date: UDate, options: UseDateCountDownOptions = {}) {
  const {
    interval = 1000,
    onEnd = noop,
    format = 'HH:mm:ss',
    immediate = true,
  } = options

  const timestamp = ref(countDown(date))
  const parsedMs = computed(() => parseMs(timestamp.value))
  const formatted = computed(() => formatDate(parsedMs.value, format))

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(update, { immediate })
    : useIntervalFn(update, interval, { immediate })

  function update() {
    const targetLeft = countDown(date)
    timestamp.value = targetLeft
    if (targetLeft === 0) {
      controls.pause()
      onEnd()
    }
  }

  return {
    timestamp,
    parsedMs,
    formatted,
    controls,
  }
}

export type UseDateCountDownReturn = ReturnType<typeof useDateCountdown>
