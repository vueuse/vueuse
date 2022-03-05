// ported from https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j
// by @linusborg https://github.com/LinusBorg

import type { Ref, WatchOptionsBase } from 'vue-demi'
import { readonly, shallowRef, watchEffect } from 'vue-demi'

export function computedEager<T>(fn: () => T, options?: WatchOptionsBase): Readonly<Ref<T>> {
  const result = shallowRef()

  watchEffect(() => {
    result.value = fn()
  }, {
    ...options,
    flush: options?.flush ?? 'sync',
  })

  return readonly(result)
}

// alias
export { computedEager as eagerComputed }
