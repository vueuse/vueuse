import { isReadonly, isRef, toRefs, toValue } from 'vue'
import { reactiveComputed } from '../reactiveComputed'

export type ReactiveOmitReturn<T extends object, K extends keyof T | undefined = undefined>
  = [K] extends [undefined]
    ? Partial<T>
    : Omit<T, Extract<K, keyof T>>

export type ReactiveOmitPredicate<T> = (value: T[keyof T], key: keyof T) => boolean

function createOmitView<T extends object, TKey extends keyof T>(source: T, omitted: TKey[], isRawView: boolean): ReactiveOmitReturn<T, TKey> {
  const isOmitted = (key: PropertyKey) => typeof key === 'symbol' || omitted.includes(key as TKey)
  const hasOwnProperty = (key: PropertyKey) => {
    key = typeof key === 'symbol' ? key : String(key)
    // eslint-disable-next-line e18e/prefer-object-has-own, no-prototype-builtins -- reactive sources track `hasOwnProperty` calls
    return !isOmitted(key) && source.hasOwnProperty(key)
  }
  let rawView: any

  return new Proxy<T>({} as T, {
    get(_, key) {
      if (isOmitted(key))
        return undefined
      // a raw view with the same keys omitted, so `toRaw` and `v-bind` copies keep omitting them
      if (key === '__v_raw')
        return isRawView ? undefined : (rawView ??= createOmitView(isReadonly(source) ? (source as { __v_raw: T }).__v_raw : source, omitted, true))
      if (key === 'hasOwnProperty')
        return hasOwnProperty
      const value = source[key as keyof T]
      return isRef(value) ? value.value : value
    },
    set(_, key, value) {
      if (isOmitted(key))
        return true
      const oldValue = source[key as keyof T]
      if (isRef(oldValue) && !isRef(value))
        oldValue.value = value
      else
        source[key as keyof T] = value
      return true
    },
    deleteProperty(_, key) {
      return isOmitted(key) || Reflect.deleteProperty(source, key)
    },
    defineProperty(_, key, descriptor) {
      if (descriptor.configurable === false)
        return false
      return isOmitted(key) || Reflect.defineProperty(source, key, descriptor)
    },
    has(_, key) {
      return !isOmitted(key) && key in source
    },
    ownKeys() {
      return Reflect.ownKeys(source).filter(key => !isOmitted(key))
    },
    getOwnPropertyDescriptor(_, key) {
      if (isOmitted(key))
        return undefined
      const descriptor = Reflect.getOwnPropertyDescriptor(source, key)
      if (descriptor)
        descriptor.configurable = true
      return descriptor
    },
  })
}

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

  if (typeof predicate !== 'function')
    return createOmitView(obj, flatKeys.map(key => typeof key === 'number' ? String(key) as K : key), false)

  return reactiveComputed<any>(() =>
    Object.fromEntries(Object.entries(toRefs(obj)).filter(([k, v]) => !predicate(toValue(v) as T[K], k as K))))
}
