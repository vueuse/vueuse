import { customRef, nextTick } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import type { ReactiveRouteOptions, RouteHashValueRaw } from '../_types'

let _hash: RouteHashValueRaw

export function useRouteHash(
  defaultValue?: RouteHashValueRaw,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
  }: ReactiveRouteOptions = {},
) {
  _hash = route.hash

  tryOnScopeDispose(() => {
    _hash = undefined
  })

  return customRef<RouteHashValueRaw>((track, trigger) => ({
    get() {
      track()

      return _hash || defaultValue
    },
    set(v) {
      _hash = v === null ? undefined : v

      trigger()

      nextTick(() => {
        router[toValue(mode)]({ ...route, hash: _hash as string })
      })
    },
  }))
}
