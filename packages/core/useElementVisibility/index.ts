import type { MaybeComputedRef } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'
import type { MaybeComputedElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseElementVisibilityOptions extends ConfigurableWindow {
  scrollTarget?: MaybeComputedRef<HTMLElement | undefined | null>
}

/**
 * Tracks the visibility of an element within the viewport.
 *
 * @see https://vueuse.org/useElementVisibility
 * @param element
 * @param options
 */
export function useElementVisibility(
  element: MaybeComputedElementRef,
  { window = defaultWindow, scrollTarget }: UseElementVisibilityOptions = {},
) {
  const elementIsVisible = ref(false)

  const testBounding = () => {
    if (!window)
      return

    const document = window.document
    const el = unrefElement(element)
    if (!el) {
      elementIsVisible.value = false
    }
    else {
      const rect = el.getBoundingClientRect()
      elementIsVisible.value = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
          && rect.left <= (window.innerWidth || document.documentElement.clientWidth)
          && rect.bottom >= 0
          && rect.right >= 0
      )
    }
  }

  watch(
    () => unrefElement(element),
    () => testBounding(),
    { immediate: true, flush: 'post' },
  )

  if (window) {
    useEventListener(scrollTarget || window, 'scroll', testBounding, {
      capture: false, passive: true,
    })
  }

  return elementIsVisible
}
