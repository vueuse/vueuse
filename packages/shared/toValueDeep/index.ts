import type { MaybeRefOrGetter, Ref } from 'vue-demi'
import { isRef, isVue2, toValue } from 'vue-demi'
import { toValue as _toValue } from '../toValue'

export type ToValueDeep<T> = T extends Ref<infer V>
  ? ToValueDeep<V>
  : T extends Array<infer U>
    ? Array<ToValueDeep<U>>
    : T extends object
      ? {
          [K in keyof T]: ToValueDeep<T[K]>
        }
      : T

export function toValueDeep<T>(value: MaybeRefOrGetter<T>): ToValueDeep<T> {
  const _val = isVue2 ? _toValue(value) : toValue(value)

  if (isRef(_val)) {
    return toValueDeep<T>(_val)
  }
  else if (Array.isArray(_val)) {
    return _val.map(v => toValueDeep(v)) as ToValueDeep<T>
  }
  else if (typeof _val === 'object' && _val !== null) {
    return Object.fromEntries(
      Object.entries(_val).map(([k, v]) => [k, toValueDeep(v)]),
    ) as ToValueDeep<T>
  }

  return _val as ToValueDeep<T>
}
