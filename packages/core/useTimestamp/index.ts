import type { AnyFn, Pausable } from '@vueuse/shared'
import type { ShallowRef } from 'vue'
import type { ConfigurableScheduler } from '../_configurable'
import { timestamp, useIntervalFn } from '@vueuse/shared'
import { shallowRef } from 'vue'
import { useRafFn } from '../useRafFn'

function getDefaultScheduler(options: UseTimestampOptions<boolean, true>) {
  if ('interval' in options || 'immediate' in options) {
    const {
      interval = 'requestAnimationFrame',
      immediate = true,
    } = options

    return interval === 'requestAnimationFrame'
      ? (cb: AnyFn) => useRafFn(cb, { immediate })
      : (cb: AnyFn) => useIntervalFn(cb, interval, { immediate })
  }

  return useRafFn
}

export interface UseTimestampOptions<Controls extends boolean, Legacy = false> extends ConfigurableScheduler {
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
   * @deprecated
   * @default true
   */
  immediate?: Legacy extends false ? never : boolean

  /**
   * Update interval, or use requestAnimationFrame
   *
   * @deprecated
   * @default requestAnimationFrame
   */
  interval?: Legacy extends false ? never : 'requestAnimationFrame' | number
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
export function useTimestamp(options?: UseTimestampOptions<false>): ShallowRef<number>
export function useTimestamp(options: UseTimestampOptions<true>): { timestamp: ShallowRef<number> } & Pausable
/** @deprecated Please use with `scheduler` option */
export function useTimestamp(options?: UseTimestampOptions<false, true>): ShallowRef<number>
/** @deprecated Please use with `scheduler` option */
export function useTimestamp(options: UseTimestampOptions<true, true>): { timestamp: ShallowRef<number> } & Pausable

export function useTimestamp(options: UseTimestampOptions<boolean, boolean> = {}) {
  const {
    controls: exposeControls = false,
    offset = 0,
    scheduler = getDefaultScheduler(options),
    callback,
  } = options

  const ts = shallowRef(timestamp() + offset)

  const update = () => ts.value = timestamp() + offset
  const cb = callback
    ? () => {
        update()
        callback(ts.value)
      }
    : update

  const controls = scheduler(cb)

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
