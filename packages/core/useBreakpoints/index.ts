import { Ref } from 'vue-demi'
import { increaseWithUnit } from '@vueuse/shared'
import { useMediaQuery } from '../useMediaQuery'
import { ConfigurableWindow, defaultWindow } from '../_configurable'
export * from './breakpoints'

export type Breakpoints<K extends string = string> = Record<K, number | string>

/**
 * Reactively viewport breakpoints
 *
 * @see https://vueuse.org/useBreakpoints
 * @param options
 */
export function useBreakpoints<K extends string>(breakpoints: Breakpoints<K>, options: ConfigurableWindow = {}) {
  function getValue(k: K, delta?: number) {
    let v = breakpoints[k]

    if (delta != null)
      v = increaseWithUnit(v, delta)

    if (typeof v === 'number')
      v = `${v}px`

    return v
  }

  const { window = defaultWindow } = options

  function match(query: string): boolean {
    if (!window)
      return false
    return window.matchMedia(query).matches
  }

  const greater = (k: K) => {
    return useMediaQuery(`(min-width: ${getValue(k)})`, options)
  }

  const shortcutMethods = Object.keys(breakpoints)
    .reduce((shortcuts, k) => {
      Object.defineProperty(shortcuts, k, {
        get: () => greater(k as K),
        enumerable: true,
        configurable: true,
      })
      return shortcuts
    }, {} as Record<K, Ref<boolean>>)

  return {
    greater,
    smaller(k: K) {
      return useMediaQuery(`(max-width: ${getValue(k, -0.1)})`, options)
    },
    between(a: K, b: K) {
      return useMediaQuery(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`, options)
    },
    isGreater(k: K) {
      return match(`(min-width: ${getValue(k)})`)
    },
    isSmaller(k: K) {
      return match(`(max-width: ${getValue(k, -0.1)})`)
    },
    isInBetween(a: K, b: K) {
      return match(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`)
    },
    ...shortcutMethods,
  }
}

export type UseBreakpointsReturn = ReturnType<typeof useBreakpoints>
