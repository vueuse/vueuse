// ported from https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j
// by @linusborg https://github.com/LinusBorg

import type { Ref } from 'vue-demi'
import { readonly, shallowRef, watchSyncEffect } from 'vue-demi'

export function eagerComputed<T>(fn: () => T): Readonly<Ref<T>> {
  const result = shallowRef()

  watchSyncEffect(() => {
    result.value = fn()
  })

  return readonly(result)
}
