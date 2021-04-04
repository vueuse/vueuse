import { onKeyStroke, KeyFilter, KeyStrokeOptions } from '../onKeyStroke'

/**
 * Listen to the keydown event of the given key.
 *
 * @see {@link https://vueuse.org/onKeyDown}
 * @param key
 * @param handler
 * @param options
 */
export function onKeyDown(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<KeyStrokeOptions, 'eventName'> = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keydown' })
}
