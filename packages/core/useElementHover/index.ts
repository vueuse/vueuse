import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseElementHoverOptions extends ConfigurableWindow {
  delayEnter?: number
  delayLeave?: number
}

export function useElementHover(el: MaybeComputedRef<EventTarget | null | undefined>, options: UseElementHoverOptions = {}): Ref<boolean> {
  const {
    delayEnter = 0,
    delayLeave = 0,
    window = defaultWindow,
  } = options

  const isHovered = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const toggle = (entering: boolean) => {
    const delay = entering ? delayEnter : delayLeave
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }

    if (delay)
      timer = setTimeout(() => isHovered.value = entering, delay)
    else
      isHovered.value = entering
  }

  if (!window)
    return isHovered

  useEventListener(el, 'mouseenter', () => toggle(true), { passive: true })
  useEventListener(el, 'mouseleave', () => toggle(false), { passive: true })

  return isHovered
}
