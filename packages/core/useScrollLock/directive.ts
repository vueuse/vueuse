import { ref, watch } from 'vue-demi'
import type { FunctionDirective } from 'vue-demi'
import { useScrollLock } from '.'

const onScrollLock = (): FunctionDirective<
HTMLElement,
boolean
> => {
  let mountedEle: HTMLElement | null = null
  const state = ref(false)
  return (el, binding) => {
    state.value = binding.value
    if (el === mountedEle) return
    mountedEle = el

    const isLocked = useScrollLock(el, binding.value)
    watch(state, v => isLocked.value = v)
  }
}

export const vScrollLock = onScrollLock()
