import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export interface UseElementHoverOptions {
  /**
   * Time in ms of hovered over the element
   */
  delay?: number
}

export function useElementHover(el: MaybeComputedRef<EventTarget | null | undefined>, options: UseElementHoverOptions = {}): Ref<boolean> {
  const isHovered = ref(false)

  let timeout: ReturnType<typeof setTimeout> | undefined

  function clear() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  function onHover() {
    clear()

    if (options?.delay) {
      timeout = setTimeout(() => {
        isHovered.value = true
      }, options?.delay)
    }
    else {
      isHovered.value = true
    }
  }

  function onLeave() {
    clear()
    isHovered.value = false
  }

  useEventListener(el, 'mouseenter', onHover)
  useEventListener(el, 'mouseleave', onLeave)

  return isHovered
}
