import type { Ref, ShallowRef } from 'vue'
import { ref as deepRef, shallowRef } from 'vue'

export type CreateRefReturn<T = any, D extends boolean = false> = ShallowOrDeepRef<T, D>

export type ShallowOrDeepRef<T = any, D extends boolean = false> = D extends true ? Ref<T> : ShallowRef<T>

/**
 * Returns a `deepRef` or `shallowRef` depending on the `deep` param.
 *
 * @example createRef(1) // ShallowRef<number>
 * @example createRef(1, false) // ShallowRef<number>
 * @example createRef(1, true) // Ref<number>
 * @example createRef("string") // ShallowRef<string>
 * @example createRef<"A"|"B">("A", true) // Ref<"A"|"B">
 *
 * @param value
 * @param deep
 * @returns the `deepRef` or `shallowRef`
 *
 * @__NO_SIDE_EFFECTS__
 */
export function createRef<T = any, D extends boolean = false>(value: T, deep?: D): CreateRefReturn<T, D> {
  if (deep === true) {
    return deepRef(value) as CreateRefReturn<T, D>
  }
  else {
    return shallowRef(value) as CreateRefReturn<T, D>
  }
}
