import { ref, watch } from 'vue-demi'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { UseResizeObserverOptions } from '../useResizeObserver'
import { useResizeObserver } from '../useResizeObserver'
import { unrefElement } from '../unrefElement'

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
  target: MaybeComputedElementRef,
  initialSize: ElementSize = { width: 0, height: 0 },
  options: UseResizeObserverOptions = {},
) {
  const { box = 'content-box' } = options
  const width = ref(initialSize.width)
  const height = ref(initialSize.height)

  useResizeObserver(
    target,
    ([entry]) => {
      const boxSize = box === 'border-box'
        ? entry.borderBoxSize
        : box === 'content-box'
          ? entry.contentBoxSize
          : entry.devicePixelContentBoxSize

      if (boxSize) {
        width.value = boxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
        height.value = boxSize.reduce((acc, { blockSize }) => acc + blockSize, 0)
      }
      else {
        // fallback
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height
      }
    },
    options,
  )

  watch(
    () => unrefElement(target),
    (ele) => {
      width.value = ele ? initialSize.width : 0
      height.value = ele ? initialSize.height : 0
    },
  )

  return {
    width,
    height,
  }
}

export type UseElementSizeReturn = ReturnType<typeof useElementSize>
