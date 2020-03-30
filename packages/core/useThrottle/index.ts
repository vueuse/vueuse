import { ref, Ref, watch } from '../../api'

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay      A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 */
export function useThrottle<T>(value: Ref<T>, delay = 200) {
  if (delay <= 0)
    return value

  const throttled: Ref<T> = ref<T>(value.value as T) as Ref<T>

  let timer: ReturnType<typeof setTimeout> | undefined
  let hasNextValue = false

  const timeoutCallback = () => {
    throttled.value = value.value
    if (hasNextValue) {
      hasNextValue = false
      timer = setTimeout(timeoutCallback, delay)
    }
    else {
      timer = undefined
    }
  }

  watch(value, () => {
    if (!timer) {
      throttled.value = value.value
      timer = setTimeout(timeoutCallback, delay)
    }
    else {
      hasNextValue = true
    }
  }, { lazy: true })

  return throttled
}
