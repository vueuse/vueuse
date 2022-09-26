import type { Ref } from 'vue-demi'
import { computed, ref, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'

export function useElementHover(els: Array<MaybeComputedRef<EventTarget | null | undefined>> | MaybeComputedRef<EventTarget | null | undefined>): Ref<boolean> {
  const isHovered = ref(false)
  const eventListenerMaps = new WeakMap()

  const elements = computed(() => {
    if (!Array.isArray(els))
      return [els]
    return els
  })

  watch(elements, (newEls, oldEls) => {
    const newElements = newEls.map(el => unrefElement(el as unknown as MaybeElementRef))
    oldEls?.forEach((el) => {
      const target = unrefElement(el as unknown as MaybeElementRef)
      if (target && newElements.includes(target)) {
        const stop = eventListenerMaps.get(target)
        stop()
      }
    })

    newElements.forEach((target) => {
      if (!target)
        return
      if (eventListenerMaps.has(target))
        return

      const stopMouseEnter = useEventListener(target, 'mouseenter', () => isHovered.value = true)
      const stopMouseLeave = useEventListener(target, 'mouseleave', () => isHovered.value = false)
      const stop = () => {
        stopMouseEnter()
        stopMouseLeave()
      }
      eventListenerMaps.set(target, stop)
    })
  }, {
    immediate: true,
  })

  return isHovered
}
