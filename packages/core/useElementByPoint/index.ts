import { ref, unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { useRafFn } from '../useRafFn'

export interface UseElementByPointOptions {
  x: MaybeRef<number>
  y: MaybeRef<number>
}

/**
 * Reactive element by point.
 *
 * @see https://vueuse.org/useElementByPoint
 * @param options - UseElementByPointOptions
 */
export function useElementByPoint(options: UseElementByPointOptions) {
  const element = ref<HTMLElement | null>(null)

  const { x, y } = options

  const controls = useRafFn(() => {
    element.value = document.elementFromPoint(unref(x), unref(y)) as HTMLElement | null
  })

  return {
    element,
    ...controls,
  }
}

export type UseElementByPointReturn = ReturnType<typeof useElementByPoint>
