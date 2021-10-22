import { ref } from 'vue-demi'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { ResizeObserverOptions, useResizeObserver } from '../useResizeObserver'

/**
 * Reactive bounding box of an HTML element.
 *
 * @see https://vueuse.org/useElementBounding
 * @param target
 * @param options
 */
export function useElementBounding(
  target: MaybeElementRef,
  options: ResizeObserverOptions = {},
) {
  const height = ref(0)
  const bottom = ref(0)
  const left = ref(0)
  const right = ref(0)
  const top = ref(0)
  const width = ref(0)
  const x = ref(0)
  const y = ref(0)

  useResizeObserver(
    target,
    () => {
      const el = unrefElement(target)
      const rect = el!.getBoundingClientRect()

      height.value = rect.height
      bottom.value = rect.bottom
      left.value = rect.left
      right.value = rect.right
      top.value = rect.top
      width.value = rect.width
      x.value = rect.x
      y.value = rect.y
    },
    options,
  )

  return {
    height,
    bottom,
    left,
    right,
    top,
    width,
    x,
    y,
  }
}

export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>
