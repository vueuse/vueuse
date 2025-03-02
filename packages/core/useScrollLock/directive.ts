import type { FunctionDirective } from 'vue'
import { shallowRef, watch } from 'vue'
import { useScrollLock } from './index'

function onScrollLock(): FunctionDirective<
  HTMLElement,
  boolean
> {
  let isMounted = false
  const state = shallowRef(false)
  return (el, binding) => {
    state.value = binding.value
    if (isMounted)
      return
    isMounted = true
    const isLocked = useScrollLock(el, binding.value)
    watch(state, v => isLocked.value = v)
  }
}

export const vScrollLock = onScrollLock()
