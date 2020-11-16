import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactive state to show whether mouse leaves the page.
 *
 * @see   {@link https://vueuse.js.org/usePageLeave}
 * @param options
 */
export function usePageLeave(options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  const isLeft = ref(false)

  const handler = (event: MouseEvent) => {
    if (!window)
      return

    event = event || (window.event as any)
    // @ts-ignore
    const from = event.relatedTarget || event.toElement
    isLeft.value = !from
  }

  if (window) {
    useEventListener(window, 'mouseout', handler)
    useEventListener(window.document, 'mouseleave', handler)
    useEventListener(window.document, 'mouseenter', handler)
  }

  return isLeft
}
