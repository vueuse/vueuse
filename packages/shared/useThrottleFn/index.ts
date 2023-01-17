import type { FunctionArgs, MaybeComputedRef, PromisifyFn } from '../utils'
import { createFilterWrapper, throttleFilter } from '../utils'

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param   fn             A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param   ms             A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 *
 * @param [trailing=false] if true, call fn again after the time is up
 *
 * @param [leading=true] if true, call fn on the leading edge of the ms timeout
 *
 * @param [rejectOnCancel=false] if true, reject the last call if it's been cancel
 *
 * @return  A new, throttled, function.
 */
export function useThrottleFn<T extends FunctionArgs>(
  fn: T,
  ms: MaybeComputedRef<number> = 200,
  trailing = false,
  leading = true,
  rejectOnCancel = false,
): PromisifyFn<T> {
  return createFilterWrapper(
    throttleFilter(ms, trailing, leading, rejectOnCancel),
    fn,
  )
}
