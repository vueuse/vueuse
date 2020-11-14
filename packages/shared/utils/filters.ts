import { ref } from 'vue-demi'
import { Fn, Pausable } from './types'

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
  eventFilter?: EventFilter
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
 */
export function debounceFilter(ms: number) {
  if (ms <= 0)
    return bypassFilter

  let timer: ReturnType<typeof setTimeout> | undefined

  const filter: EventFilter = (invoke) => {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(invoke, ms)
  }

  return filter
}

/**
 * Create an EventFilter that throttle the events
 *
 * @param ms
 * @param [trailing=true]
 */
export function throttleFilter(ms: number, trailing = true) {
  if (ms <= 0)
    return bypassFilter

  let lastExec = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  const filter: EventFilter = (invoke) => {
    const elapsed = Date.now() - lastExec

    clear()

    if (elapsed > ms) {
      lastExec = Date.now()
      invoke()
    }
    else if (trailing) {
      timer = setTimeout(() => {
        clear()
        invoke()
      }, ms)
    }
  }

  return filter
}

/**
 * EventFilter that gives extra controls to pause and resume the filter
 *
 * @param extendFilter  Extra filter to apply when the PauseableFilter is active, default to none
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
