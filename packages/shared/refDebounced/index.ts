import type { Ref, WatchOptions } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import { useDebounceFn } from '../useDebounceFn'
import type { DebounceFilterOptions, MaybeRefOrGetter } from '../utils'
import { deepClone, isObject } from '../utils'

export interface RefDebouncedFilterOptions extends DebounceFilterOptions, Pick<WatchOptions, 'deep'> {
}

/**
 * Debounce updates of a ref.
 *
 * @return A new debounced ref.
 */
export function refDebounced<T>(value: Ref<T>, ms: MaybeRefOrGetter<number> = 200, options: RefDebouncedFilterOptions = {}): Readonly<Ref<T>> {
  const getValue = (): T => isObject(value.value) ? deepClone(value.value) : value.value
  const debounced = ref(getValue()) as Ref<T>

  const updater = useDebounceFn(() => {
    debounced.value = getValue()
  }, ms, options)

  watch(value, () => updater(), { deep: options.deep })

  return debounced
}

// alias
export {
  refDebounced as useDebounce,
  refDebounced as debouncedRef,
}
