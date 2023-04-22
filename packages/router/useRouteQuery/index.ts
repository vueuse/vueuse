import type { Ref } from 'vue-demi'
import { customRef, nextTick } from 'vue-demi'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import { useRoute, useRouter } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform, RouteQueryValueRaw } from '../_types'

let _query: Record<string, any> = {}

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

  _query[name] = route.query[name]

  tryOnScopeDispose(() => {
    _query = {}
  })

  return customRef<any>((track, trigger) => ({
    get() {
      track()

      const data = _query[name] ?? defaultValue
      return transform(data as T)
    },
    set(v) {
      _query[name] = (v === defaultValue || v === null) ? undefined : v

      trigger()

      nextTick(() => {
        router[toValue(mode)]({ ...route, query: { ...route.query, ..._query } })
      })
    },
  }))
}
