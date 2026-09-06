import type { MaybeRefOrGetter, Ref, WatchOptionsBase } from 'vue'
import type { DebounceFilterOptions } from '../utils'
import { computed, ref as deepRef, shallowReadonly, watch } from 'vue'
import { useDebounceFn } from '../useDebounceFn'

export type ComputedDebouncedOptions = DebounceFilterOptions & WatchOptionsBase

export type ComputedDebouncedReturn<T = any> = Readonly<Ref<T>>

/**
 * Debounce updates of a computed value.
 *
 * A computed that depends on other reactive state, but only updates after
 * that other state has stopped changing for a certain time.
 *
 * @see https://vueuse.org/shared/computedDebounced/
 * @param getter the getter function
 * @param ms debounce delay in milliseconds
 * @param options debounce and watch options
 * @return a readonly ref that updates with debounce
 */
export function computedDebounced<T>(
  getter: () => T,
  ms: MaybeRefOrGetter<number> = 200,
  options: ComputedDebouncedOptions = {},
): ComputedDebouncedReturn<T> {
  const tracked = computed(getter)

  // Activate dependency tracking and read the eager initial value.
  const value = deepRef(tracked.value) as Ref<T>

  const updater = useDebounceFn(() => {
    value.value = tracked.value
  }, ms, options)

  watch(tracked, () => updater(), options)

  return shallowReadonly(value)
}
