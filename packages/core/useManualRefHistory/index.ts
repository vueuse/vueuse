import type { Awaitable } from '@vueuse/shared'
import { timestamp } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, markRaw, ref } from 'vue-demi'
import type { CloneFn } from '../useCloned'
import { cloneFnJSON } from '../useCloned'

export interface UseRefHistoryRecord<T> {
  snapshot: T
  timestamp: number
}

export type PromiseOr<Async extends boolean, T> = Async extends true ? Promise<T> : T

export interface UseManualRefHistoryOptions<Raw, Serialized = Raw, Async extends boolean = false> {
  /**
   * Enable async mode, allowing you to parse/dump data asynchronously
   *
   * @default false
   */
  async?: Async

  /**
   * Maximum number of history to be kept. Default to unlimited.
   */
  capacity?: number
  /**
   * Clone when taking a snapshot, shortcut for dump: JSON.parse(JSON.stringify(value)).
   * Default to false
   *
   * @default false
   */
  clone?: boolean | CloneFn<Raw>

  /**
   * Serialize data into the history
   */
  dump?: (v: PromiseOr<Async, Raw>) => PromiseOr<Async, Serialized>

  /**
   * Deserialize data from the history
   */
  parse?: (v: Serialized) => PromiseOr<Async, Raw>

  /**
   * set data source
   */
  setSource?: (source: Ref<Raw>, v: Raw) => void
}

export interface UseManualRefHistoryReturn<Raw, Serialized, Async extends boolean = false> {
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
   * Same as {@link UseManualRefHistoryReturn.history | history}
   */
  undoStack: Ref<UseRefHistoryRecord<Serialized>[]>

  /**
   * Records array for redo
   */
  redoStack: Ref<UseRefHistoryRecord<Serialized>[]>

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
   *
   * When `async=true`, this function may return `undefined` when no more undo steps are available. So check `canUndo` before calling it.
   */
  undo: () => PromiseOr<Async, void> | undefined

  /**
   * Redo changes
   *
   * When `async=true`, this function may return `undefined` when no more redo steps are available. So check `canRedo` before calling it.
   */
  redo: () => PromiseOr<Async, void> | undefined

  /**
   * Clear all the history
   */
  clear: () => void

  /**
   * Create a new history record
   */
  commit: () => PromiseOr<Async, void>

  /**
   * Reset ref's value with latest history
   */
  reset: () => PromiseOr<Async, void>
}

function fnBypass<F, T>(v: F) {
  return v as unknown as T
}
function fnSetSource<F>(source: Ref<F>, value: F) {
  return source.value = value
}

type FnCloneOrBypass<F, T> = (v: F) => T

function defaultDump<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone
    ? typeof clone === 'function'
      ? clone
      : cloneFnJSON
    : fnBypass
  ) as unknown as FnCloneOrBypass<R, S>
}

function defaultParse<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone
    ? typeof clone === 'function'
      ? clone
      : cloneFnJSON
    : fnBypass
  ) as unknown as FnCloneOrBypass<S, R>
}

/**
 * Track the change history of a ref, also provides undo and redo functionality.
 *
 * @see https://vueuse.org/useManualRefHistory
 * @param source
 * @param options
 */
export function useManualRefHistory<Raw, Serialized = Raw, Async extends boolean = false>(
  source: Ref<Raw>,
  options: UseManualRefHistoryOptions<Raw, Serialized, Async> = {},
): UseManualRefHistoryReturn<Raw, Serialized, Async> {
  const {
    clone = false,
    dump = defaultDump<Raw, Serialized>(clone),
    parse = defaultParse<Raw, Serialized>(clone),
    setSource = fnSetSource,
  } = options

  const _createHistoryRecord = (): Awaitable<UseRefHistoryRecord<Serialized>> => {
    const value = source.value

    const dumpResult = dump(value as any)

    if (dumpResult instanceof Promise) {
      return new Promise((resolve) => {
        dumpResult.then(
          (snapshot: Serialized) => resolve(
            markRaw({ snapshot, timestamp: timestamp() }),
          ),
        )
      })
    }

    return markRaw({ snapshot: dumpResult as Serialized, timestamp: timestamp() })
  }

  const last: Ref<UseRefHistoryRecord<Serialized>> = ref() as Ref<UseRefHistoryRecord<Serialized>>
  const undoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([])
  const redoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([])

  const _setSource = (record: UseRefHistoryRecord<Serialized>) => {
    if (options.async) {
      return new Promise<void>((resolve) => {
        const result = parse(record.snapshot)

        if (result instanceof Promise) {
          result.then((v) => {
            setSource(source, v)
            resolve()
          })
        }
        else {
          setSource(source, result as Raw)
          resolve()
        }

        last.value = record
      })
    }

    setSource(source, parse(record.snapshot) as Raw)
    last.value = record
  }

  const commit = () => {
    const before = () => {
      undoStack.value.unshift(last.value)
    }

    const after = () => {
      if (options.capacity && undoStack.value.length > options.capacity)
        undoStack.value.splice(options.capacity, Number.POSITIVE_INFINITY)

      if (redoStack.value.length)
        redoStack.value.splice(0, redoStack.value.length)
    }

    if (options.async) {
      return new Promise<void>((resolve) => {
        const historyRecord = _createHistoryRecord()

        if (historyRecord instanceof Promise) {
          historyRecord.then((record) => {
            before()
            last.value = record
            resolve()
          })
        }
        else {
          before()
          last.value = historyRecord
          resolve()
        }
      }).then(after)
    }

    before()
    last.value = _createHistoryRecord() as Awaited<ReturnType<typeof _createHistoryRecord>>
    after()
  }

  const clear = () => {
    undoStack.value.splice(0, undoStack.value.length)
    redoStack.value.splice(0, redoStack.value.length)
  }

  const undo = () => {
    const state = undoStack.value.shift()

    if (state) {
      redoStack.value.unshift(last.value)
      return _setSource(state)
    }
  }

  const redo = () => {
    const state = redoStack.value.shift()

    if (state) {
      undoStack.value.unshift(last.value)
      return _setSource(state)
    }
  }

  const reset = () => {
    return _setSource(last.value)
  }

  const history = computed(() => last.value === undefined ? [] : [last.value, ...undoStack.value])

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  /** Init `last` */

  const record = _createHistoryRecord()

  record instanceof Promise
    ? record.then(v => (last.value = v))
    : (last.value = record)

  return {
    source,
    undoStack,
    redoStack,
    last,
    history,
    canUndo,
    canRedo,

    clear,
    commit: commit as () => PromiseOr<Async, void>,
    reset: reset as () => PromiseOr<Async, void>,
    undo: undo as () => PromiseOr<Async, void> | undefined,
    redo: redo as () => PromiseOr<Async, void> | undefined,
  }
}
