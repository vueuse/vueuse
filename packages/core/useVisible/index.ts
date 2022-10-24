import { computed, ref, watch } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'

export function useVisible(
  target: MaybeElementRef,
  initialValue = true,
) {
  const elementRef = computed(() => unrefElement(target))

  const visible = ref(initialValue)

  watch([visible, elementRef], () => {
    if (elementRef.value)
      elementRef.value.style.visibility = visible.value ? 'visible' : 'hidden'
  }, {
    immediate: true,
  })

  return {
    visible,
  }
}
