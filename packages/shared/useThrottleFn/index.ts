import type { MaybeRefOrGetter } from 'vue'
import type { CancelablePromisifyFn, FunctionArgs } from '../utils'
import { tryOnScopeDispose } from '../tryOnScopeDispose'
import { createFilterWrapper, throttleFilter } from '../utils'

export type UseThrottleFnReturn<T extends FunctionArgs> = CancelablePromisifyFn<T>

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
 * @return  A new, throttled, function with isPending, cancel, and flush properties.
 *
 * @__NO_SIDE_EFFECTS__
 */

export function useThrottleFn<T extends FunctionArgs>(
  fn: T,
  ms: MaybeRefOrGetter<number> = 200,
  trailing = false,
  leading = true,
  rejectOnCancel = false,
): UseThrottleFnReturn<T> {
  const filter = throttleFilter(ms, trailing, leading, rejectOnCancel)

  tryOnScopeDispose(filter.cancel)

  return createFilterWrapper(filter, fn)
}
