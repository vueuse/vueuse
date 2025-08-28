import type { MaybeRefOrGetter, Ref } from 'vue'
import type { LocationAsRelativeRaw, RouteParamValueRaw, Router } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform } from '../_types'
import { tryOnScopeDispose } from '@vueuse/shared'
import { customRef, nextTick, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const _queue = new WeakMap<Router, Map<string, any>>()
function parseArgs<T extends RouteParamValueRaw | Record<string, RouteParamValueRaw>, K = T>(args: any[]) {
  const maybeName = args[0]
  let name: string | undefined
  let defaultValue: MaybeRefOrGetter<T> | undefined
  let options: ReactiveRouteOptionsWithTransform<T, K>
  if (typeof maybeName === 'string') {
    name = args[0]
    defaultValue = args[1]
    options = args[2] ?? {}
  }
  else {
    defaultValue = args[0]
    options = args[1] ?? {}
  }
  return {
    name,
    defaultValue,
    options,
  }
}
export function useRouteParams(
  name?: string
): Ref<null | string | string[]>

export function useRouteParams<
  T extends RouteParamValueRaw = RouteParamValueRaw,
  K = T,
>(
  name?: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>
export function useRouteParams<
  T extends Record<string, RouteParamValueRaw> = Record<string, RouteParamValueRaw>,
  K = T,
>(
  defaultValue?: MaybeRefOrGetter<T>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>
export function useRouteParams<
  T extends RouteParamValueRaw | Record<string, RouteParamValueRaw>,
  K = T,
>(...args: any[]): Ref<K> {
  const { name, defaultValue, options } = parseArgs<T, K>(args)
  const {
    mode = 'replace',
    route = useRoute(),
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

  const _paramsQueue = _queue.get(router)!

  let param = (name ? route.params[name] : route.params) as any

  tryOnScopeDispose(() => {
    param = undefined
  })

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        return transformGet(param !== undefined && param !== '' ? param : toValue(defaultValue))
      },
      set(v) {
        v = transformSet(v)

        if (param === v)
          return

        param = (v === toValue(defaultValue) || v === null) ? undefined : v
        if (name) {
          _paramsQueue.set(name, param)
        }
        else {
          Object.entries(param).forEach(([key, value]) => {
            _paramsQueue.set(key, value)
          })
        }

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
    () => name ? route.params[name] : route.params,
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
