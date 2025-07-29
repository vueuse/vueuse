import type { ConfigurableWindow } from '../_configurable'
import { shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

/**
 * Reactive state to show whether mouse leaves the page.
 *
 * @see https://vueuse.org/usePageLeave
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function usePageLeave(options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  const isLeft = shallowRef(false)

  const handler = (event: MouseEvent) => {
    if (!window)
      return

    event = event || (window.event as any)
    // @ts-expect-error missing types
    const from = event.relatedTarget || event.toElement
    isLeft.value = !from
  }

  if (window) {
    const listenerOptions = { passive: true }
    useEventListener(window, 'mouseout', handler, listenerOptions)
    useEventListener(window.document, 'mouseleave', handler, listenerOptions)
    useEventListener(window.document, 'mouseenter', handler, listenerOptions)
  }

  return isLeft
}

export type UsePageLeaveReturn = ReturnType<typeof usePageLeave>
