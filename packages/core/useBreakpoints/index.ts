import type { ComputedRef, Ref } from 'vue-demi'
import { increaseWithUnit } from '@vueuse/shared'
import { computed } from 'vue-demi'
import { useMediaQuery } from '../useMediaQuery'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export * from './breakpoints'

export type Breakpoints<K extends string = string> = Record<K, number | string>

/**
 * Reactively viewport breakpoints
 *
 * @see https://vueuse.org/useBreakpoints
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

  const greaterOrEqual = (k: K) => {
    return useMediaQuery(`(min-width: ${getValue(k)})`, options)
  }

  const shortcutMethods = Object.keys(breakpoints)
    .reduce((shortcuts, k) => {
      Object.defineProperty(shortcuts, k, {
        get: () => greaterOrEqual(k as K),
        enumerable: true,
        configurable: true,
      })
      return shortcuts
    }, {} as Record<K, Ref<boolean>>)

  return Object.assign(shortcutMethods, {
    greater(k: K) {
      return useMediaQuery(`(min-width: ${getValue(k, 0.1)})`, options)
    },
    greaterOrEqual,
    smaller(k: K) {
      return useMediaQuery(`(max-width: ${getValue(k, -0.1)})`, options)
    },
    smallerOrEqual(k: K) {
      return useMediaQuery(`(max-width: ${getValue(k)})`, options)
    },
    between(a: K, b: K) {
      return useMediaQuery(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`, options)
    },
    isGreater(k: K) {
      return match(`(min-width: ${getValue(k, 0.1)})`)
    },
    isGreaterOrEqual(k: K) {
      return match(`(min-width: ${getValue(k)})`)
    },
    isSmaller(k: K) {
      return match(`(max-width: ${getValue(k, -0.1)})`)
    },
    isSmallerOrEqual(k: K) {
      return match(`(max-width: ${getValue(k)})`)
    },
    isInBetween(a: K, b: K) {
      return match(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`)
    },
    current() {
      const points = Object.keys(breakpoints).map(i => [i, greaterOrEqual(i as K)] as const)
      return computed(() => points.filter(([, v]) => v.value).map(([k]) => k))
    },
  })
}

export type UseBreakpointsReturn<K extends string = string> = {
  greater: (k: K) => ComputedRef<boolean>
  greaterOrEqual: (k: K) => ComputedRef<boolean>
  smaller(k: K): ComputedRef<boolean>
  smallerOrEqual: (k: K) => ComputedRef<boolean>
  between(a: K, b: K): ComputedRef<boolean>
  isGreater(k: K): boolean
  isGreaterOrEqual(k: K): boolean
  isSmaller(k: K): boolean
  isSmallerOrEqual(k: K): boolean
  isInBetween(a: K, b: K): boolean
  current(): ComputedRef<string[]>
} & Record<K, ComputedRef<boolean>>
