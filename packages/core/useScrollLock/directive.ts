import { ref, watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import { useScrollLock } from '.'

const onScrollLock = (): FunctionDirective<
HTMLElement,
boolean
> => {
  let isMounted = false
  let ele = null as unknown as HTMLElement
  const state = ref(false)
  return (el, binding) => {
    state.value = binding.value
    if (el !== ele) isMounted = false
    if (isMounted) return
    isMounted = true
    ele = el

    const isLocked = useScrollLock(el, binding.value)
    watch(state, v => isLocked.value = v)
  }
}

export const vScrollLock = onScrollLock()
