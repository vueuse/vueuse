export type EventFilter = (invoke: () => void) => void

export interface ConfigurableEventFilter {
  eventFilter?: EventFilter
}

/**
 * @internal
 */
export function createFilterWrapper<T extends Function>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: any[]) {
    filter(() => fn.apply(this, args))
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
