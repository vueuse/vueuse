import type { MaybeRefOrGetter, Ref } from 'vue'
import type { LocationAsRelativeRaw, RouteParamValueRaw, Router } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform } from '../_types'
import { tryOnScopeDispose } from '@vueuse/shared'
import { customRef, nextTick, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const _queue = new WeakMap<Router, Map<string, { value: any, owner: object }>>()

export function useRouteParams(
  name: string,
): Ref<null | string | string[]>

export function useRouteParams<
  T extends RouteParamValueRaw = RouteParamValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: ReactiveRouteOptionsWithTransform<T, K>,
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

  // Marks the queue entries this instance wrote. The queue holds one entry per
  // name and is shared by every consumer of the router, so an instance can only
  // recognise its own write by identity.
  const writer = {}

  let param = route.params[name] as any

  tryOnScopeDispose(() => {
    param = undefined

    // Drop this scope's unflushed write. Leaving it in the shared queue lets a
    // disposed scope alter a param on the next navigation someone else triggers.
    // Another instance bound to the same name may have queued over the entry in
    // the meantime, so only drop the write that is still ours.
    if (_paramsQueue.get(name)?.owner === writer)
      _paramsQueue.delete(name)
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
        _paramsQueue.set(name, { value: param, owner: writer })

        trigger()

        nextTick(() => {
          if (_paramsQueue.size === 0)
            return

          const newParams = Object.fromEntries(
            Array.from(_paramsQueue, ([key, entry]) => [key, entry.value] as const),
          )
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
      if (param === transformGet(v as T))
        return

      param = v

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy as Ref<K>
}
