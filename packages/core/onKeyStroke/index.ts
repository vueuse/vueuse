import type { MaybeComputedRef } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { defaultWindow } from '../_configurable'

export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = null | undefined | string | string[] | KeyPredicate
export type KeyStrokeEventName = 'keydown' | 'keypress' | 'keyup'
export interface OnKeyStrokeOptions {
  eventName?: KeyStrokeEventName
  target?: MaybeComputedRef<EventTarget>
  passive?: boolean
}

const createKeyPredicate = (keyFilter: KeyFilter): KeyPredicate => {
  if (typeof keyFilter === 'function')
    return keyFilter

  else if (typeof keyFilter === 'string')
    return (event: KeyboardEvent) => event.key === keyFilter

  else if (Array.isArray(keyFilter))
    return (event: KeyboardEvent) => keyFilter.includes(event.key)

  else if (keyFilter)
    return () => true

  else
    return () => false
}

/**
 * Listen for keyboard keys being stroked.
 *
 * @see https://vueuse.org/onKeyStroke
 * @param key
 * @param handler
 * @param options
 */
export function onKeyStroke(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: OnKeyStrokeOptions = {}) {
  const { target = defaultWindow, eventName = 'keydown', passive = false } = options
  const predicate = createKeyPredicate(key)
  const listener = (e: KeyboardEvent) => {
    if (predicate(e))
      handler(e)
  }

  return useEventListener(target, eventName, listener, passive)
}

/**
 * Listen to the keydown event of the given key.
 *
 * @see https://vueuse.org/onKeyStroke
 * @param key
 * @param handler
 * @param options
 */
export function onKeyDown(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<OnKeyStrokeOptions, 'eventName'> = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keydown' })
}

/**
 * Listen to the keypress event of the given key.
 *
 * @see https://vueuse.org/onKeyStroke
 * @param key
 * @param handler
 * @param options
 */
export function onKeyPressed(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<OnKeyStrokeOptions, 'eventName'> = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keypress' })
}

/**
 * Listen to the keyup event of the given key.
 *
 * @see https://vueuse.org/onKeyStroke
 * @param key
 * @param handler
 * @param options
 */
export function onKeyUp(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<OnKeyStrokeOptions, 'eventName'> = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keyup' })
}
