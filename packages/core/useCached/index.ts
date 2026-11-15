import type { ShallowOrDeepRef } from '@vueuse/shared'
import type { Ref, WatchOptions } from 'vue'
import type { ConfigurableDeepRefs } from '../_configurable'
import { createRef } from '@vueuse/shared'
import { watch } from 'vue'

export interface UseCachedOptions<D extends boolean = true> extends ConfigurableDeepRefs<D>, WatchOptions {}

export function useCached<T, D extends boolean = true>(
  refValue: Ref<T>,
  comparator: (newSourceValue: T, cachedValue: T) => boolean = (newSourceValue, cachedValue) => newSourceValue === cachedValue,
  options?: UseCachedOptions<D>,
): UseCachedReturn<T, D> {
  const { deepRefs = true as D, ...watchOptions } = options || {}
  const cachedValue = createRef(refValue.value, deepRefs)

  watch(() => refValue.value, (value) => {
    if (!comparator(value, cachedValue.value))
      cachedValue.value = value
  }, watchOptions)

  return cachedValue
}

export type UseCachedReturn<T = any, D extends boolean = true> = ShallowOrDeepRef<T, D>
