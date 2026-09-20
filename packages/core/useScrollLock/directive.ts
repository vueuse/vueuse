import { useScrollLock } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { shallowRef, watch } from 'vue'

function onScrollLock() {
  let isMounted = false
  const state = shallowRef(false)
  return createDisposableDirective<HTMLElement, boolean>((el, binding) => {
    state.value = binding.value
    if (isMounted)
      return
    isMounted = true
    const isLocked = useScrollLock(el, binding.value)
    watch(state, v => isLocked.value = v)
  })
}

export const vScrollLock = onScrollLock()
