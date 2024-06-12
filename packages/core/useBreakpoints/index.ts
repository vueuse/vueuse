import type { ComputedRef, Ref } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { increaseWithUnit, toValue } from '@vueuse/shared'
import { computed } from 'vue-demi'
import { useMediaQuery } from '../useMediaQuery'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export * from './breakpoints'

export type Breakpoints<K extends string = string> = Record<K, MaybeRefOrGetter<number | string>>

export interface UseBreakpointsOptions extends ConfigurableWindow {
  /**
   * The query strategy to use for the generated shortcut methods like `.lg`
   *
   * 'min-width' - .lg will be true when the viewport is greater than or equal to the lg breakpoint (mobile-first)
   * 'max-width' - .lg will be true when the viewport is smaller than the xl breakpoint (desktop-first)
   *
   * @default "min-width"
   */
  strategy?: 'min-width' | 'max-width'
}

/**
 * Reactively viewport breakpoints
 *
 * @see https://vueuse.org/useBreakpoints
 */
export function useBreakpoints<K extends string>(
  breakpoints: Breakpoints<K>,
  options: UseBreakpointsOptions = {},
) {
  function getValue(k: MaybeRefOrGetter<K>, delta?: number) {
    let v = toValue(breakpoints[toValue(k)])

    if (delta != null)
      v = increaseWithUnit(v, delta)

    if (typeof v === 'number')
      v = `${v}px`

    return v
  }

  const { window = defaultWindow, strategy = 'min-width' } = options

  function match(query: string): boolean {
    if (!window)
      return false
    return window.matchMedia(query).matches
  }

  const greaterOrEqual = (k: MaybeRefOrGetter<K>) => {
    return useMediaQuery(() => `(min-width: ${getValue(k)})`, options)
  }

  const smallerOrEqual = (k: MaybeRefOrGetter<K>) => {
    return useMediaQuery(() => `(max-width: ${getValue(k)})`, options)
  }

  const shortcutMethods = Object.keys(breakpoints)
    .reduce((shortcuts, k) => {
      Object.defineProperty(shortcuts, k, {
        get: () => strategy === 'min-width'
          ? greaterOrEqual(k as K)
          : smallerOrEqual(k as K),
        enumerable: true,
        configurable: true,
      })
      return shortcuts
    }, {} as Record<K, Ref<boolean>>)

  function current() {
    const points = Object.keys(breakpoints).map(i => [i, greaterOrEqual(i as K)] as const)
    return computed(() => points.filter(([, v]) => v.value).map(([k]) => k))
  }

  return Object.assign(shortcutMethods, {
    greaterOrEqual,
    smallerOrEqual,
    greater(k: MaybeRefOrGetter<K>) {
      return useMediaQuery(() => `(min-width: ${getValue(k, 0.1)})`, options)
    },
    smaller(k: MaybeRefOrGetter<K>) {
      return useMediaQuery(() => `(max-width: ${getValue(k, -0.1)})`, options)
    },
    between(a: MaybeRefOrGetter<K>, b: MaybeRefOrGetter<K>) {
      return useMediaQuery(() => `(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`, options)
    },
    isGreater(k: MaybeRefOrGetter<K>) {
      return match(`(min-width: ${getValue(k, 0.1)})`)
    },
    isGreaterOrEqual(k: MaybeRefOrGetter<K>) {
      return match(`(min-width: ${getValue(k)})`)
    },
    isSmaller(k: MaybeRefOrGetter<K>) {
      return match(`(max-width: ${getValue(k, -0.1)})`)
    },
    isSmallerOrEqual(k: MaybeRefOrGetter<K>) {
      return match(`(max-width: ${getValue(k)})`)
    },
    isInBetween(a: MaybeRefOrGetter<K>, b: MaybeRefOrGetter<K>) {
      return match(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`)
    },
    current,
    active() {
      const bps = current()
      return computed(() => bps.value.length === 0 ? '' : bps.value.at(-1))
    },
  })
}

export type UseBreakpointsReturn<K extends string = string> = {
  greater: (k: MaybeRefOrGetter<K>) => ComputedRef<boolean>
  greaterOrEqual: (k: MaybeRefOrGetter<K>) => ComputedRef<boolean>
  smaller: (k: MaybeRefOrGetter<K>) => ComputedRef<boolean>
  smallerOrEqual: (k: MaybeRefOrGetter<K>) => ComputedRef<boolean>
  between: (a: MaybeRefOrGetter<K>, b: MaybeRefOrGetter<K>) => ComputedRef<boolean>
  isGreater: (k: MaybeRefOrGetter<K>) => boolean
  isGreaterOrEqual: (k: MaybeRefOrGetter<K>) => boolean
  isSmaller: (k: MaybeRefOrGetter<K>) => boolean
  isSmallerOrEqual: (k: MaybeRefOrGetter<K>) => boolean
  isInBetween: (a: MaybeRefOrGetter<K>, b: MaybeRefOrGetter<K>) => boolean
  current: () => ComputedRef<string[]>
  active: ComputedRef<string>
} & Record<K, ComputedRef<boolean>>
