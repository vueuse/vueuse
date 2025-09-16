import type { ArgumentsType, Reactified } from '@vueuse/shared'
import { reactify } from '@vueuse/shared'

export type UseMathKeys = keyof { [K in keyof Math as Math[K] extends (...args: any) => any ? K : never]: unknown }

export type UseMathReturn<K extends keyof Math> = ReturnType<Reactified<Math[K], true>>

/**
 * Reactive `Math` methods.
 *
 * @see https://vueuse.org/useMath
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useMath<K extends keyof Math>(
  key: K,
  ...args: ArgumentsType<Reactified<Math[K], true>>
): UseMathReturn<K> {
  return reactify(Math[key] as any)(...args) as UseMathReturn<K>
}
