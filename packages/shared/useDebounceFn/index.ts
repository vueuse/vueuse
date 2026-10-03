import type { MaybeRefOrGetter } from 'vue'
import type { CancelablePromisifyFn, DebounceFilterOptions, FunctionArgs } from '../utils'
import { createFilterWrapper, debounceFilter } from '../utils'

export type UseDebounceFnReturn<T extends FunctionArgs> = CancelablePromisifyFn<T>

/**
 * Debounce execution of a function.
 *
 * @see https://vueuse.org/useDebounceFn
 * @param  fn          A function to be executed after delay milliseconds debounced.
 * @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  options     Options
 *
 * @return A new, debounced, function with isPending, cancel, and flush properties.
 */
export function useDebounceFn<T extends FunctionArgs>(
  fn: T,
  ms: MaybeRefOrGetter<number> = 200,
  options: DebounceFilterOptions = {},
): UseDebounceFnReturn<T> {
  return createFilterWrapper(debounceFilter(ms, options), fn)
}
