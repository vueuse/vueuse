import { Fn, timestamp, pausableFilter, ignorableWatch } from '@vueuse/shared'
import { ref, computed, Ref } from 'vue-demi'

export interface UseRefHistoryRecord<T> {
  snapshot: T
  timestamp: number
}

export interface UseRefHistoryOptions<Raw, Serialized = Raw> {
  /**
   * Watch for deep changes, default to false
   *
   * When set to true, it will also create clones for values store in the history
   *
   * @default false
   */
  deep?: boolean

  /**
   * The flush option allows for greater control over the timing of a history point, default to 'pre'
   *
   * Possible values: 'pre', 'post', 'sync'
   * It works in the same way as the flush option in watch and watch effect in vue reactivity
   *
   * @default 'pre'
   */
  flush?: 'pre' | 'post' | 'sync'

  /**
   * Maximum number of history to be kept. Default to unlimited.
   */
  capacity?: number

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
  source: Ref<Raw>

  /**
   * An array of history records for undo, newest comes to first
   */
  history: Ref<UseRefHistoryRecord<Serialized>[]>

  /**
  * Last history point, source can be different if paused
  */
  last: Ref<UseRefHistoryRecord<Serialized>>

  /**
   * Same as 'history'
   */
  undoStack: Ref<UseRefHistoryRecord<Serialized>[]>

  /**
   * Records array for redo
   */
  redoStack: Ref<UseRefHistoryRecord<Serialized>[]>

  /**
   * A ref representing if the tracking is enabled
   */
  isTracking: Ref<boolean>

  /**
   * A ref representing if undo is possible (non empty undoStack)
   */
  canUndo: Ref<boolean>

  /**
   * A ref representing if redo is possible (non empty redoStack)
   */
  canRedo: Ref<boolean>

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
  batch(fn: (cancel: Fn) => void): void

  /**
   * Clear the data and stop the watch
   */
  dispose(): void
}

const fnClone = <F, T>(v: F): T => JSON.parse(JSON.stringify(v))
const fnBypass = <F, T>(v: F) => v as unknown as T

/**
 * Track the change history of a ref, also provides undo and redo functionality
 *
 * @see   {@link https://vueuse.js.org/useRefHistory}
 * @param source
 * @param options
 */
export function useRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: UseRefHistoryOptions<Raw, Serialized> = {},
): UseRefHistoryReturn<Raw, Serialized> {
  const {
    deep = false,
    flush = 'pre',
    dump = (options.deep ? fnClone : fnBypass),
    parse = fnBypass,
  } = options

  function _createHistoryRecord(): UseRefHistoryRecord<Serialized> {
    return {
      snapshot: dump(source.value),
      timestamp: timestamp(),
    }
  }

  const last: Ref<UseRefHistoryRecord<Serialized>> = ref(_createHistoryRecord()) as Ref<UseRefHistoryRecord<Serialized>>

  const undoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([])
  const redoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([])

  const _setSource = (record: UseRefHistoryRecord<Serialized>) => {
    // Support changes that are done after the last history operation
    // examples:
    //   undo, modify
    //   undo, undo, modify
    // If there were already changes in the state, they will be ignored
    // examples:
    //   modify, undo
    //   undo, modify, undo
    ignorePrevAsyncUpdates()

    ignoreUpdates(() => {
      source.value = parse(record.snapshot)
    })
    last.value = record
  }

  const commit = () => {
    // This guard only applies for flush 'pre' and 'post'
    // If the user triggers a commit manually, then reset the watcher
    // so we do not trigger an extra commit in the async watcher
    ignorePrevAsyncUpdates()

    undoStack.value.unshift(last.value)
    last.value = _createHistoryRecord()

    if (options.capacity && undoStack.value.length > options.capacity)
      undoStack.value.splice(options.capacity, Infinity)
    if (redoStack.value.length)
      redoStack.value.splice(0, redoStack.value.length)
  }

  const { eventFilter, pause, resume: resumeTracking, isActive: isTracking } = pausableFilter()

  const { ignoreUpdates, ignorePrevAsyncUpdates, stop } = ignorableWatch(
    source,
    commit,
    { deep, flush, eventFilter },
  )

  const resume = (commitNow?: boolean) => {
    resumeTracking()
    if (commitNow)
      commit()
  }

  const clear = () => {
    undoStack.value.splice(0, undoStack.value.length)
    redoStack.value.splice(0, redoStack.value.length)
  }

  const undo = () => {
    const state = undoStack.value.shift()

    if (state) {
      redoStack.value.unshift(last.value)
      _setSource(state)
    }
  }

  const redo = () => {
    const state = redoStack.value.shift()

    if (state) {
      undoStack.value.unshift(last.value)
      _setSource(state)
    }
  }

  const reset = () => {
    _setSource(last.value)
  }

  const batch = (fn: (cancel: Fn) => void) => {
    let canceled = false

    const cancel = () => canceled = true

    ignoreUpdates(() => {
      fn(cancel)
    })

    if (!canceled)
      commit()
  }

  const dispose = () => {
    stop()
    clear()
  }

  const history = computed(() => [last.value, ...undoStack.value])

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  return {
    source,
    undoStack,
    redoStack,
    last,
    history,
    isTracking,
    canUndo,
    canRedo,

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
