import { customRef, nextTick, watch } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { LocationAsRelativeRaw, RouteParamValueRaw, Router } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform } from '../_types'

const _queue = new WeakMap<Router, Map<string, any>>()

export function useRouteParams(
  name: string
): Ref<null | string | string[]>

export function useRouteParams<
  T extends RouteParamValueRaw = RouteParamValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteParams<
  T extends RouteParamValueRaw = RouteParamValueRaw,
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
    transform = value => value as any as K,
  } = options

  if (!_queue.has(router))
    _queue.set(router, new Map())

  const _paramsQueue = _queue.get(router)!

  let param = route.params[name] as any

  tryOnScopeDispose(() => {
    param = undefined
  })

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        return transform(param !== undefined ? param : toValue(defaultValue))
      },
      set(v) {
        if (param === v)
          return

        param = (v === defaultValue || v === null) ? undefined : v
        _paramsQueue.set(name, (v === defaultValue || v === null) ? undefined : v)

        trigger()

        nextTick(() => {
          if (_paramsQueue.size === 0)
            return

          const newParams = Object.fromEntries(_paramsQueue.entries())
          _paramsQueue.clear()

          const { params, query, hash } = route

          router[toValue(mode)]({
            params: {
              ...params,
              ...newParams,
            },
            query,
            hash,
          } as LocationAsRelativeRaw)
        })
      },
    }
  })

  watch(
    () => route.params[name],
    (v) => {
      param = v

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy as Ref<K>
}
