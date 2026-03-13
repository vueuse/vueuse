import type { MaybeRefOrGetter } from 'vue'
import type { FunctionArgs, PromisifyFn } from '../utils'
import { createFilterWrapper, throttleFilter } from '../utils'

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param   fn             A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param   ms             A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 *                                    (default value: 200)
 *
 * @param [trailing] if true, call fn again after the time is up (default value: false)
 *
 * @param [leading] if true, call fn on the leading edge of the ms timeout (default value: true)
 *
 * @param [rejectOnCancel] if true, reject the last call if it's been cancel (default value: false)
 *
 * @return  A new, throttled, function.
 *
 * @__NO_SIDE_EFFECTS__
 */

export type CancelableFn<T extends FunctionArgs>
  = PromisifyFn<T> & {
    /**
     * Cancel any pending throttled invocation.
     */
    cancel: () => void
  }

export function useThrottleFn<T extends FunctionArgs>(
  fn: T,
  ms: MaybeRefOrGetter<number> = 200,
  trailing = false,
  leading = true,
  rejectOnCancel = false,
): CancelableFn<T> {
  const filter = throttleFilter(ms, trailing, leading, rejectOnCancel)
  const wrapper = createFilterWrapper(filter, fn) as CancelableFn<T>
  wrapper.cancel = filter.clear
  return wrapper
}
