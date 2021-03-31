import { useMediaQuery } from '../useMediaQuery'
import { ConfigurableWindow } from '../_configurable'

export const breakpointsTailwind = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
}

/**
 * Reactively viewport breakpoints
 *
 * @see   {@link https://vueuse.org/useBreakpoints}
 * @param options
 */
export function useBreakpoints<K extends string>(breakpoints: Record<K, number | string>, options: ConfigurableWindow = {}) {
  function getValue(k: K, modifier?: (v: number) => string | number) {
    let v = breakpoints[k]

    if (modifier)
      v = modifier(parseInt(v.toString()))

    if (typeof v === 'number')
      v = `${v}px`
    return v
  }
  // const { window = defaultWindow } = options

  // function match(query: string) {
  //   if (!window)
  //     return false
  //   return window.matchMedia(query)
  // }

  return {
    greater(k: K) {
      return useMediaQuery(`(min-width: ${getValue(k)})`, options)
    },
    smaller(k: K) {
      return useMediaQuery(`(max-width: ${getValue(k, v => v - 1)})`, options)
    },
    between(a: K, b: K) {
      return useMediaQuery(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b)})`, options)
    },
  }
}
