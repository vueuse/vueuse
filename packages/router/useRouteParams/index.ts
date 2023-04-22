import type { Ref } from 'vue-demi'
import { customRef, nextTick } from 'vue-demi'
import type { RouteParamValueRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import type { ReactiveRouteOptionsWithTransform } from '../_types'

let _params: Record<string, any> = {}

export function useRouteParams(
  name: string
): Ref<null | string | string[]>

export function useRouteParams<
  T extends RouteParamValueRaw = RouteParamValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: T,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteParams<
  T extends RouteParamValueRaw = RouteParamValueRaw,
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

  _params[name] = route.params[name]

  tryOnScopeDispose(() => {
    _params = {}
  })

  return customRef<any>((track, trigger) => ({
    get() {
      track()

      const data = _params[name] ?? defaultValue
      return transform(data as T)
    },
    set(v) {
      _params[name] = (v === defaultValue || v === null) ? undefined : v

      trigger()

      nextTick(() => {
        router[toValue(mode)]({ ...route, params: { ...route.params, ..._params } })
      })
    },
  }))
}
