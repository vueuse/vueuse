/**
 * The source code for this function was inspiried by vue-apollo's `useEventHook` util
 * https://github.com/vuejs/vue-apollo/blob/v4/packages/vue-apollo-composable/src/util/useEventHook.ts
 */

/**
 * Utility for creating event hooks
 *
 * @see https://vueuse.org/createEventHook
 */
export function createEventHook<T = any>() {
  const fns: Array<(param: T) => void> = []

  const off = (fn: (param: T) => void) => {
    const index = fns.indexOf(fn)
    if (index !== -1)
      fns.splice(index, 1)
  }

  const on = (fn: (param: T) => void) => {
    fns.push(fn)

    return {
      off: () => off(fn),
    }
  }

  const trigger = (param: T) => {
    fns.forEach(fn => fn(param))
  }

  return {
    on,
    off,
    trigger,
  }
}
