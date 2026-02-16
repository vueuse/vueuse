import type { MaybeRefOrGetter, Ref } from 'vue'
import type { AnyFn, ArgumentsType, Awaited, Pausable, Promisify, PromisifyFn, TimerHandle } from './types'
import { isRef, readonly, shallowRef, toValue } from 'vue'
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
  let timer: TimerHandle
  let maxTimer: TimerHandle
  let lastRejector: AnyFn = noop
  let lastResolve: AnyFn = noop
  const _pending = shallowRef(false)

  const _clearTimeout = (timer: TimerHandle) => {
    clearTimeout(timer)
    lastRejector()
    lastRejector = noop
  }

  let lastInvoker: () => void

  const handler = (invoke: AnyFn) => {
    const duration = toValue(ms)
    const maxDuration = toValue(options.maxWait)

    if (timer)
      _clearTimeout(timer)

    if (duration <= 0 || (maxDuration !== undefined && maxDuration <= 0)) {
      if (maxTimer) {
        _clearTimeout(maxTimer)
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
      // Create the maxTimer. Clears the regular timer on invoke
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer)
            _clearTimeout(timer)
          maxTimer = undefined
          _pending.value = false
          resolve(lastInvoker())
        }, maxDuration)
      }

      // Create the regular timer. Clears the max timer on invoke
      timer = setTimeout(() => {
        if (maxTimer)
          _clearTimeout(maxTimer)
        maxTimer = undefined
        _pending.value = false
        resolve(invoke())
      }, duration)
    })
  }

  const filter: CancelableEventFilter = Object.assign(handler, {
    cancel: () => {
      if (timer) {
        _clearTimeout(timer)
        timer = undefined
      }
      if (maxTimer) {
        _clearTimeout(maxTimer)
        maxTimer = undefined
      }
      _pending.value = false
    },
    flush: () => {
      if (_pending.value) {
        // Clear timers without triggering lastRejector
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
        resolve(lastInvoker())
      }
    },
    isPending: readonly(_pending),
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
  let timer: TimerHandle
  let isLeading = true
  let lastRejector: AnyFn = noop
  let lastValue: any
  let ms: MaybeRefOrGetter<number>
  let trailing: boolean
  let leading: boolean
  let rejectOnCancel: boolean
  if (!isRef(args[0]) && typeof args[0] === 'object')
    ({ delay: ms, trailing = true, leading = true, rejectOnCancel = false } = args[0])
  else
    [ms, trailing = true, leading = true, rejectOnCancel = false] = args
  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
      lastRejector()
      lastRejector = noop
    }
  }

  const filter: EventFilter = (_invoke) => {
    const duration = toValue(ms)
    const elapsed = Date.now() - lastExec
    const invoke = () => {
      return lastValue = _invoke()
    }

    clear()

    if (duration <= 0) {
      lastExec = Date.now()
      return invoke()
    }
    if (elapsed > duration) {
      lastExec = Date.now()
      if (leading || !isLeading)
        invoke()
    }
    else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve
        timer = setTimeout(() => {
          lastExec = Date.now()
          isLeading = true
          resolve(invoke())
          clear()
        }, Math.max(0, duration - elapsed))
      })
    }

    if (!leading && !timer)
      timer = setTimeout(() => isLeading = true, duration)

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

  return { isActive: readonly(isActive), pause, resume, eventFilter }
}
