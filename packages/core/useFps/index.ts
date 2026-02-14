import type { ShallowRef } from 'vue'
import { shallowRef } from 'vue'
import { useRafFn } from '../useRafFn'

export interface UseFpsOptions {
  /**
   * Calculate the FPS on every x frames.
   * @default 10
   */
  every?: number
}

/* @__NO_SIDE_EFFECTS__ */
export function useFps(options?: UseFpsOptions): ShallowRef<number> {
  const fps = shallowRef(0)
  if (typeof performance === 'undefined')
    return fps
  const every = options?.every ?? 10

  let last = performance.now()
  let ticks = 0

  useRafFn(() => {
    ticks += 1
    if (ticks >= every) {
      const now = performance.now()
      const diff = now - last
      fps.value = Math.round(1000 / (diff / ticks))
      last = now
      ticks = 0
    }
  })

  return fps
}
