import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Router } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform, RouteQueryValueRaw } from '../_types'
import { tryOnScopeDispose } from '@vueuse/shared'
import { customRef, nextTick, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const _queue = new WeakMap<Router, Map<string, { value: any, owner: object }>>()

export function useRouteQuery(
  name: string,
): Ref<undefined | null | string | string[]>

export function useRouteQuery<
  T extends RouteQueryValueRaw = RouteQueryValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: ReactiveRouteOptionsWithTransform<T, K>,
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

  const _queriesQueue = _queue.get(router)!

  // Marks the queue entries this instance wrote. The queue holds one entry per
  // name and is shared by every consumer of the router, so an instance can only
  // recognise its own write by identity.
  const writer = {}

  let query = route.query[name] as any

  tryOnScopeDispose(() => {
    query = undefined

    // Drop this scope's unflushed write. Leaving it in the shared queue lets a
    // disposed scope alter a query on the next navigation someone else triggers.
    // Another instance bound to the same name may have queued over the entry in
    // the meantime, so only drop the write that is still ours.
    if (_queriesQueue.get(name)?.owner === writer)
      _queriesQueue.delete(name)
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

        query = (v === toValue(defaultValue)) ? undefined : v
        _queriesQueue.set(name, { value: query, owner: writer })

        trigger()

        nextTick(() => {
          if (_queriesQueue.size === 0)
            return

          const newQueries = Object.fromEntries(
            Array.from(_queriesQueue, ([key, entry]) => [key, entry.value] as const),
          )
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

  return proxy as Ref<K>
}
