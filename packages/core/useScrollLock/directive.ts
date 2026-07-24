import type { VaporDirective } from 'vue'
import { useScrollLock } from '@vueuse/core'
import { createDisposableDirective } from '@vueuse/shared'
import { shallowRef, watch } from 'vue'

function setupScrollLock(el: HTMLElement, value: () => boolean) {
  const isLocked = useScrollLock(el, value())
  watch(value, v => isLocked.value = v)
}

function onScrollLock() {
  let isMounted = false
  const state = shallowRef(false)
  return createDisposableDirective<HTMLElement, boolean>((el, binding) => {
    state.value = binding.value
    if (isMounted)
      return
    isMounted = true
    setupScrollLock(el, () => state.value)
  })
}

export const vScrollLock = onScrollLock()

export const vScrollLockVapor: VaporDirective = (el, value) => {
  if (!(el instanceof HTMLElement) || !value)
    return

  setupScrollLock(el, value)
}
