import { tryOnMounted } from '@vueuse/shared'
import { ref, Ref, watch } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { useWindowScroll } from '../useWindowScroll'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface VisibilityScrollTargetOptions extends ConfigurableWindow {
  scrollTarget?: EventTarget
}

/**
 * Tracks the visibility of an element within the viewport.
 *
 * @see   {@link https://vueuse.js.org/useElementVisibility}
 * @param element
 * @param options
 */
export function useElementVisibility(
  element: Ref<Element|null|undefined>,
  { window = defaultWindow, scrollTarget }: VisibilityScrollTargetOptions = {},
) {
  const elementIsVisible = ref(false)

  const testBoundingClientRect = () => {
    if (!window)
      return

    const document = window.document
    if (!element.value) {
      elementIsVisible.value = false
    }
    else {
      const rect = element.value.getBoundingClientRect()

      elementIsVisible.value = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
          && rect.left <= (window.innerWidth || document.documentElement.clientWidth)
          && rect.bottom >= 0
          && rect.right >= 0
      )
    }
  }

  tryOnMounted(testBoundingClientRect)

  if (scrollTarget) {
    tryOnMounted(() => useEventListener(scrollTarget, 'scroll', testBoundingClientRect, { capture: false, passive: true }))
  }
  else {
    const { x, y } = useWindowScroll({ window })

    watch(x, testBoundingClientRect)
    watch(y, testBoundingClientRect)
  }

  return elementIsVisible
}
