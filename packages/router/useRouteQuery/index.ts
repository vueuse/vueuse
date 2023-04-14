import type { Ref } from 'vue-demi'
import { computed, nextTick } from 'vue-demi'
import { toValue } from '@vueuse/shared'
import { useRoute, useRouter } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform, RouterQueryValue } from '../_types'

let _queue: Record<string, any> = {}

export function useRouteQuery(
  name: string
): Ref<null | string | string[]>

export function useRouteQuery<
  T extends RouterQueryValue = RouterQueryValue,
  K = T,
>(
  name: string,
  defaultValue?: T,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteQuery<
  T extends RouterQueryValue = RouterQueryValue,
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

  return computed<any>({
    get() {
      const data = route.query[name] ?? defaultValue
      return transform(data as T)
    },
    set(v) {
      _queue[name] = (v === defaultValue || v === null) ? undefined : v

      nextTick(() => {
        router[toValue(mode)]({ ...route, query: { ...route.query, ..._queue } })
        nextTick(() => _queue = {})
      })
    },
  })
}
