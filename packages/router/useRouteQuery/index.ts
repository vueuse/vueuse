import type { Ref } from 'vue-demi'
import { computed, nextTick, ref } from 'vue-demi'
import { toValue } from '@vueuse/shared'
import { useRoute, useRouter } from 'vue-router'
import type { ReactiveRouteOptionsWithTransform, RouteDefaultValue } from '../_types'

export function useRouteQuery(
  name: string
): Ref<null | string | string[]>

export function useRouteQuery<
  T extends RouteDefaultValue = RouteDefaultValue,
  K = T,
>(
  name: string,
  defaultValue?: T,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteQuery<
  T extends RouteDefaultValue = RouteDefaultValue,
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
  const _query: Ref<any> = ref(route.query[name] ?? defaultValue)

  return computed<any>({
    get() {
      return transform(_query.value ?? defaultValue)
    },
    set(v) {
      _query.value = (v === defaultValue || v === null) ? undefined : v

      nextTick(() => {
        router[toValue(mode)]({ ...route, query: { ...route.query, [name]: _query.value } })
      })
    },
  })
}
