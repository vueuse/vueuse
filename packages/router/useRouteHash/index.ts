import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { ReactiveRouteOptions, RouteHashValueRaw } from '../_types'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import { customRef, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

let _hash: RouteHashValueRaw

export function useRouteHash(
  defaultValue?: MaybeRefOrGetter<RouteHashValueRaw>,
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

  let _trigger: () => void

  const proxy = customRef<RouteHashValueRaw>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        return _hash || toValue(defaultValue)
      },
      set(v) {
        if (v === _hash)
          return

        _hash = v === null ? undefined : v

        trigger()

        nextTick(() => {
          const { params, query } = route

          router[toValue(mode)]({ params, query, hash: _hash as string })
        })
      },
    }
  })

  watch(
    () => route.hash,
    () => {
      if (route.hash === _hash)
        return

      _hash = route.hash
      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy
}
