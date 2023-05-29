import { readonly, ref } from 'vue-demi'
import { toValue } from '../toValue'
import { noop } from './is'
import type { AnyFn, ArgumentsType, MaybeRefOrGetter, Pausable } from './types'

export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>
  args: Args
  thisArg: This
}

export type EventFilter<Args extends any[] = any[], This = any, Invoke extends AnyFn = AnyFn> = (
  invoke: Invoke,
  options: FunctionWrapperOptions<Args, This>
) => ReturnType<Invoke> | Promise<ReturnType<Invoke>>

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

  /**
   * Specify invoking on the leading edge of the timeout.
   *
   * @default false
   */
  leading?: boolean

  /**
   * Specify invoking on the trailing edge of the timeout.
   *
   * @default true
   */
  trailing?: boolean
}

/**
 * @internal
 */
export function createFilterWrapper<T extends AnyFn>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: ArgumentsType<T>) {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      // make sure it's a promise
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args }))
        .then(resolve)
        .catch(reject)
    })
  }

  return wrapper
}

export const bypassFilter: EventFilter = (invoke) => {
  return invoke()
}

/**
 * Create an EventFilter that debounce the events
 *
 * @param ms
 * @param options
 */
export function debounceFilter(ms: MaybeRefOrGetter<number>, options: DebounceFilterOptions = {}) {
  let lastInvokeTime = 0
  let lastRejector: AnyFn = noop
  let lastValue: any
  let timer: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
      lastRejector()
      lastRejector = noop
    }
  }

  const filter: EventFilter = (fn) => {
    const { leading, maxWait, rejectOnCancel, trailing = true } = options
    const duration = toValue(ms)
    const maxDuration = Math.max(toValue(maxWait) || 0, duration)
    const didTimeout = timer != null
    const withMaxWait = maxWait != null
    const timeStamp = Date.now()

    clear()

    const invoke = (time: number) => {
      lastInvokeTime = time
      return (lastValue = fn())
    }

    if (duration <= 0 || (withMaxWait && maxDuration <= 0))
      return Promise.resolve(invoke(timeStamp))

    if (withMaxWait) {
      if (!didTimeout && !leading)
        lastInvokeTime = timeStamp

      const elapsedTime = timeStamp - lastInvokeTime

      if (elapsedTime >= maxDuration && (didTimeout || leading)) {
        invoke(timeStamp)
      }
      else if (trailing) {
        const timeRemaining = Math.max(
          0,
          Math.min(duration - elapsedTime, maxDuration - elapsedTime),
        )

        lastValue = new Promise((resolve, reject) => {
          lastRejector = rejectOnCancel ? reject : resolve

          timer = setTimeout(() => {
            timer = undefined
            resolve(invoke(Date.now()))
          }, timeRemaining)
        })
      }
    }
    else {
      const elapsedTime = timeStamp - lastInvokeTime

      if (elapsedTime >= duration && !didTimeout && leading) {
        invoke(timeStamp)
      }
      else if (trailing) {
        lastValue = new Promise((resolve, reject) => {
          lastRejector = rejectOnCancel ? reject : resolve

          timer = setTimeout(() => {
            timer = undefined
            resolve(invoke(Date.now()))
          }, duration)
        })
      }
    }

    return lastValue
  }

  return filter
}

/**
 * Create an EventFilter that throttle the events
 *
 * @param ms
 * @param [trailing=true]
 * @param [leading=true]
 * @param [rejectOnCancel=false]
 */
export function throttleFilter(ms: MaybeRefOrGetter<number>, trailing = true, leading = true, rejectOnCancel = false) {
  return debounceFilter(ms, { leading, trailing, rejectOnCancel, maxWait: ms })
}

/**
 * EventFilter that gives extra controls to pause and resume the filter
 *
 * @param extendFilter  Extra filter to apply when the PausableFilter is active, default to none
 *
 */
export function pausableFilter(extendFilter: EventFilter = bypassFilter): Pausable & { eventFilter: EventFilter } {
  const isActive = ref(true)

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
