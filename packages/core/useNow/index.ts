import type { Pausable } from '@vueuse/shared'
import type { ShallowRef } from 'vue'
import type { ConfigurableScheduler } from '../_configurable'
import { shallowRef } from 'vue'
import { useRafFn } from '../useRafFn'

export interface UseNowOptions<Controls extends boolean> extends ConfigurableScheduler {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
}

export type UseNowReturn<Controls extends boolean> = Controls extends true ? ({ now: ShallowRef<Date> } & Pausable) : ShallowRef<Date>

/**
 * Reactive current Date instance.
 *
 * @see https://vueuse.org/useNow
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useNow(options?: UseNowOptions<false>): ShallowRef<Date>
export function useNow(options: UseNowOptions<true>): { now: ShallowRef<Date> } & Pausable
/* @__NO_SIDE_EFFECTS__ */
export function useNow(options: UseNowOptions<boolean> = {}): UseNowReturn<boolean> {
  const {
    controls: exposeControls = false,
    scheduler = useRafFn,
  } = options

  const now = shallowRef(new Date())

  const update = () => now.value = new Date()

  const controls = scheduler(update)

  if (exposeControls) {
    return {
      now,
      ...controls,
    }
  }
  else {
    return now
  }
}
