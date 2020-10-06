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

const fnClone = <F, T>(v: F): T => JSON.parse(JSON.stringify(v))
const fnBypass = <F, T>(v: F) => v as unknown as T

export function useRefHistory<Raw, Serialized = Raw>(
  r: Ref<Raw>,
  options: UseRefHistoryOptions<Raw, Serialized> = {},
) {
  const prev: UseRefHistoryRecord<Serialized>[] = []
  const next: UseRefHistoryRecord<Serialized>[] = []
  const tracking = ref(true)

  const dump = options.dump || (options.clone ? fnClone : fnBypass)
  const parse = options.parse || fnBypass

  const stop = watch(
    r,
    (value) => {
      if (!tracking.value)
        return

      prev.unshift({
        value: dump(value),
        timestamp: timestamp(),
      })

      if (options.capacity && prev.length > options.capacity)
        prev.splice(options.capacity, Infinity)
      if (next.length)
        next.splice(0, next.length)
    },
    {
      deep: options.deep,
      immediate: true,
      flush: 'sync',
    },
  )

  const clear = () => {
    prev.splice(0, prev.length)
    next.splice(0, next.length)
  }

  const pause = () => (tracking.value = false)
  const resume = () => (tracking.value = true)

  const undo = () => {
    const previous = tracking.value
    tracking.value = false

    const state = prev.shift()

    if (state)
      next.unshift(state)
    if (prev[0])
      r.value = parse(prev[0].value)

    tracking.value = previous
  }

  const redo = () => {
    const previous = tracking.value
    tracking.value = false

    const state = next.shift()

    if (state) {
      r.value = parse(state.value)
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
