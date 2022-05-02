import { ref, unref } from 'vue-demi'
import type { Fn, MaybeRef, Pausable } from './types'

export type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>
  args: Args
  thisArg: This
}

export type EventFilter<Args extends any[] = any[], This = any> = (
  invoke: Fn,
  options: FunctionWrapperOptions<Args, This>
) => void

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
  maxWait?: number
}

/**
 * @internal
 */
export function createFilterWrapper<T extends FunctionArgs>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: any[]) {
    filter(() => fn.apply(this, args), { fn, thisArg: this, args })
  }

  return wrapper as any as T
}

export const bypassFilter: EventFilter = (invoke) => {
  return invoke()
}

/**
 * Create an EventFilter that debounce the events
 *
 * @param ms
 * @param [maxWait=null]
 */
export function debounceFilter(ms: MaybeRef<number>, options: DebounceFilterOptions = {}) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let maxTimer: ReturnType<typeof setTimeout> | undefined | null

  const filter: EventFilter = (invoke) => {
    const duration = unref(ms)
    const maxDuration = unref(options.maxWait)

    if (timer)
      clearTimeout(timer)

    if (duration <= 0 || (maxDuration !== undefined && maxDuration <= 0)) {
      if (maxTimer) {
        clearTimeout(maxTimer)
        maxTimer = null
      }
      return invoke()
    }

    // Create the maxTimer. Clears the regular timer on invokation
    if (maxDuration && !maxTimer) {
      maxTimer = setTimeout(() => {
        if (timer)
          clearTimeout(timer)
        maxTimer = null
        invoke()
      }, maxDuration)
    }

    // Create the regular timer. Clears the max timer on invokation
    timer = setTimeout(() => {
      if (maxTimer)
        clearTimeout(maxTimer)
      maxTimer = null
      invoke()
    }, duration)
  }

  return filter
}

/**
 * Create an EventFilter that throttle the events
 *
 * @param ms
 * @param [trailing=true]
 * @param [leading=true]
 */
export function throttleFilter(ms: MaybeRef<number>, trailing = true, leading = true) {
  let lastExec = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let preventLeading = !leading

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  const filter: EventFilter = (invoke) => {
    const duration = unref(ms)
    const elapsed = Date.now() - lastExec

    clear()

    if (duration <= 0) {
      lastExec = Date.now()
      return invoke()
    }

    if (elapsed > duration) {
      lastExec = Date.now()
      if (preventLeading)
        preventLeading = false
      else invoke()
    }
    if (trailing) {
      timer = setTimeout(() => {
        lastExec = Date.now()
        if (!leading)
          preventLeading = true
        clear()
        invoke()
      }, duration)
    }

    if (!leading && !timer)
      timer = setTimeout(() => preventLeading = true, duration)
  }

  return filter
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

  return { isActive, pause, resume, eventFilter }
}
