import type { ConfigurableScheduler, DEPRECATE_SCHEDULER_INTERVAL, Pausable } from '@vueuse/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { timestamp, useIntervalFn } from '@vueuse/shared'
import { shallowRef } from 'vue'
import { useRafFn } from '../useRafFn'

export interface UseTimestampOptions<Controls extends boolean> extends ConfigurableScheduler {
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
/** @deprecated The option `interval: 'requestAnimationFrame'` has been deprecated. Please use the `scheduler` option with`useRafFn` instead */
export function useTimestamp(options?: DEPRECATE_SCHEDULER_INTERVAL<UseTimestampOptions<boolean>>): ({ timestamp: ShallowRef<number> } & Pausable) | ShallowRef<number>

export function useTimestamp(options: UseTimestampOptions<boolean> | DEPRECATE_SCHEDULER_INTERVAL<UseTimestampOptions<boolean>> = {}) {
  const {
    controls: exposeControls = false,
    offset = 0,
    callback,
    scheduler = (options.interval === undefined || options.interval === 'requestAnimationFrame') ? useRafFn : useIntervalFn,
    interval,
    immediate = true,
    immediateCallback,
  } = options

  const ts = shallowRef(timestamp() + offset)

  const update = () => ts.value = timestamp() + offset
  const cb = callback
    ? () => {
        update()
        callback(ts.value)
      }
    : update

  const controls: Pausable = scheduler(cb, {
    interval: interval as MaybeRefOrGetter<number>,
    immediate,
    immediateCallback,
  })

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
