import type { Maybe } from '@vueuse/shared'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Router } from 'vue-router'
import type {
  ReactiveRouteOptionsWithTransform,
  RouteQueryValue,
  RouteQueryValueRaw,
  RouteType,
  ToPrimitive,
  WithDefault,
} from '../_types'
import { tryOnScopeDispose } from '@vueuse/shared'
import { customRef, nextTick, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isEmpty, parseArgs } from '../_utils'

const _queue = new WeakMap<Router, Map<string, any>>()

export function useRouteQuery(
  name: string
): Ref<undefined | null | string | string[]>

export function useRouteQuery<
  R extends RouteQueryValue = RouteQueryValue,
  D extends RouteQueryValueRaw = R,
  T = WithDefault<R, ToPrimitive<D> | null>,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<D>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteQuery<
  R extends Maybe<Record<string, RouteQueryValue>> = Maybe<Record<string, RouteQueryValue>>,
  D extends Maybe<Record<string, RouteQueryValueRaw>> = R,
  T = WithDefault<R, ToPrimitive<D>>,
  K = T,
>(
  defaultValue?: MaybeRefOrGetter<D>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteQuery<
  T extends RouteQueryValueRaw | Record<string, RouteQueryValueRaw>,
  K = T,
>(
  ...args: unknown[]
): Ref<K> {
  const { name, defaultValue, options } = parseArgs<T, K>(args)
  const {
    mode = 'replace',
    name: routeName,
    route = useRoute(routeName),
    router = useRouter(),
    transform,
  } = options

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

  const _queriesQueue = _queue.get(router)!

  let query = (name ? route.query[name] : route.query) as any

  tryOnScopeDispose(() => {
    query = undefined
  })

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        return transformGet(isEmpty(query, {
          exclude: [null],
        })
          ? toValue(defaultValue)
          : query)
      },
      set(v) {
        v = transformSet(v)

        if (query === v)
          return

        query = isEmpty(v, {
          defaultValue: toValue(defaultValue),
          exclude: [null],
        })
          ? undefined
          : v
        if (name) {
          _queriesQueue.set(name, query)
        }
        else {
          Object.entries(query || {}).forEach(([key, value]) => {
            _queriesQueue.set(key, value)
          })
        }

        trigger()

        nextTick(() => {
          if (_queriesQueue.size === 0)
            return

          const newQueries = Object.fromEntries(_queriesQueue.entries())
          _queriesQueue.clear()

          const { params, query, hash } = route as RouteType

          router[toValue(mode)]({
            params,
            query: { ...query, ...newQueries },
            hash,
          })
        })
      },
    }
  })

  watch(
    () => name ? route.query[name] : route.query,
    (v) => {
      if (query === transformGet(v as T))
        return

      query = v

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy as Ref<K>
}
