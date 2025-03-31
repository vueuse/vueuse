import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import { computed, shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { onElementRemoval } from '../onElementRemoval'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

export interface UseElementHoverOptions extends ConfigurableWindow {
  delayEnter?: number
  delayLeave?: number
  triggerOnRemoval?: boolean
}

export function useElementHover(el: MaybeRefOrGetter<EventTarget | null | undefined>, options: UseElementHoverOptions = {}): ShallowRef<boolean> {
  const {
    delayEnter = 0,
    delayLeave = 0,
    triggerOnRemoval = false,
    window = defaultWindow,
  } = options

  const isHovered = shallowRef(false)
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

  if (triggerOnRemoval) {
    onElementRemoval(
      computed(() => unrefElement(el as MaybeComputedElementRef)),
      () => toggle(false),
    )
  }

  return isHovered
}
