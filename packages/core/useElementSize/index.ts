import { ref, unref, watch } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import type { ResizeObserverOptions } from '../useResizeObserver'
import { useResizeObserver } from '../useResizeObserver'

export interface ElementSize {
  width: number
  height: number
}

/**
 * Reactive size of an HTML element.
 *
 * @see https://vueuse.org/useElementSize
 * @param target
 * @param callback
 * @param options
 */
export function useElementSize(
  target: MaybeElementRef,
  initialSize: ElementSize = { width: 0, height: 0 },
  options: ResizeObserverOptions = {},
) {
  const width = ref(initialSize.width)
  const height = ref(initialSize.height)

  useResizeObserver(
    target,
    ([entry]) => {
      width.value = entry.contentRect.width
      height.value = entry.contentRect.height
    },
    options,
  )
  watch(() => unref(target), (ele) => {
    width.value = ele ? initialSize.width : 0
    height.value = ele ? initialSize.height : 0
  })
  return {
    width,
    height,
  }
}

export type UseElementSizeReturn = ReturnType<typeof useElementSize>
