import type { ConfigurableDeepRefs } from '@vueuse/core/_configurable'
import type { MaybeDeepRef } from '@vueuse/shared'
import type { Ref, WatchOptions } from 'vue'
import { createRef } from '@vueuse/shared'
import { watch } from 'vue'

export interface UseCachedOptions<D extends boolean = true> extends ConfigurableDeepRefs<D>, Omit<WatchOptions, 'deep'> {

}

export function useCached<T, D extends boolean = true>(
  refValue: Ref<T>,
  comparator: (a: T, b: T) => boolean = (a, b) => a === b,
  options?: UseCachedOptions<D>,
) {
  const { deep = true as D } = options || {}
  const cachedValue = createRef(refValue.value, deep)

  watch(() => refValue.value, (value) => {
    if (!comparator(value, cachedValue.value))
      cachedValue.value = value
  }, options)

  return cachedValue satisfies UseCachedReturn<T, D>
}

export type UseCachedReturn<T = any, D extends boolean = true> = MaybeDeepRef<T, D>
