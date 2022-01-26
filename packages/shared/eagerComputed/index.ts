// ported from https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j
// by @linusborg https://github.com/LinusBorg

import type { Ref, WatchOptionsBase } from 'vue-demi'
import { readonly, shallowRef, watchEffect } from 'vue-demi'

export function eagerComputed<T>(fn: () => T, options?: WatchOptionsBase): Readonly<Ref<T>> {
  const { flush = 'sync' } = options ?? {}

  const result = shallowRef()

  watchEffect(() => {
    result.value = fn()
  }, {
    flush,
  })

  return readonly(result)
}
