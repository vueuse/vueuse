import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export function useElementHover(el: MaybeComputedRef<EventTarget>): Ref<boolean> {
  const isHovered = ref(false)

  useEventListener(el, 'mouseenter', () => isHovered.value = true)
  useEventListener(el, 'mouseleave', () => isHovered.value = false)

  return isHovered
}
