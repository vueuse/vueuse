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
  const elementIsVisible = ref(false)

  const testBounding = () => {
    if (!window)
      return

    const document = window.document
    if (!unref(element)) {
      elementIsVisible.value = false
    }
    else {
      const rect = (unref(element) as HTMLElement).getBoundingClientRect()
      elementIsVisible.value = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
          && rect.left <= (window.innerWidth || document.documentElement.clientWidth)
          && rect.bottom >= 0
          && rect.right >= 0
      )
    }
  }

  tryOnMounted(testBounding)

  if (window)
    tryOnMounted(() => useEventListener(unref(scrollTarget) || window, 'scroll', testBounding, { capture: false, passive: true }))

  return elementIsVisible
}
