import { onKeyStroke, KeyFilter, KeyStrokeOptions } from '../onKeyStroke'

/**
 * Listen to the keypress event of the given key.
 *
 * @see {@link https://vueuse.org/onKeyPressed}
 * @param key
 * @param handler
 * @param options
 */
export function onKeyPressed(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<KeyStrokeOptions, 'eventName'> = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keypress' })
}
