import { Pausable, useIntervalFn } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useRafFn } from '../useRafFn'

export interface UseNowOptions {
  /**
   * Update interval, or use requestAnimationFrame
   *
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number
}

/**
 * Reactive current timestamp.
 *
 * @link https://vueuse.org/useNow
 * @param options
 */
export function useNow(options: UseNowOptions = {}) {
  const {
    interval = 'requestAnimationFrame',
  } = options

  const now = ref(new Date())

  const update = () => now.value = new Date()

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(update, { immediate: true })
    : useIntervalFn(update, interval, true)

  return {
    now,
    ...controls,
  }
}
