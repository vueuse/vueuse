// eslint-disable-next-line no-restricted-imports -- function values must not be called
import { isReadonly, isRef, toRefs, toValue, unref } from 'vue'
import { reactiveComputed } from '../reactiveComputed'

export type ReactiveOmitReturn<T extends object, K extends keyof T | undefined = undefined>
  = [K] extends [undefined]
    ? Partial<T>
    : Omit<T, Extract<K, keyof T>>

export type ReactiveOmitPredicate<T> = (value: T[keyof T], key: keyof T) => boolean

export function reactiveOmit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: (K | K[])[]
): ReactiveOmitReturn<T, K>
export function reactiveOmit<T extends object>(
  obj: T,
  predicate: ReactiveOmitPredicate<T>,
): ReactiveOmitReturn<T>
/**
 * Reactively omit fields from a reactive object
 *
 * @see https://vueuse.org/reactiveOmit
 */
export function reactiveOmit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: (K | K[])[]
): ReactiveOmitReturn<T, K> {
  const flatKeys = keys.flat() as K[]
  const predicate = flatKeys[0] as unknown as ReactiveOmitPredicate<T>

  const isHideable = (key: K) => Object.getOwnPropertyDescriptor(obj, key)?.configurable !== false

  if (typeof predicate !== 'function' && Object.isExtensible(obj) && flatKeys.every(isHideable)) {
    const isOmitted = (key: PropertyKey) => typeof key === 'symbol' || flatKeys.includes(key as K)
    let rawView: any

    const handler: ProxyHandler<any> = {
      get(target, key, receiver) {
        if (isOmitted(key))
          return undefined
        // a raw view with the same keys omitted, so `toRaw` and `v-bind` copies keep omitting them
        if (key === '__v_raw')
          return receiver === rawView ? undefined : (rawView ??= new Proxy(isReadonly(obj) ? (obj as any).__v_raw : obj, handler))
        return unref(target[key])
      },
      set(target, key, value) {
        if (isOmitted(key))
          return true
        if (isRef(target[key]) && !isRef(value))
          target[key].value = value
        else
          target[key] = value
        return true
      },
      deleteProperty(target, key) {
        return isOmitted(key) || Reflect.deleteProperty(target, key)
      },
      has(target, key) {
        return !isOmitted(key) && key in target
      },
      ownKeys(target) {
        return Reflect.ownKeys(target).filter(key => !isOmitted(key))
      },
      getOwnPropertyDescriptor(target, key) {
        return isOmitted(key) ? undefined : Reflect.getOwnPropertyDescriptor(target, key)
      },
    }

    return new Proxy(obj, handler)
  }

  return reactiveComputed<any>(() =>
    typeof predicate === 'function'
      ? Object.fromEntries(Object.entries(toRefs(obj)).filter(([k, v]) => !predicate(toValue(v) as T[K], k as K)))
      : Object.fromEntries(Object.entries(toRefs(obj)).filter(e => !flatKeys.includes(e[0] as K))))
}
