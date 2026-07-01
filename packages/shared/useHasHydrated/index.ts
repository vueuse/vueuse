import { getCurrentInstance, onMounted, onServerPrefetch, shallowReadonly, shallowRef } from 'vue'
import { isClient } from '../utils'

/* @__NO_SIDE_EFFECTS__ */
/** Helper to use client-only values safe from hydration mismatch */
export function useHasHydrated() {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useHasHydrated must be used in a component')
  }

  const isHydrating = Boolean(isClient && instance.vnode.el && !instance.isMounted)
  const hasHydrated = shallowRef(isClient ? !isHydrating : false)

  if (isHydrating) {
    onMounted(() => {
      hasHydrated.value = true
    })
  }
  else {
    onServerPrefetch(() => {
      hasHydrated.value = false
    })
  }

  return shallowReadonly(hasHydrated)
}
