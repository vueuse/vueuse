import type { MaybeRef, MaybeRefOrGetter, ToRefs } from 'vue'
import { toRefs as _toRefs, customRef, isRef, toValue } from 'vue'

export interface ToRefsOptions {
  /**
   * Replace the original ref with a copy on property update.
   *
   * @default true
   */
  replaceRef?: MaybeRefOrGetter<boolean>
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
    ? Array.from({ length: objectRef.value.length })
    : {}

  for (const key in objectRef.value) {
    result[key] = customRef<T[typeof key]>(() => ({
      get() {
        return objectRef.value[key]
      },
      set(v) {
        const replaceRef = toValue(options.replaceRef) ?? true

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
