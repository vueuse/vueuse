import type { Ref } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import { cloneFnJSON } from '../../core/useCloned'
import { useThrottleFn } from '../useThrottleFn'

function isReferenceType(value: any) {
  return value !== null && (typeof value === 'object' || typeof value === 'function')
}
/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param value Ref value to be watched with throttle effect
 * @param  delay  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param [trailing] if true, update the value again after the delay time is up
 * @param [leading] if true, update the value on the leading edge of the ms timeout
 * @param [cloneHandler] By default, it use `JSON.parse(JSON.stringify(value))` to clone
 */
export function refThrottled<T>(value: Ref<T>, delay = 200, trailing = true, leading = true, cloneHandler = cloneFnJSON) {
  if (delay <= 0)
    return value
  const throttled = ref() as Ref<T>
  const isEqualityClone = cloneHandler === cloneFnJSON
  const setThrottled = () => {
    try {
      throttled.value = isReferenceType(value.value) ? cloneHandler(value.value) : value.value
    }
    catch (error) {
      if (isEqualityClone) {
        throttled.value = value.value
        console.error('Some error occurred in cloneHandler, used uncloned value', error)
      }
      else {
        throw error
      }
    }
  }
  setThrottled()
  const updater = useThrottleFn(setThrottled, delay, trailing, leading)

  watch(value, updater, {
    deep: isReferenceType(value.value),
  })

  return throttled
}

// alias
export {
  refThrottled as useThrottle,
  refThrottled as throttledRef,
}
