import type { Ref } from 'vue-demi'
import { ref, unref } from 'vue-demi'
import type { MaybeComputedRef, MaybeRef } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export interface UseElementHoverOptions {
  /**
   * Time in ms of hovered over the element
   *
   * @default 0
   */
  delay?: MaybeRef<number>
}

export function useElementHover(el: MaybeComputedRef<EventTarget | null | undefined>, options: UseElementHoverOptions = {}): Ref<boolean> {
  const { delay = 0 } = options

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

    if (unref(delay)) {
      timeout = setTimeout(() => {
        isHovered.value = true
      }, unref(delay))
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
