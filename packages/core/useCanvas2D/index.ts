import type { ShallowRef } from 'vue'
import type { MaybeComputedElementRef } from '../unrefElement'
import { shallowRef, watch } from 'vue'
import { unrefElement } from '../unrefElement'

export type UseCanvas2DOptions = CanvasRenderingContext2DSettings

export interface UseCanvas2DReturn {
  context: ShallowRef<CanvasRenderingContext2D | null>
}

/**
 * Reactive 2D rendering context of a canvas element.
 *
 * @see https://vueuse.org/useCanvas2D
 * @param target
 * @param options
 */
export function useCanvas2D(
  target: MaybeComputedElementRef<HTMLCanvasElement | null | undefined>,
  options: UseCanvas2DOptions = {},
): UseCanvas2DReturn {
  const context = shallowRef<CanvasRenderingContext2D | null>(null)

  watch(
    () => unrefElement(target),
    (canvas) => {
      context.value = canvas?.getContext('2d', options) ?? null
    },
    { immediate: true },
  )

  return {
    context,
  }
}
