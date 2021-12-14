import type { ToRefs } from 'vue-demi'
import { isRef, toRefs as _toRefs, customRef } from 'vue-demi'
import type { MaybeRef } from '../utils'

/**
 * Extended `toRefs` that also accepts refs of an object.
 *
 * @see https://vueuse.org/toRefs
 * @param objectRef A ref or normal object or array.
 */
export function toRefs<T extends object>(
  objectRef: MaybeRef<T>,
): ToRefs<T> {
  if (!isRef(objectRef))
    return _toRefs(objectRef)

  const result: any = Array.isArray(objectRef.value)
    ? new Array(objectRef.value.length)
    : {}

  // eslint-disable-next-line no-restricted-syntax
  for (const key in objectRef.value) {
    result[key] = customRef<T[typeof key]>(() => ({
      get() {
        return objectRef.value[key]
      },
      set(v) {
        if (Array.isArray(objectRef.value)) {
          const copy: any = [...objectRef.value]
          copy[key] = v
          objectRef.value = copy
        }
        else {
          objectRef.value = { ...objectRef.value, [key]: v }
        }
      },
    }))
  }
  return result
}
