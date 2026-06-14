import type { MaybeRefOrGetter, Ref } from 'vue'
import type { AnyFn, ArgumentsType, Awaited, Pausable, Promisify, PromisifyFn } from './types'
import { isRef, shallowReadonly, shallowRef, toValue } from 'vue'
import { toRef } from '../toRef'
import { noop } from './is'

export type FunctionArgs<Args extends any[] = any[], Return = unknown> = (...args: Args) => Return

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>
  args: Args
  thisArg: This
}

export type EventFilter<Args extends any[] = any[], This = any, Invoke extends AnyFn = AnyFn> = (
  invoke: Invoke,
  options: FunctionWrapperOptions<Args, This>,
) => ReturnType<Invoke> | Promisify<ReturnType<Invoke>>

export interface CancelableEventFilter<Args extends any[] = any[], This = any, Invoke extends AnyFn = AnyFn> {
  (invoke: Invoke, options: FunctionWrapperOptions<Args, This>): ReturnType<Invoke> | Promisify<ReturnType<Invoke>>
  cancel: () => void
  flush: () => void
  readonly isPending: Readonly<Ref<boolean>>
}

export interface ConfigurableEventFilter {
  /**
   * Filter for if events should to be received.
   *
   * @see https://vueuse.org/guide/config.html#event-filters
   */
  eventFilter?: EventFilter
}

export interface DebounceFilterOptions {
  /**
   * The maximum time allowed to be delayed before it's invoked.
   * In milliseconds.
   */
  maxWait?: MaybeRefOrGetter<number>

  /**
   * Whether to reject the last call if it's been cancel.
   *
   * @default false
   */
  rejectOnCancel?: boolean
}

export type CancelablePromisifyFn<T extends AnyFn> = PromisifyFn<T> & {
  cancel: () => void
  flush: () => void
  readonly isPending: Readonly<Ref<boolean>>
}

/**
 * @internal
 */
export function createFilterWrapper<T extends AnyFn>(filter: CancelableEventFilter, fn: T): CancelablePromisifyFn<T>
export function createFilterWrapper<T extends AnyFn>(filter: EventFilter, fn: T): PromisifyFn<T>
export function createFilterWrapper<T extends AnyFn>(filter: EventFilter | CancelableEventFilter, fn: T) {
  function wrapper(this: any, ...args: ArgumentsType<T>) {
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      // make sure it's a promise
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args }))
        .then(resolve)
        .catch(reject)
    })
  }

  if ('cancel' in filter) {
    Object.assign(wrapper, {
      cancel: filter.cancel,
      flush: filter.flush,
      isPending: filter.isPending,
    })
  }

  return wrapper
}

export const bypassFilter: EventFilter = (invoke) => {
  return invoke()
}

/**
 * Create an EventFilter that debounce the events
 */
export function debounceFilter(ms: MaybeRefOrGetter<number>, options: DebounceFilterOptions = {}): CancelableEventFilter {
  let timer: ReturnType<typeof setTimeout> | undefined
  let maxTimer: ReturnType<typeof setTimeout> | undefined
  let lastRejector: AnyFn = noop
  let lastResolve: AnyFn = noop
  const _pending = shallowRef(false)

  let lastInvoker: (() => void) | undefined

  const handler = (invoke: AnyFn) => {
    const duration = toValue(ms)
    const maxDuration = toValue(options.maxWait)

    if (timer) {
      clearTimeout(timer)
      lastRejector()
      lastRejector = noop
      timer = undefined
    }

    if (duration <= 0 || (maxDuration !== undefined && maxDuration <= 0)) {
      if (maxTimer) {
        clearTimeout(maxTimer)
        lastRejector()
        lastRejector = noop
        maxTimer = undefined
      }
      _pending.value = false
      return Promise.resolve(invoke())
    }

    _pending.value = true

    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve
      lastResolve = resolve
      lastInvoker = invoke

      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer) {
            clearTimeout(timer)
            timer = undefined
          }
          maxTimer = undefined
          _pending.value = false
          resolve(lastInvoker!())
        }, maxDuration)
      }

      timer = setTimeout(() => {
        if (maxTimer) {
          clearTimeout(maxTimer)
          maxTimer = undefined
        }
        _pending.value = false
        resolve(invoke())
      }, duration)
    })
  }

  const filter: CancelableEventFilter = Object.assign(handler, {
    cancel: () => {
      if (timer) {
        clearTimeout(timer)
        lastRejector()
        lastRejector = noop
        timer = undefined
      }
      if (maxTimer) {
        clearTimeout(maxTimer)
        maxTimer = undefined
      }
      _pending.value = false
      lastResolve = noop
    },
    flush: () => {
      if (_pending.value && lastInvoker) {
        if (timer) {
          clearTimeout(timer)
          timer = undefined
        }
        if (maxTimer) {
          clearTimeout(maxTimer)
          maxTimer = undefined
        }
        _pending.value = false
        const resolve = lastResolve
        lastRejector = noop
        lastResolve = noop
        resolve(lastInvoker!())
        lastInvoker = undefined
      }
    },
    isPending: shallowReadonly(_pending),
  })

  return filter
}

export interface ThrottleFilterOptions {
  /**
   * The maximum time allowed to be delayed before it's invoked.
   */
  delay: MaybeRefOrGetter<number>
  /**
   * Whether to invoke on the trailing edge of the timeout.
   */
  trailing?: boolean
  /**
   * Whether to invoke on the leading edge of the timeout.
   */
  leading?: boolean
  /**
   * Whether to reject the last call if it's been cancel.
   */
  rejectOnCancel?: boolean
}

// TODO v11: refactor the params to object
/**
 * Create an EventFilter that throttle the events
 */
export function throttleFilter(ms: MaybeRefOrGetter<number>, trailing?: boolean, leading?: boolean, rejectOnCancel?: boolean): EventFilter
export function throttleFilter(options: ThrottleFilterOptions): EventFilter
export function throttleFilter(...args: any[]) {
  let lastExec = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let isLeading = true
  let lastRejector: AnyFn = noop
  let lastValue: any

  // Resolve overloads once at creation time
  let ms: MaybeRefOrGetter<number>
  let trailing: boolean
  let leading: boolean
  let rejectOnCancel: boolean
  if (!isRef(args[0]) && typeof args[0] === 'object') {
    const opts = args[0] as ThrottleFilterOptions
    ms = opts.delay
    trailing = opts.trailing ?? true
    leading = opts.leading ?? true
    rejectOnCancel = opts.rejectOnCancel ?? false
  }
  else {
    ms = args[0]
    trailing = args[1] ?? true
    leading = args[2] ?? true
    rejectOnCancel = args[3] ?? false
  }

  const filter: EventFilter = (_invoke) => {
    const duration = toValue(ms)
    const elapsed = Date.now() - lastExec

    // Clear any pending timer
    if (timer) {
      clearTimeout(timer)
      timer = undefined
      lastRejector()
      lastRejector = noop
    }

    if (duration <= 0) {
      lastExec = Date.now()
      lastValue = _invoke()
      return lastValue
    }

    if (elapsed > duration) {
      lastExec = Date.now()
      if (leading || !isLeading) {
        lastValue = _invoke()
      }
    }
    else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve
        timer = setTimeout(() => {
          lastExec = Date.now()
          isLeading = true
          resolve(_invoke())
          timer = undefined
          lastRejector = noop
        }, Math.max(0, duration - elapsed))
      })
    }

    if (!leading && !timer)
      timer = setTimeout(() => { isLeading = true }, duration)

    isLeading = false
    return lastValue
  }

  return filter
}

export interface PausableFilterOptions {
  /**
   * The initial state
   *
   * @default 'active'
   */
  initialState?: 'active' | 'paused'
}

/**
 * EventFilter that gives extra controls to pause and resume the filter
 *
 * @param extendFilter  Extra filter to apply when the PausableFilter is active, default to none
 * @param options Options to configure the filter
 */
export function pausableFilter(extendFilter: EventFilter = bypassFilter, options: PausableFilterOptions = {}): Pausable & { eventFilter: EventFilter } {
  const {
    initialState = 'active',
  } = options

  const isActive = toRef(initialState === 'active')

  function pause() {
    isActive.value = false
  }
  function resume() {
    isActive.value = true
  }

  const eventFilter: EventFilter = (...args) => {
    if (isActive.value)
      extendFilter(...args)
  }

  return { isActive: shallowReadonly(isActive), pause, resume, eventFilter }
}
