import { Ref, ref } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export function useElementHover(el: MaybeRef<EventTarget>): Ref<boolean> {
  const isHovered = ref(false)

  useEventListener(el, 'mouseenter', () => isHovered.value = true)
  useEventListener(el, 'mouseleave', () => isHovered.value = false)

  return isHovered
}
