import { computed, inject, ComputedRef, InjectionKey } from 'vue-demi'

export type ComputedInjectGetter<T, K> = (source: T | undefined, ctx?: any) => K
export type ComputedInjectGetterWithDefault<T, K> = (source: T, ctx?: any) => K
export type ComputedInjectSetter<T> = (v: T) => void

export interface WritableComputedInjectOptions<T, K> {
  get: ComputedInjectGetter<T, K>
  set: ComputedInjectSetter<K>
}

export interface WritableComputedInjectOptionsWithDefault<T, K> {
  get: ComputedInjectGetterWithDefault<T, K>
  set: ComputedInjectSetter<K>
}

export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  getter: ComputedInjectGetter<T, K>
): ComputedRef<K | undefined>
export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  options: WritableComputedInjectOptions<T, K>
): ComputedRef<K | undefined>
export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  getter: ComputedInjectGetterWithDefault<T, K>,
  defaultSource: T,
  treatDefaultAsFactory?: false
): ComputedRef<K>
export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  options: WritableComputedInjectOptionsWithDefault<T, K>,
  defaultSource: T | (() => T),
  treatDefaultAsFactory: true
): ComputedRef<K>
export function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  options: ComputedInjectGetter<T, K> | WritableComputedInjectOptions<T, K>,
  defaultSource?: T | (() => T),
  treatDefaultAsFactory?: boolean,
) {
  let source: T | (() => T) | undefined = inject(key)
  if (defaultSource) source = inject(key, defaultSource)
  if (treatDefaultAsFactory) source = inject(key, defaultSource, treatDefaultAsFactory ?? false)
  if (typeof options === 'function') {
    return computed(ctx => options(source as (T | undefined), ctx))
  }
  else {
    return computed({
      get: ctx => options.get(source as (T | undefined), ctx),
      set: options.set,
    })
  }
}
