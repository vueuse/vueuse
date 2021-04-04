import {
  useEventListener,
} from '../useEventListener'
import { defaultWindow } from '../_configurable'
import { MaybeRef } from '@vueuse/shared'

export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = null | undefined | string | KeyPredicate
export type KeyStrokeEventName = 'keydown' | 'keypress' | 'keyup'
export type KeyStrokeOptions = {
  eventName?: KeyStrokeEventName
  target?: MaybeRef<EventTarget>
  passive?: boolean
}

const createKeyPredicate = (keyFilter: KeyFilter): KeyPredicate =>
  typeof keyFilter === 'function'
    ? keyFilter
    : typeof keyFilter === 'string'
      ? (event: KeyboardEvent) => event.key === keyFilter
      : keyFilter
        ? () => true
        : () => false

/**
 * Listen for keyboard keys being stroked.
 *
 * @see {@link https://vueuse.org/onKeyStroke}
 * @param key
 * @param handler
 * @param options
 */
export function onKeyStroke(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: KeyStrokeOptions = {}) {
  const { target = defaultWindow, eventName = 'keydown', passive = false } = options
  const predicate = createKeyPredicate(key)
  const listener = (e: KeyboardEvent) => {
    if (predicate(e))
      handler(e)
  }

  return useEventListener(target, eventName, listener, passive)
}
