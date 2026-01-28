import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { DebounceFilterOptions, FunctionArgs, PromisifyFn } from '../utils'
import { computed } from 'vue'
import { createFilterWrapper, debounceFilter } from '../utils'

export interface UseDebounceFnReturn<T extends FunctionArgs> {
  /**
   * The debounced function to execute.
   */
  execute: PromisifyFn<T>
  /**
   * Whether there is a pending execution.
   */
  pending: ComputedRef<boolean>
  /**
   * Cancel any pending execution.
   */
  cancel: () => void
}

/**
 * Debounce execution of a function.
 *
 * @see https://vueuse.org/useDebounceFn
 * @param  fn          A function to be executed after delay milliseconds debounced.
 * @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  options     Options
 *
 * @return An object with execute, pending, and cancel properties.
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useDebounceFn<T extends FunctionArgs>(
  fn: T,
  ms: MaybeRefOrGetter<number> = 200,
  options: DebounceFilterOptions = {},
): UseDebounceFnReturn<T> {
  const filter = debounceFilter(ms, options)
  const execute = createFilterWrapper(filter, fn)
  const pending = computed(() => filter.pending)

  return {
    execute,
    pending,
    cancel: filter.cancel,
  }
}
