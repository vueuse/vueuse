import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeComputedElementRef } from '../unrefElement'
import { computed, ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { useMutationObserver } from '../useMutationObserver'
import { useParentElement } from '../useParentElement'

export interface UseElementHoverOptions extends ConfigurableWindow {
  delayEnter?: number
  delayLeave?: number
}

export function useElementHover(el: MaybeRefOrGetter<EventTarget | null | undefined>, options: UseElementHoverOptions = {}): Ref<boolean> {
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

  const elRef = computed(() => unrefElement(el as MaybeComputedElementRef))
  useMutationObserver(useParentElement(elRef), (mutationsList) => {
    mutationsList.map(mutation => [...mutation.removedNodes]).flat().forEach((node) => {
      if (node === elRef.value) {
        toggle(false)
      }
    })
  }, {
    window,
    childList: true,
  })

  return isHovered
}
