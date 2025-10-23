import type { Maybe } from '@vueuse/shared'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { RouteMap, RouteParams, Router } from 'vue-router'
import type {
  GetRouteParams,
  ReactiveRouteOptionsWithName,
  ReactiveRouteOptionsWithTransform,
  RouteParamValue,
  RouteParamValueRaw,
  RouteType,
  ToPrimitive,
  WithDefault,
} from '../_types'
import { tryOnScopeDispose } from '@vueuse/shared'
import { customRef, nextTick, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isEmpty, mergeDefault, parseArgs } from '../_utils'

const _queue = new WeakMap<Router, Map<string, any>>()

export function useRouteParams(
  name: string
): Ref<undefined | null | string | string[]>

export function useRouteParams<
  R extends RouteParamValue = RouteParamValue,
  D extends RouteParamValueRaw = R,
  T = WithDefault<R, ToPrimitive<D>>,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<D>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteParams<
  R extends Record<string, RouteParamValue> = Record<string, RouteParamValue>,
  D extends Maybe<Record<string, RouteParamValueRaw>> = R,
  T = WithDefault<R, NonNullable<ToPrimitive<D>>>,
  K = T,
>(
  defaultValue?: MaybeRefOrGetter<D>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteParams<
  M extends keyof RouteMap = keyof RouteMap,
  N extends string | number | symbol = keyof RouteParams<M>,
  R extends GetRouteParams<M, N> = GetRouteParams<M, N>,
  E extends GetRouteParams<M, N> = R,
  D extends GetRouteParams<M, N> | RouteParamValueRaw = R,
  T = WithDefault<R, ToPrimitive<D>>,
  K = T,
>(
  name: N,
  defaultValue: MaybeRefOrGetter<D | E>,
  options: ReactiveRouteOptionsWithName<T, K, M>
): Ref<K>

export function useRouteParams<
  M extends keyof RouteMap = keyof RouteMap,
  R extends GetRouteParams<M> = GetRouteParams<M>,
  E extends GetRouteParams<M> = R,
  D extends GetRouteParams<M> | Maybe<Record<string, RouteParamValueRaw>> = R,
  T = WithDefault<R, NonNullable<ToPrimitive<D>>>,
  K = T,
>(
  defaultValue: MaybeRefOrGetter<D | E>,
  options: ReactiveRouteOptionsWithName<T, K, M>
): Ref<K>

export function useRouteParams<
  T extends RouteParamValueRaw | Record<string, RouteParamValueRaw>,
  K = T,
>(...args: unknown[]): Ref<K> {
  const { name, defaultValue, options } = parseArgs<T, K>(args)
  const {
    mode = 'replace',
    name: routeName,
    route = useRoute(routeName),
    router = useRouter(),
    transform,
  } = options
  type ParamsKey = keyof typeof route.params
  let transformGet = (value: T) => value as unknown as K
  let transformSet = (value: K) => value as unknown as T

  if (typeof transform === 'function') {
    transformGet = transform
  }
  else if (transform) {
    if (transform.get)
      transformGet = transform.get
    if (transform.set)
      transformSet = transform.set
  }

  if (!_queue.has(router))
    _queue.set(router, new Map())

  const _paramsQueue = _queue.get(router)!

  let param = (name ? route.params[name as ParamsKey] : route.params) as any

  tryOnScopeDispose(() => {
    param = undefined
  })

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()
        return transformGet(
          mergeDefault(param, {
            defaultValue: toValue(defaultValue),
          }),
        )
      },
      set(v) {
        v = transformSet(v)

        if (param === v)
          return

        param = isEmpty(v, {
          defaultValue: toValue(defaultValue),
        })
          ? undefined
          : v
        if (name) {
          _paramsQueue.set(name, param)
        }
        else {
          Object.entries(param || {}).forEach(([key, value]) => {
            _paramsQueue.set(key, value)
          })
        }

        trigger()

        nextTick(() => {
          if (_paramsQueue.size === 0)
            return

          const newParams = Object.fromEntries(_paramsQueue.entries())
          _paramsQueue.clear()

          const { params, query, hash } = route as RouteType

          router[toValue(mode)]({
            params: {
              ...params,
              ...newParams,
            },
            query,
            hash,
          })
        })
      },
    }
  })

  watch(
    () => name ? route.params[name as ParamsKey] : route.params,
    (v) => {
      if (param === transformGet(v as T))
        return

      param = v

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy as Ref<K>
}
