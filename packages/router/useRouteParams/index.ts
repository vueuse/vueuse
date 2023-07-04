import { customRef, nextTick, watch } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { LocationAsRelativeRaw, RouteParamValueRaw } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform } from '../_types'

const _cache = new WeakMap()

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

  if (!_cache.has(route))
    _cache.set(route, new Map())

  const _params: Map<string, any> = _cache.get(route)

  tryOnScopeDispose(() => {
    _params.delete(name)
  })

  _params.set(name, route.params[name])

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        const data = _params.get(name)

        return transform(data !== undefined ? data : defaultValue)
      },
      set(v) {
        if (_params.get(name) === v)
          return

        _params.set(name, v)

        trigger()

        nextTick(() => {
          router[toValue(mode)]({params: { ...route.params, ...Object.fromEntries(_params.entries()) } } as LocationAsRelativeRaw)
        })
      },
    }
  })

  watch(
    () => route.params[name],
    (v) => {
      _params.set(name, v)

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy as Ref<K>
}
