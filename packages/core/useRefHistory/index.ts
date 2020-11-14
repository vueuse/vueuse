import { Fn, timestamp } from '@vueuse/shared'
import { ref, computed, Ref, watch } from 'vue-demi'

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
  const isTracking = ref(true)

  /** counter for how many following changes to be ignored */
  // ignoreCounter is incremented before there is a history operation
  // affecting the source ref value (undo, redo, revert).
  //
  // - flush 'sync'
  // Every time there is a history operation, the sync watcher will
  // trigger but the change will not be committed because it the
  // ignoreCounter is not zero. Then it is reset to 0.
  // syncCounter is not used in this case
  //
  // - flush 'pre' and 'post'
  // syncCounter is incremented in sync with every change to the
  // source ref value. This let us know how many times the ref
  // was modified and support chained sync operations. If there
  // are more sync triggers than the ignore count, the we now
  // there are modifications in the source ref value that we
  // need to commit
  const ignoreCounter = ref(0)
  const syncCounter = ref(0)

  const disposables: Fn[] = []

  const _setSource = (record: UseRefHistoryRecord<Serialized>) => {
    // If there were already changes in the state, they will be ignored
    // examples:
    //   modify, undo
    //   undo, modify, undo
    syncCounter.value = ignoreCounter.value

    // We support changes that are done after the last history operation
    // examples:
    //   undo, modify
    //   undo, undo, modify
    ignoreCounter.value++

    source.value = parse(record.snapshot)
    last.value = record
  }

  const commit = () => {
    // This guard only applies for flush 'pre' and 'post'
    // If the user triggers a commit manually, then reset the syncCounter
    // so we do not trigger an extra commit in the async watcher
    syncCounter.value = ignoreCounter.value

    undoStack.value.unshift(last.value)
    last.value = _createHistoryRecord()

    if (options.capacity && undoStack.value.length > options.capacity)
      undoStack.value.splice(options.capacity, Infinity)
    if (redoStack.value.length)
      redoStack.value.splice(0, redoStack.value.length)
  }
  if (flush === 'sync') {
    disposables.push(
      watch(
        source,
        () => {
          if (ignoreCounter.value > 0) {
            ignoreCounter.value = 0
            return
          }

          if (isTracking.value)
            commit()
        },
        {
          deep,
          flush: 'sync',
        },
      ),
    )
  }
  // flush for 'pre` and 'post'
  else {
    disposables.push(
      watch(
        source,
        () => {
          // If a history operation was performed (ignoreCounter > 0) and there are
          // no other changes to the source ref value afterwards, then ignore this commit
          const ignore = ignoreCounter.value > 0 && ignoreCounter.value === syncCounter.value
          ignoreCounter.value = 0
          syncCounter.value = 0
          if (ignore)
            return

          if (isTracking.value)
            commit()
        },
        {
          deep: options.deep,
          flush,
        },
      ),
    )
    disposables.push(
      watch(
        source,
        () => {
          syncCounter.value++
        },
        {
          deep: options.deep,
          flush: 'sync',
        },
      ),
    )
  }

  const pause = () => {
    isTracking.value = false
  }

  const resume = (commitNow?: boolean) => {
    isTracking.value = true
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
    const previous = isTracking.value
    isTracking.value = false
    let canceled = false

    const cancel = () => canceled = true

    fn(cancel)

    isTracking.value = previous

    if (!canceled)
      commit()
  }

  const dispose = () => {
    disposables.forEach(fn => fn())
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
