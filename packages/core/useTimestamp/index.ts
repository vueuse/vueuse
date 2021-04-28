import { Pausable, timestamp, useIntervalFn } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useRafFn } from '../useRafFn'

export interface TimestampOptions {
  /**
   * Offset value adding to the value
   *
   * @default 0
   */
  offset?: number

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
 * @see https://vueuse.org/useTimestamp
 * @param options
 */
export function useTimestamp(options: TimestampOptions = {}) {
  const {
    offset = 0,
    interval = 'requestAnimationFrame',
  } = options

  const ts = ref(timestamp() + offset)

  const update = () => ts.value = timestamp() + offset

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(update, { immediate: true })
    : useIntervalFn(update, interval, true)

  return {
    timestamp: ts,
    ...controls,
  }
}
