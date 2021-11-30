import { Pausable, timestamp, useIntervalFn } from '@vueuse/shared'
import { Ref, ref } from 'vue-demi'
import { useRafFn } from '../useRafFn'

export interface TimestampOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Offset value adding to the value
   *
   * @default 0
   */
  offset?: number

  /**
   * Update the timestamp immediately
   *
   * @default true
   */
  immediate?: boolean

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
export function useTimestamp(options?: TimestampOptions<false>): Ref<number>
export function useTimestamp(options: TimestampOptions<true>): { timestamp: Ref<number> } & Pausable
export function useTimestamp(options: TimestampOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    offset = 0,
    immediate = true,
    interval = 'requestAnimationFrame',
  } = options

  const ts = ref(timestamp() + offset)

  const update = () => ts.value = timestamp() + offset

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(update, { immediate })
    : useIntervalFn(update, interval, { immediate })

  if (exposeControls) {
    return {
      timestamp: ts,
      ...controls,
    }
  }
  else {
    return ts
  }
}

export type UseTimestampReturn = ReturnType<typeof useTimestamp>
