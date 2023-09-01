import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { defaultWindow } from '../_configurable'

export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = true | string | string[] | KeyPredicate
export type KeyStrokeEventName = 'keydown' | 'keypress' | 'keyup'

type IgnoreElementCase = MaybeRefOrGetter<(string | HTMLElement | ((event: KeyboardEvent) => boolean))>
export interface OnKeyStrokeOptions {
  eventName?: KeyStrokeEventName
  target?: MaybeRefOrGetter<EventTarget | null | undefined>
  passive?: boolean
  /**
   * Set to `true` to ignore repeated events when the key is being held down.
   *
   * @default false
   */
  dedupe?: MaybeRefOrGetter<boolean>
  ignoreElements?: IgnoreElementCase[]
}

function createKeyPredicate(keyFilter: KeyFilter): KeyPredicate {
  if (typeof keyFilter === 'function')
    return keyFilter

  else if (typeof keyFilter === 'string')
    return (event: KeyboardEvent) => event.key === keyFilter

  else if (Array.isArray(keyFilter))
    return (event: KeyboardEvent) => keyFilter.includes(event.key)

  return () => true
}

export function onKeyStroke(key: KeyFilter, handler: (event: KeyboardEvent) => void, options?: OnKeyStrokeOptions): () => void
export function onKeyStroke(handler: (event: KeyboardEvent) => void, options?: OnKeyStrokeOptions): () => void

/**
 * Listen for keyboard keystrokes.
 *
 * @see https://vueuse.org/onKeyStroke
 */
export function onKeyStroke(key: KeyFilter, handler: (event: KeyboardEvent) => void, options?: OnKeyStrokeOptions): () => void
export function onKeyStroke(handler: (event: KeyboardEvent) => void, options?: OnKeyStrokeOptions): () => void
export function onKeyStroke(...args: any[]) {
  let key: KeyFilter
  let handler: (event: KeyboardEvent) => void
  let options: OnKeyStrokeOptions = {}

  if (args.length === 3) {
    key = args[0]
    handler = args[1]
    options = args[2]
  }
  else if (args.length === 2) {
    if (typeof args[1] === 'object') {
      key = true
      handler = args[0]
      options = args[1]
    }
    else {
      key = args[0]
      handler = args[1]
    }
  }
  else {
    key = true
    handler = args[0]
  }

  const {
    target = defaultWindow,
    eventName = 'keydown',
    passive = false,
    dedupe = false,
    ignoreElements = [] as IgnoreElementCase[],
  } = options
  const predicate = createKeyPredicate(key)

  function isIgnoredCase(e: KeyboardEvent) {
    return ignoreElements.some((ignoreCase: any) => {
      if (typeof ignoreCase === 'function')
        return ignoreCase(e) as boolean

      const rawCase = toValue(ignoreCase)

      if (typeof rawCase === 'string' && e.target)
        return (e.target as HTMLElement).tagName === rawCase.toUpperCase()

      else if (rawCase instanceof HTMLElement)
        return rawCase === e.target

      return false
    })
  }

  const listener = (e: KeyboardEvent) => {
    if ((e.repeat && toValue(dedupe)) || isIgnoredCase(e))
      return

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
