import type { MaybeRef } from '@vueuse/shared'
import { tryOnMounted } from '@vueuse/shared'
import { ref, unref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface VisibilityScrollTargetOptions extends ConfigurableWindow {
  scrollTarget?: MaybeRef<Element | null | undefined>
}

/**
 * Tracks the visibility of an element within the viewport.
 *
 * @see https://vueuse.org/useElementVisibility
 * @param element
 * @param options
 */
export function useElementVisibility(
  element: MaybeRef<Element|null|undefined>,
  { window = defaultWindow, scrollTarget }: VisibilityScrollTargetOptions = {},
) {
  const _element = ref(element)
  const _scrollTarget = unref(scrollTarget)
  const elementIsVisible = ref(false)

  const testBounding = () => {
    if (!window)
      return

    const document = window.document
    if (!_element.value) {
      elementIsVisible.value = false
    }
    else {
      const rect = _element.value.getBoundingClientRect()
      elementIsVisible.value = (
        rect.top <= (_scrollTarget?.clientHeight || window.innerHeight || document.documentElement.clientHeight)
        && rect.left <= (_scrollTarget?.clientWidth || window.innerWidth || document.documentElement.clientWidth)
          && rect.bottom >= 0
          && rect.right >= 0
      )
    }
  }

  tryOnMounted(testBounding)

  if (window)
    tryOnMounted(() => useEventListener(_scrollTarget || window, 'scroll', testBounding, { capture: false, passive: true }))

  return elementIsVisible
}
