import { MaybeRef } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { ResizeObserverOptions, useResizeObserver } from '../useResizeObserver'

export interface Size {
  width: number
  height: number
}

/**
 * Reactive size of an HTML element.
 *
 * @see   {@link https://vueuse.js.org/useResizeObserver}
 * @param target
 * @param callback
 * @param options
 */
export function useElementSize(
  target: MaybeRef<Element | null | undefined>,
  initialSize: Size = { width: Infinity, height: Infinity },
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

  return {
    width,
    height,
  }
}
