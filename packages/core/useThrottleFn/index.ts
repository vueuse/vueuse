/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Function}  fn             A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 *
 * @return {Function}  A new, throttled, function.
 */
export function useThrottleFn<T extends Function>(fn: T, delay = 200): T {
  if (delay <= 0)
    return fn

  let lastExec = 0

  function wrapper(this: any, ...args: any[]) {
    const elapsed = Date.now() - lastExec

    if (elapsed > delay) {
      lastExec = Date.now()
      fn.apply(this, args)
    }
  }

  return wrapper as any as T
}
