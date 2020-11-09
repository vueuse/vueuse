import { createFilterWrapper, debounceFilter } from '@vueuse/shared'

/**
 * Debounce execution of a function.
 *
 * @param  fn          A function to be executed after delay milliseconds debounced.
 * @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 *
 * @return A new, debounce, function.
 */
export function useDebounceFn<T extends Function>(fn: T, ms = 200): T {
  return createFilterWrapper(
    debounceFilter(ms),
    fn,
  )
}
