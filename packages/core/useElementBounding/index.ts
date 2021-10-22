import { reactive, toRefs } from 'vue-demi'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { ResizeObserverOptions, useResizeObserver } from '../useResizeObserver'

/**
 * Reactive bounding box of an HTML element.
 *
 * @see https://vueuse.org/useElementBounding
 * @param target
 * @param callback
 * @param options
 */
export function useElementBounding(
  target: MaybeElementRef,
  options: ResizeObserverOptions = {},
) {
  const domRect = reactive({
    height: 0,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  })

  useResizeObserver(
    target,
    () => {
      const el = unrefElement(target)
      const rect = el!.getBoundingClientRect()

      domRect.height = rect.height
      domRect.bottom = rect.bottom
      domRect.left = rect.left
      domRect.right = rect.right
      domRect.top = rect.top
      domRect.width = rect.width
      domRect.x = rect.x
      domRect.y = rect.y
    },
    options,
  )

  return toRefs(domRect)
}

export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>
