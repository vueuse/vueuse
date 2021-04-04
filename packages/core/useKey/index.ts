import {
  useEventListener,
} from '../useEventListener'
import { defaultWindow } from '../_configurable'
import { Fn, isFunction, isString, MaybeRef } from '@vueuse/shared'

export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = null | undefined | string | ((event: KeyboardEvent) => boolean)
export type Handler = (event: KeyboardEvent) => void
export type EventType = 'keydown' | 'keypress' | 'keyup'

const createKeyPredicate = (keyFilter: KeyFilter): KeyPredicate =>
  typeof keyFilter === 'function'
    ? keyFilter
    : typeof keyFilter === 'string'
      ? (event: KeyboardEvent) => event.key === keyFilter
      : keyFilter
        ? () => true
        : () => false

export function useKey(
  target: MaybeRef<EventTarget | null | undefined>,
  key: KeyFilter,
  handler: Handler,
  event?: EventType,
  options?: boolean | AddEventListenerOptions
): Fn

export function useKey(
  key: KeyFilter,
  handler: Handler,
  event?: EventType,
  options?: boolean | AddEventListenerOptions
): Fn

export function useKey(...args: any[]) {
  let target: MaybeRef<EventTarget> | undefined
  let key: KeyFilter
  let handler: any
  let eventName: EventType
  let options: any

  if (isString(args[0]) || isFunction(args[0])) {
    [key, handler, eventName = 'keydown', options] = args
    target = defaultWindow
  }
  else {
    [target, key, handler, eventName = 'keydown', options] = args
    target = defaultWindow
  }

  const predicate = createKeyPredicate(key)
  const listener = (e: KeyboardEvent) => {
    if (predicate(e))
      handler(e)
  }

  return useEventListener(target, eventName, listener, options)
}
