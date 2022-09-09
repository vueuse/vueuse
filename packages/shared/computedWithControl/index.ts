import type { ComputedGetter, ComputedRef, WatchSource, WritableComputedOptions, WritableComputedRef } from 'vue-demi'
import { customRef, ref, watch } from 'vue-demi'
import type { Fn } from '../utils'
import { isFunction } from '../utils'

export interface ComputedWithControlRefExtra {
  /**
   * Force update the computed value.
   */
  trigger(): void
}

export interface ComputedRefWithControl<T> extends ComputedRef<T>, ComputedWithControlRefExtra {}
export interface WritableComputedRefWithControl<T> extends WritableComputedRef<T>, ComputedWithControlRefExtra {}

export type ArrayComputedRefWithControl<T> = [ComputedRef<T>, ComputedWithControlRefExtra['trigger']]
export type ArrayWritableComputedRefWithControl<T> = [WritableComputedRef<T>, ComputedWithControlRefExtra['trigger']]

export function computedWithControl<T, S, U extends boolean = false>(
  source: WatchSource<S> | WatchSource<S>[],
  fn: ComputedGetter<T>,
  separate?: U
): U extends true
  ? ArrayComputedRefWithControl<T>
  : ComputedRefWithControl<T>

export function computedWithControl<T, S, U extends boolean = false>(
  source: WatchSource<S> | WatchSource<S>[],
  fn: WritableComputedOptions<T>,
  separate?: U
): U extends true
  ? ArrayWritableComputedRefWithControl<T>
  : WritableComputedRefWithControl<T>

/**
 * Explicitly define the deps of computed.
 *
 * @param source
 * @param fn
 * @param separate `true` is both compatible vue2/vue3.
 * `false` by default for backward usage compatibility.
 */
export function computedWithControl<T, S>(
  source: WatchSource<S> | WatchSource<S>[],
  fn: ComputedGetter<T> | WritableComputedOptions<T>,
  separate: false,
) {
  let v: T = undefined!
  let track: Fn
  let trigger: Fn
  const dirty = ref(true)

  const update = () => {
    dirty.value = true
    trigger()
  }

  watch(source, update, { flush: 'sync' })

  const get = isFunction(fn) ? fn : fn.get
  const set = isFunction(fn) ? undefined : fn.set

  const result = customRef<T>((_track, _trigger) => {
    track = _track
    trigger = _trigger

    return {
      get() {
        if (dirty.value) {
          v = get()
          dirty.value = false
        }
        track()
        return v
      },
      set(v) {
        set?.(v)
      },
    }
  }) as ComputedRefWithControl<T>

  if (separate)
    return [result, update] as ArrayComputedRefWithControl<T>

  if (Object.isExtensible(result))
    result.trigger = update

  return result
}

// alias
export { computedWithControl as controlledComputed }
