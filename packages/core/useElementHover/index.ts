import type { Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import type { ConfigurableWindow } from '../_configurable'

export interface UseElementHoverOptions extends ConfigurableWindow {
  delayEnter?: number
  delayLeave?: number
}

export function useElementHover(el: MaybeElementRef, options: UseElementHoverOptions = {}): Ref<boolean> {
  const delayEnter = options ? options.delayEnter : 0
  const delayLeave = options ? options.delayLeave : 0
  const isHovered = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const toggle = (entering: boolean) => {
    const delay = entering ? delayEnter : delayLeave
    clearTimeout(timer)

    if (delay)
      timer = setTimeout(() => isHovered.value = entering, delay)
    else
      isHovered.value = entering
  }

  if (!window)
    return isHovered

  const target = computed(() => unrefElement(el))

  useEventListener(target, 'mouseenter', () => toggle(true), { passive: true })
  useEventListener(target, 'mouseleave', () => toggle(false), { passive: true })

  return isHovered
}
