import { customRef } from 'vue-demi'
import { extendRef } from '../extendRef'
import type { Fn } from '../utils'

export interface ControlledRefOptions<T> {
  /**
   * Callback function before the ref changing.
   *
   * Returning `false` to dismiss the change.
   */
  onBeforeChange?: (value: T, oldValue: T) => void | boolean

  /**
   * Callback function after the ref changed
   *
   * This happens synchronously, with less overhead compare to `watch`
   */
  onChanged?: (value: T, oldValue: T) => void
}

/**
 * Explicitly define the deps of computed.
 *
 * @param source
 * @param fn
 */
export function refWithControl<T>(initial: T, options: ControlledRefOptions<T> = {}) {
  let source = initial
  let track: Fn
  let trigger: Fn

  const ref = customRef<T>((_track, _trigger) => {
    track = _track
    trigger = _trigger

    return {
      get() {
        return get()
      },
      set(v) {
        set(v)
      },
    }
  })

  function get(tracking = true) {
    if (tracking)
      track()
    return source
  }

  function set(value: T, triggering = true) {
    if (value === source)
      return

    const old = source
    if (options.onBeforeChange?.(value, old) === false)
      return // dismissed

    source = value

    options.onChanged?.(value, old)

    if (triggering)
      trigger()
  }

  /**
   * Get the value without tracked in the reactivity system
   */
  const untrackedGet = () => get(false)
  /**
   * Set the value without triggering the reactivity system
   */
  const silentSet = (v: T) => set(v, false)

  /**
   * Get the value without tracked in the reactivity system.
   *
   * Alias for `untrackedGet()`
   */
  const peek = () => get(false)

  /**
   * Set the value without triggering the reactivity system
   *
   * Alias for `silentSet(v)`
   */
  const lay = (v: T) => set(v, false)

  return extendRef(
    ref,
    {
      get,
      set,
      untrackedGet,
      silentSet,
      peek,
      lay,
    },
    { enumerable: true },
  )
}

/**
 * Alias for `refWithControl`
 */
export const controlledRef = refWithControl
