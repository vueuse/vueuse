import { createFilterWrapper, debounceFilter, FunctionArgs, MaybeRef, DebounceFilterOptions } from '../utils'

/**
 * Debounce execution of a function.
 *
 * @param  fn          A function to be executed after delay milliseconds debounced.
 * @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  opts        options
 *
 * @return A new, debounce, function.
 */
export function useDebounceFn<T extends FunctionArgs>(fn: T, ms: MaybeRef<number> = 200, options: DebounceFilterOptions = {}): T {
  return createFilterWrapper(
    debounceFilter(ms, options),
    fn,
  )
}
