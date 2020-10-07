import { timestamp } from '../utils'
import { ref, Ref, watch } from 'vue-demi'

export interface UseRefHistoryRecord<T> {
  value: T
  timestamp: number
}

export interface UseRefHistoryOptions<Raw, Serialized = Raw> {
  /**
   * Watch for deep changes, default to false
   */
  deep?: boolean

  /**
   * Maximum number of history to be kept. Default to unlimited.
   */
  capacity?: number

  /**
   * Whether to clone the data, default to false. Useful when working with objects.
   */
  clone?: boolean

  /**
   * Serialize data into the histry
   */
  dump?: (v: Raw) => Serialized
  /**
   * Deserialize data from the histry
   */
  parse?: (v: Serialized) => Raw
}

export interface UseRefHistoryReturn<Raw, Serialized> {
  /**
   * Bypassed tracking ref from the argument
   */
  current: Ref<Raw>

  /**
   * An array of history records for undo
   */
  history: UseRefHistoryRecord<Serialized>[]

  /**
   * Same as 'history'
   */
  undoStack: UseRefHistoryRecord<Serialized>[]

  /**
   * Records array for redo
   */
  redoStack: UseRefHistoryRecord<Serialized>[]

  /**
   * A ref representing if the tracking is enabled
   */
  isTracking: Ref<boolean>

  /**
   * Undo changes
   */
  undo(): void

  /**
   * Redo changes
   */
  redo(): void

  /**
   * Clear all the history
   */
  clear(): void

  /**
   * Pause change tracking
   */
  pause(): void

  /**
   * Resume change tracking
   *
   * @param [commit] if true, a history record will be create after resuming
   */
  resume(commit?: boolean): void

  /**
   * Create new a new history record
   */
  commit(): void

  /**
   * Reset ref's value with lastest history
   */
  reset(): void

  /**
   * A sugar for auto pause and auto resuming within a function scope
   *
   * @param fn
   */
  batch(fn: (cancel: (() => void)) => void): void

  /**
   * Clear the data and stop the watch
   */
  dispose(): void
}

const fnClone = <F, T>(v: F): T => JSON.parse(JSON.stringify(v))
const fnBypass = <F, T>(v: F) => v as unknown as T

export function useRefHistory<Raw, Serialized = Raw>(
  current: Ref<Raw>,
  options: UseRefHistoryOptions<Raw, Serialized> = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const undoStack: UseRefHistoryRecord<Serialized>[] = []
  const redoStack: UseRefHistoryRecord<Serialized>[] = []
  const tracking = ref(true)

  const _dump = options.dump || (options.clone ? fnClone : fnBypass)
  const _parse = options.parse || fnBypass

  const commit = () => {
    undoStack.unshift({
      value: _dump(current.value),
      timestamp: timestamp(),
    })

    if (options.capacity && undoStack.length > options.capacity)
      undoStack.splice(options.capacity, Infinity)
    if (redoStack.length)
      redoStack.splice(0, redoStack.length)
  }

  const _stop = watch(
    current,
    () => {
      if (tracking.value)
        commit()
    },
    {
      deep: options.deep,
      immediate: true,
      flush: 'sync',
    },
  )

  const pause = () => {
    tracking.value = false
  }

  const resume = (commitNow?: boolean) => {
    tracking.value = true
    if (commitNow)
      commit()
  }

  const clear = () => {
    undoStack.splice(0, undoStack.length)
    redoStack.splice(0, redoStack.length)
  }

  const undo = () => {
    const previous = tracking.value
    tracking.value = false

    const state = undoStack.shift()

    if (state)
      redoStack.unshift(state)
    if (undoStack[0])
      current.value = _parse(undoStack[0].value)

    tracking.value = previous
  }

  const redo = () => {
    const previous = tracking.value
    tracking.value = false

    const state = redoStack.shift()

    if (state) {
      current.value = _parse(state.value)
      undoStack.unshift(state)
    }

    tracking.value = previous
  }

  const reset = () => {
    const previous = tracking.value
    tracking.value = false

    const state = redoStack[0]
    if (state)
      current.value = _parse(state.value)

    tracking.value = previous
  }

  const batch = (fn: (cancel: () => void) => void) => {
    const previous = tracking.value
    tracking.value = false
    let canceled = false

    const cancel = () => canceled = true

    fn(cancel)

    tracking.value = previous

    if (!canceled)
      commit()
  }

  const dispose = () => {
    _stop()
    clear()
  }

  return {
    current,
    undoStack,
    redoStack,
    history: undoStack,
    isTracking: tracking,

    clear,
    pause,
    resume,
    commit,
    reset,
    batch,
    undo,
    redo,
    dispose,
  }
}
