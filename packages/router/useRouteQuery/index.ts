import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { Ref } from 'vue'
import type { Router } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform, RouteQueryValueRaw } from '../_types'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import { customRef, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const _queue = new WeakMap<Router, Map<string, any>>()

export function useRouteQuery(
  name: string
): Ref<null | string | string[]>

export function useRouteQuery<
  T extends RouteQueryValueRaw = RouteQueryValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteQuery<
  T extends RouteQueryValueRaw = RouteQueryValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options: ReactiveRouteOptionsWithTransform<T, K> = {},
): Ref<K> {
  const {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
    transform,
  } = options

  const transformGet = transform && 'get' in transform ? transform.get : transform ?? ((value: T) => value as any as K)
  const transformSet = transform && 'set' in transform ? transform.set : (value: K) => value as any as T

  if (!_queue.has(router))
    _queue.set(router, new Map())

  const _queriesQueue = _queue.get(router)!

  let query = route.query[name] as any

  tryOnScopeDispose(() => {
    query = undefined
  })

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        return transformGet(query !== undefined ? query : toValue(defaultValue))
      },
      set(v) {
        v = transformSet(v)

        if (query === v)
          return

        query = (v === defaultValue || v === null) ? undefined : v
        _queriesQueue.set(name, (v === defaultValue || v === null) ? undefined : v)

        trigger()

        nextTick(() => {
          if (_queriesQueue.size === 0)
            return

          const newQueries = Object.fromEntries(_queriesQueue.entries())
          _queriesQueue.clear()

          const { params, query, hash } = route

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
    () => route.query[name],
    (v) => {
      if (query === transformGet(v as T))
        return

      query = v

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy as any as Ref<K>
}
