import type { Ref, WatchOptions } from 'vue-demi'
import { isRef, watch } from 'vue-demi'
import { cloneFnJSON, useCloned } from '../../core/useCloned'
import { useThrottleFn } from '../useThrottleFn'

function isReferenceType(value: any) {
  return value !== null && (typeof value === 'object' || typeof value === 'function')
}
interface RefThrottledOptions<T> extends Omit<WatchOptions, 'immediate' | 'deep'> {
  /**
   * Ref value to be watched with throttle effect.
   */
  origin: Ref<T>
  /**
   * A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   *
   * @default 200
   */
  delay?: number
  /**
   * If true, update the value again after the delay time is up.
   *
   * @default true
   */
  trailing?: boolean
  /**
   * If true, update the value on the leading edge of the ms timeout.
   *
   * @default true
   */
  leading?: boolean
  /**
   *  By default, it use `JSON.parse(JSON.stringify(value))` to clone
   *
   */
  cloneHandler?: (value: T) => T
}
/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param value Ref value to be watched with throttle effect
 * @param  delay  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param [trailing] if true, update the value again after the delay time is up
 * @param [leading] if true, update the value on the leading edge of the ms timeout
 * @param [deep] default true, Depth monitoring, if false, only monitor the first level
 * @param [immediate] default true, Whether to execute immediately
 * @param [cloneHandler] By default, it use `JSON.parse(JSON.stringify(value))` to clone
 */
export function refThrottled<T>(value: Ref<T>, delay?: number, trailing?: boolean, leading?: boolean, deep?: boolean, immediate?: boolean, cloneHandler?: (value: T) => T): Ref<T>
export function refThrottled<T>(options: RefThrottledOptions<T>): Ref<T>
export function refThrottled<T>(...args: any[]): Ref<T> {
  const isFirstRef = isRef(args[0])
  const value = isFirstRef ? args[0] : args[0].origin
  const [delay = 200, trailing = true, leading = true, deep = true, immediate = true, cloneHandler = cloneFnJSON] = isFirstRef ? args.slice(1) : args[0]
  if (delay <= 0)
    return value
  const isEqualityClone = cloneHandler === cloneFnJSON
  const { sync, cloned: throttled } = useCloned(
    value,
    {
      manual: true,
      clone: (cloneValue) => {
        try {
          return isReferenceType(cloneValue) ? cloneHandler(cloneValue) : cloneValue
        }
        catch (error) {
          if (isEqualityClone) {
            console.error('Some error occurred in cloneHandler, used uncloned value', error)
            return cloneValue
          }
          else {
            throw error
          }
        }
      },
      deep,
      immediate,
    },
  )
  const updater = useThrottleFn(sync, delay, trailing, leading)

  watch(value, updater, {
    deep,
  })

  return throttled as Ref<T>
}

// alias
export {
  refThrottled as useThrottle,
  refThrottled as throttledRef,
}
