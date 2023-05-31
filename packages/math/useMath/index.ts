import type { ArgumentsType, Reactified } from '@vueuse/shared'
import { reactify } from '@vueuse/shared'

export type UseMathKeys = keyof { [K in keyof Math as Math[K] extends (...args: any) => any ? K : never]: unknown }

/**
 * Reactive `Math` methods.
 *
 * @see https://vueuse.org/useMath
 */
export function useMath<K extends keyof Math>(
  key: K,
  ...args: ArgumentsType<Reactified<Math[K], true>>
): ReturnType<Reactified<Math[K], true>> {
  return reactify(Math[key] as any)(...args) as any
}
