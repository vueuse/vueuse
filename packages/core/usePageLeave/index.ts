import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export function usePageLeave({ window = defaultWindow }: ConfigurableWindow = {}) {
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
