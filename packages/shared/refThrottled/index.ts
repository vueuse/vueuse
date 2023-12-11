import type { Ref } from 'vue-demi'
import { ref, watch } from 'vue-demi'
import { useThrottleFn } from '../useThrottleFn'
import { toValue } from '../toValue'

const isObject = (val: any): val is object => val !== null && typeof val === 'object'
const _defaultClone = <T>(val: T): T => JSON.parse(JSON.stringify(val))

interface optionsType<T> {
  value: Ref<T>
  delay?: number
  trailing?: boolean
  leading?: boolean
  defaultClone?: (val: T) => T
}

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 * @param {optionsType} options
 */
export function refThrottled<T>(options: optionsType<T>): Ref<T> {
  const { value, delay = 200, trailing = true, leading = true, defaultClone = _defaultClone } = options
  if (delay <= 0)
    return value
  const _isObject = isObject(toValue(value))
  const throttled: Ref<T> = ref(_isObject ? defaultClone(toValue(value)) : toValue(value)) as Ref<T>
  const updater = useThrottleFn(() => {
    throttled.value = _isObject ? defaultClone(toValue(value)) : toValue(value)
  }, delay, trailing, leading)

  watch(value, () => updater(), {
    deep: _isObject,
  })
  return throttled
}

// alias
export {
  refThrottled as useThrottle,
  refThrottled as throttledRef,
}
