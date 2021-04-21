import { isRef, Ref, ToRefs as ToRefsVue, toRefs as toRefsVue, UnwrapRef, computed } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'

export type ToRefs<T extends Ref<object>> = {
  [K in keyof UnwrapRef<T>]: Ref<UnwrapRef<T>[K]>
}

/**
 * Extended `toRefs` which can receive a ref object instead of a reactive object.
 *
 * @link https://vueuse.org/toRefs
 * @param objectRef A ref or normal object or array.
 */
export function toRefs<T extends object>(
  objectRef: Ref<T>,
): ToRefs<Ref<T>>
export function toRefs<T extends object>(
  objectRef: T,
): ToRefsVue<T>
export function toRefs<T extends object>(
  objectRef: MaybeRef<T>,
) {
  if (!isRef(objectRef)) return toRefsVue(objectRef)

  const ret: any = Array.isArray(objectRef.value)
    ? new Array(objectRef.value.length)
    : {}
  // eslint-disable-next-line no-restricted-syntax
  for (const key in objectRef.value) {
    ret[key] = computed<T[typeof key]>({
      get() {
        return objectRef.value[key]
      },
      set(v) {
        objectRef.value[key] = v
      },
    })
  }
  return ret
}
