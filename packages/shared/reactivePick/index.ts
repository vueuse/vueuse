import { MaybeRef, tryOnUnmounted } from '@vueuse/shared'
import { reactive, toRef, unref, UnwrapRef, set, del, watchEffect, watch, isVue2, isVue3 } from 'vue-demi'

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

export function reactivePick<T extends object, K extends keyof T>(obj: T, firstKey: K | MaybeRef<K[]>, ...otherKeys: K[]) {
  if (otherKeys.length > 0 || (firstKey as K) in obj)
    return reactive(Object.fromEntries([firstKey as K, ...otherKeys].map(k => [k, toRef(obj, k)])))

  const reactiveObject = reactive({})

  const stopWatchEffect = watchEffect(() => {
    const keys = unref(firstKey) as K[]
    if (isVue3)
      Object.keys(reactiveObject).filter(key => !keys.includes(key as K)).forEach(key => del(reactiveObject, key))

    keys.forEach((key: K) => set(reactiveObject, key, toRef(obj, key)))
  }, { flush: isVue2 ? 'sync' : 'pre' })

  if (isVue2) {
    const stopWatch = watch(() => unref(firstKey), (keys) => {
      Object.keys(reactiveObject).filter(key => !(keys as K[]).includes(key as K)).forEach(key => del(reactiveObject, key))
    }, { flush: 'sync' })

    tryOnUnmounted(() => {
      stopWatchEffect()
      stopWatch()
    })

    return reactiveObject
  }

  tryOnUnmounted(stopWatchEffect)

  return reactiveObject
}
