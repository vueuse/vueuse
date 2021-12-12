import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useResizeObserver } from '../useResizeObserver'

/**
 * Reactive bounding box of an HTML element.
 *
 * @see https://vueuse.org/useElementBounding
 * @param target
 * @param options
 */
export function useElementBounding(
  target: MaybeElementRef,
) {
  const height = ref(0)
  const bottom = ref(0)
  const left = ref(0)
  const right = ref(0)
  const top = ref(0)
  const width = ref(0)
  const x = ref(0)
  const y = ref(0)

  function update() {
    const el = unrefElement(target)

    if (!el) {
      height.value = 0
      bottom.value = 0
      left.value = 0
      right.value = 0
      top.value = 0
      width.value = 0
      x.value = 0
      y.value = 0
      return
    }

    const rect = el.getBoundingClientRect()

    height.value = rect.height
    bottom.value = rect.bottom
    left.value = rect.left
    right.value = rect.right
    top.value = rect.top
    width.value = rect.width
    x.value = rect.x
    y.value = rect.y
  }

  useEventListener('scroll', update, true)

  useResizeObserver(
    target,
    update,
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
    update,
  }
}

export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>
