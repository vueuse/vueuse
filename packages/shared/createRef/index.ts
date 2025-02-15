import type { Ref, ShallowRef } from 'vue'
import { ref as deepRef, shallowRef } from 'vue'

export type MaybeDeepRef<T = any, D extends boolean = false> = D extends true ? Ref<T> : ShallowRef<T>

export function createRef<T = any, D extends boolean = false>(value: T, deep?: D): MaybeDeepRef<T, D> {
  if (deep === true) {
    return deepRef(value) as MaybeDeepRef<T, D>
  }
  else {
    return shallowRef(value) as MaybeDeepRef<T, D>
  }
}
//
// const a = createRef(1)
// const b = createRef(2, true)
// const c = createRef(3, false)
//
// type A = MaybeDeepRef
// type B = MaybeDeepRef<number>
// type C = MaybeDeepRef<number, true>
// type D = MaybeDeepRef<number, false>
