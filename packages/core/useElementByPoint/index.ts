import { ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import { useRafFn } from '../useRafFn'

export interface UseElementByPointOptions {
  x: MaybeComputedRef<number>
  y: MaybeComputedRef<number>
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
    element.value = document.elementFromPoint(resolveUnref(x), resolveUnref(y)) as HTMLElement | null
  })

  return {
    element,
    ...controls,
  }
}

export type UseElementByPointReturn = ReturnType<typeof useElementByPoint>
