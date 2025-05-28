import type { MaybeElementRef } from '../unrefElement'
import type { UseMouseOptions } from '../useMouse'
import { computed, reactive, toRefs } from 'vue'
import { useElementBounding } from '../useElementBounding'
import { useMouse } from '../useMouse'
import { useWindowScroll } from '../useWindowScroll'

export interface MouseInElementOptions extends UseMouseOptions {
  handleOutside?: boolean
}

/**
 * Reactive mouse position related to an element.
 *
 * @see https://vueuse.org/useMouseInElement
 * @param target
 * @param options
 */
export function useMouseInElement(
  target?: MaybeElementRef,
  options: MouseInElementOptions = {},
) {
  const windowScroll = reactive(useWindowScroll())
  const mouse = reactive(useMouse(options))
  const elementBounding = reactive(useElementBounding(target))

  const isOutside = computed(() =>
    mouse.x < elementBounding.x
    || mouse.x > elementBounding.x + elementBounding.width
    || mouse.y < elementBounding.y
    || mouse.y > elementBounding.y + elementBounding.height,
  )

  const result = computed(() => ({
    x: mouse.x,
    y: mouse.y,
    sourceType: mouse.sourceType,
    elementX: mouse.x - elementBounding.left - windowScroll.x,
    elementY: mouse.y - elementBounding.top - windowScroll.y,
    elementPositionX: elementBounding.x,
    elementPositionY: elementBounding.y,
    elementHeight: elementBounding.height,
    elementWidth: elementBounding.width,
    isOutside,
  }))

  return {
    ...toRefs(result.value),
  }
}

export type UseMouseInElementReturn = ReturnType<typeof useMouseInElement>
