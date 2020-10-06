import { isFunction, timestamp } from '../utils'
import { ref, Ref, watch } from 'vue-demi'

export interface UseRefHistoryRecord<T> {
  value: T
  timestamp: number
}

export interface UseRefHistoryOptions {
  /**
   * Watch for deep changes, default to false
   */
  deep?: boolean

  /**
   * Whether to clone the data, default to false. Useful when working with objects.
   *
   * A custom clone function could be provided, otherwise uses JSON.parse(JSON.stringify(x))
   */
  clone?: boolean | (<T = any>(fn: T) => T)

  /**
   * Maximum number of history to be kept. Default to unlimited.
   */
  capacity?: number
}

export function useRefHistory<T>(r: Ref<T>, options: UseRefHistoryOptions = {}) {
  const prev: UseRefHistoryRecord<T>[] = []
  const next: UseRefHistoryRecord<T>[] = []
  const tracking = ref(true)

  const cloneFn = isFunction(options.clone)
    ? options.clone
    : options.clone === true
      ? (v: any) => JSON.parse(JSON.stringify(v))
      : (v: any) => v

  const stop = watch(
    r,
    (value) => {
      if (!tracking.value)
        return
      prev.unshift({
        value: cloneFn(value),
        timestamp: timestamp(),
      })
      if (options.capacity && prev.length > options.capacity)
        prev.splice(options.capacity, Infinity)
      if (next.length)
        next.splice(0, next.length)
    }, {
      deep: options.deep,
      immediate: true,
      flush: 'sync',
    },
  )

  const clear = () => {
    prev.splice(0, prev.length)
    next.splice(0, next.length)
  }

  const pause = () => tracking.value = false
  const resume = () => tracking.value = true

  const undo = () => {
    const previous = tracking.value
    tracking.value = false

    const state = prev.shift()

    if (state)
      next.unshift(state)
    if (prev[0])
      r.value = prev[0].value

    tracking.value = previous
  }

  const redo = () => {
    const previous = tracking.value
    tracking.value = false

    const state = next.shift()

    if (state) {
      r.value = state.value
      prev.unshift(state)
    }

    tracking.value = previous
  }

  return {
    prev,
    next,
    tracking,
    clear,
    stop,
    pause,
    resume,
    undo,
    redo,
  }
}
