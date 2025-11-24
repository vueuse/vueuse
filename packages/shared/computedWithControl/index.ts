import type { ComputedGetter, ComputedRef, MultiWatchSources, WatchOptions, WatchSource, WritableComputedOptions, WritableComputedRef } from 'vue'
import type { Fn } from '../utils'
import { customRef, watch } from 'vue'

export interface ComputedWithControlRefExtra {
  /**
   * Force update the computed value.
   */
  trigger: () => void
}

export interface ComputedRefWithControl<T> extends ComputedRef<T>, ComputedWithControlRefExtra {}
export interface WritableComputedRefWithControl<T> extends WritableComputedRef<T>, ComputedWithControlRefExtra {}

export type ComputedWithControlRef<T = any> = ComputedRefWithControl<T> | WritableComputedRefWithControl<T>

export function computedWithControl<T>(
  source: WatchSource | MultiWatchSources,
  fn: ComputedGetter<T>,
  options?: WatchOptions
): ComputedRefWithControl<T>

export function computedWithControl<T>(
  source: WatchSource | MultiWatchSources,
  fn: WritableComputedOptions<T>,
  options?: WatchOptions
): WritableComputedRefWithControl<T>

/**
 * Explicitly define the deps of computed.
 *
 * @param source
 * @param fn
 */
export function computedWithControl<T>(
  source: WatchSource | MultiWatchSources,
  fn: ComputedGetter<T> | WritableComputedOptions<T>,
  options: WatchOptions = {},
): ComputedWithControlRef<T> {
  let v: T = undefined!
  let track: Fn
  let trigger: Fn
  let dirty = true

  const update = () => {
    dirty = true
    trigger()
  }

  watch(source, update, { flush: 'sync', ...options })

  const get = typeof fn === 'function' ? fn : fn.get
  const set = typeof fn === 'function' ? undefined : fn.set

  const result = customRef<T>((_track, _trigger) => {
    track = _track
    trigger = _trigger

    return {
      get() {
        if (dirty) {
          v = get(v)
          dirty = false
        }
        track()
        return v
      },
      set(v) {
        set?.(v)
      },
    }
  }) as ComputedRefWithControl<T>

  result.trigger = update
  return result
}

/** @deprecated use `computedWithControl` instead */
export const controlledComputed = computedWithControl
