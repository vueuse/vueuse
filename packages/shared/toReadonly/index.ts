import { isRef, shallowReadonly } from 'vue-demi'
import type { Ref } from 'vue-demi'

export type ToReadonlyReturn<T extends object> = Readonly<{
  [K in keyof T]: T[K] extends Ref
    ? Readonly<T[K]>
    : T[K]
}>

/**
 * Converts a ref or ref(s) in an object to readonly ref.
 *
 * @param target
 * @returns
 */
export function toReadonly<T extends object>(
  target: T,
) {
  if (isRef(target))
    return shallowReadonly(target)

  const result: Record<string, any> = Array.isArray(target) ? [] : {}

  for (const [key, value] of Object.entries(target))
    result[key] = isRef(value) ? shallowReadonly(value) : value

  return result as ToReadonlyReturn<T>
}
