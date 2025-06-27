import type { Pausable } from '@vueuse/shared'
import type { Ref } from 'vue'
import { useIntervalFn } from '@vueuse/shared'
import { ref as deepRef } from 'vue'
import { useRafFn } from '../useRafFn'

export interface UseNowOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls

  /**
   * Start the clock immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Update interval in milliseconds, or use requestAnimationFrame
   *
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number
}

/**
 * Reactive current Date instance.
 *
 * @see https://vueuse.org/useNow
 * @param options
 */
export function useNow(options?: UseNowOptions<false>): Ref<Date>
export function useNow(options: UseNowOptions<true>): { now: Ref<Date> } & Pausable
export function useNow(options: UseNowOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    interval = 'requestAnimationFrame',
    immediate = true,
  } = options

  const now = deepRef(new Date())

  const update = () => now.value = new Date()

  const controls: Pausable = interval === 'requestAnimationFrame'
    ? useRafFn(update, { immediate })
    : useIntervalFn(update, interval, { immediate })

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

export type UseNowReturn = ReturnType<typeof useNow>
