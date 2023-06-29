import { customRef, nextTick, watch } from 'vue-demi'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import { useRoute, useRouter } from 'vue-router'
import type { Ref } from 'vue-demi'
import type { ReactiveRouteOptionsWithTransform, RouteQueryValueRaw } from '../_types'

const _cache = new WeakMap()

export function useRouteQuery(
  name: string
): Ref<null | string | string[]>

export function useRouteQuery<
  T extends RouteQueryValueRaw = RouteQueryValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: T,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteQuery<
  T extends RouteQueryValueRaw = RouteQueryValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: T,
  options: ReactiveRouteOptionsWithTransform<T, K> = {},
): Ref<K> {
  const {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
    transform = value => value as any as K,
  } = options

  if (!_cache.has(route))
    _cache.set(route, new Map())

  const _query: Map<string, any> = _cache.get(route)

  tryOnScopeDispose(() => {
    _query.delete(name)
  })

  _query.set(name, route.query[name])

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        const data = _query.get(name) ?? defaultValue
        return transform(data as T)
      },
      set(v) {
        _query.set(name, (v === defaultValue || v === null) ? undefined : v)

        trigger()

        nextTick(() => {
          router[toValue(mode)]({
            ...route,
            query: { ...route.query, ...Object.fromEntries(_query.entries()) },
          })
        })
      },
    }
  })

  watch(
    () => route.query[name],
    (v) => {
      _query.set(name, (v === defaultValue || v === null) ? undefined : v)

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy as any as Ref<K>
}
