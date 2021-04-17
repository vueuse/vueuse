import { MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { reactive, toRef, unref, UnwrapRef, set, del, watchEffect } from 'vue-demi'

/**
 * Reactively pick fields from a reactive object
 *
 * Overload 1: pass keys individually
 *
 * @link https://vueuse.js.org/reactivePick
 * @param obj
 * @param keys
 */
export function reactivePick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): { [S in K]: UnwrapRef<T[S]> }

/**
 * Reactively pick fields from a reactive object
 *
 * Overload 2: pass keys as (ref) array
 *
 * @link https://vueuse.js.org/reactivePick
 * @param obj
 * @param keys
 */
export function reactivePick<T extends object, K extends keyof T>(
  obj: T,
  keys: MaybeRef<K[]>
): { [S in K]: UnwrapRef<T[S]> }

export function reactivePick<T extends object>(obj: T, ...keys: any[]) {
  if (keys.length !== 1 || keys[0] in obj)
    return reactive(Object.fromEntries(keys.map(k => [k, toRef(obj, k)])))

  const [keysRef]: [MaybeRef<(keyof T)[]>] = (keys as [any])

  const reactiveObject = reactive(Object.fromEntries(unref(keysRef).map((k: keyof T) => [k, toRef(obj, k)])))

  const stopWatch = watchEffect(() => {
    const rawKeys = unref(keys[0])
    Object.keys(reactiveObject).filter(key => !rawKeys.includes(key as keyof T)).forEach(key => del(reactiveObject, key))
    rawKeys.forEach((key: keyof T) => set(reactiveObject, key, toRef(obj, key)))
  })

  tryOnUnmounted(stopWatch)

  return reactiveObject
}
