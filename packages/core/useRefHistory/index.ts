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
  limit?: number
}

export function useRefHistory<T>(r: Ref<T>, options: UseRefHistoryOptions = {}) {
  const history: UseRefHistoryRecord<T>[] = []
  const redoHistory: UseRefHistoryRecord<T>[] = []
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
      history.unshift({
        value: cloneFn(value),
        timestamp: timestamp(),
      })
      if (options.limit && history.length > options.limit)
        history.splice(options.limit, Infinity)
      if (redoHistory.length)
        redoHistory.splice(0, redoHistory.length)
    }, {
      deep: options.deep,
      immediate: true,
      flush: 'sync',
    },
  )

  const clear = () => {
    history.splice(0, history.length)
    redoHistory.splice(0, redoHistory.length)
  }

  const pause = () => tracking.value = false
  const resume = () => tracking.value = true

  const undo = () => {
    const previous = tracking.value
    tracking.value = false

    const state = history.shift()

    if (state)
      redoHistory.unshift(state)
    if (history[0])
      r.value = history[0].value

    tracking.value = previous
  }

  const redo = () => {
    const previous = tracking.value
    tracking.value = false

    const state = redoHistory.shift()

    if (state) {
      r.value = state.value
      history.unshift(state)
    }

    tracking.value = previous
  }

  return {
    history,
    redoHistory,
    tracking,
    clear,
    stop,
    pause,
    resume,
    undo,
    redo,
  }
}
