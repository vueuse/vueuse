import type { Pausable } from '@vueuse/shared'
import { timestamp, useIntervalFn } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { useRafFn } from '../useRafFn'

export interface UseTimestampOptions<Controls extends boolean> {
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
  /**
   * Callback on each update
   */
  callback?: (timestamp: number) => void
}

/**
 * Reactive current timestamp.
 *
 * @see https://vueuse.org/useTimestamp
 * @param options
 */
export function useTimestamp(options?: UseTimestampOptions<false>): Ref<number>
export function useTimestamp(options: UseTimestampOptions<true>): { timestamp: Ref<number> } & Pausable
export function useTimestamp(options: UseTimestampOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    offset = 0,
    immediate = true,
    interval = 'requestAnimationFrame',
    callback,
  } = options

  const ts = ref(timestamp() + offset)

  const update = () => ts.value = timestamp() + offset
  const cb = callback
    ? () => {
        update()
        callback(ts.value)
      }
    : update

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(cb, { immediate })
    : useIntervalFn(cb, interval, { immediate })

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
