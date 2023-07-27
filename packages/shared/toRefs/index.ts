import type { ToRefs } from 'vue-demi'
import { toRefs as _toRefs, customRef, isRef } from 'vue-demi'
import type { MaybeRef } from '../utils'

export interface ToRefsOptions {
  /**
   * Replace the original ref with a copy on property update.
   *
   * @default true
   */
  replaceRef?: boolean
}

/**
 * Extended `toRefs` that also accepts refs of an object.
 *
 * @see https://vueuse.org/toRefs
 * @param objectRef A ref or normal object or array.
 */
export function toRefs<T extends object>(
  objectRef: MaybeRef<T>,
  options: ToRefsOptions = {},
): ToRefs<T> {
  if (!isRef(objectRef))
    return _toRefs(objectRef)

  const result: any = Array.isArray(objectRef.value)
    ? new Array(objectRef.value.length)
    : {}

  const { replaceRef = true } = options

  for (const key in objectRef.value) {
    result[key] = customRef<T[typeof key]>(() => ({
      get() {
        return objectRef.value[key]
      },
      set(v) {
        if (replaceRef) {
          if (Array.isArray(objectRef.value)) {
            const copy: any = [...objectRef.value]
            copy[key] = v
            objectRef.value = copy
          }
          else {
            const newObject = { ...objectRef.value, [key]: v }

            Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value))

            objectRef.value = newObject
          }
        }
        else {
          objectRef.value[key] = v
        }
      },
    }))
  }
  return result
}
