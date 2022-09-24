import type { Ref } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import { useThrottleFn } from '../useThrottleFn'

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param value Ref value to be watched with throttle effect
 * @param  delay  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param [trailing=true] if true, update the value again after the delay time is up
 * @param [leading=true] if true, update the value on the leading edge of the ms timeout
 */
export function refThrottled<T>(value: Ref<T>, delay = 200, trailing = true, leading = true) {
  if (delay <= 0)
    return value

  const throttled: Ref<T> = ref(value.value as T) as Ref<T>

  const updater = useThrottleFn(() => {
    throttled.value = value.value
  }, delay, trailing, leading)

  watch(value, () => updater())

  return throttled
}

// alias
export {
  refThrottled as useThrottle,
  refThrottled as throttledRef,
}
