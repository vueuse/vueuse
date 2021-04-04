import { onKeyStroke, KeyFilter, KeyStrokeOptions } from '../onKeyStroke'

/**
 * Listen to the keyup event of the given key.
 *
 * @see {@link https://vueuse.org/onKeyUp}
 * @param key
 * @param handler
 * @param options
 */
export function onKeyUp(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<KeyStrokeOptions, 'eventName'> = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keyup' })
}
