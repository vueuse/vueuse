import { ComputedRef, customRef, ref, watch, WatchSource } from 'vue-demi'
import { Fn } from '../utils'

export type ControlledComputed<T> = ComputedRef<T> & {
  invalidate: () => void
}

/**
 * Explicitly define the deps of computed.
 *
 * @param source
 * @param fn
 */
export function controlledComputed<T, S>(source: WatchSource<S>, fn: () => T) {
  let v: T = undefined!
  let track: Fn
  let trigger: Fn
  const dirty = ref(true)

  const invalidate = () => {
    dirty.value = true
    trigger()
  }

  watch(
    source,
    invalidate,
    { flush: 'sync' },
  )

  const r = customRef<T>((_track, _trigger) => {
    track = _track
    trigger = _trigger

    return {
      get() {
        if (dirty.value) {
          v = fn()
          dirty.value = false
        }
        track()
        return v
      },
      set() {},
    }
  }) as ControlledComputed<T>

  r.invalidate = invalidate

  return r
}
