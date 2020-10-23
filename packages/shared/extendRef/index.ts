import { isRef, Ref, ShallowUnwrapRef } from 'vue-demi'

export function extendRef<R extends Ref<any>, Extend extends object>(ref: R, extend: Extend, enumerable = true) {
  for (const [key, value] of Object.entries(extend)) {
    if (key === 'value')
      continue

    if (isRef(value)) {
      Object.defineProperty(ref, key, {
        get() {
          return value.value
        },
        set(v) {
          value.value = v
        },
        enumerable,
      })
    }
    else {
      Object.defineProperty(ref, key, { value, enumerable })
    }
  }
  return ref as ShallowUnwrapRef<Extend> & R
}
