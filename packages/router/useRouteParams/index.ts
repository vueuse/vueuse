import type { Ref } from 'vue-demi'
import { computed, nextTick } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { toValue } from '@vueuse/shared'
import type { ReactiveRouteOptionsWithTransform, RouterQueryValue } from '../_types'

export function useRouteParams(
  name: string
): Ref<null | string | string[]>

export function useRouteParams<
  T extends RouterQueryValue = RouterQueryValue,
  K = T,
>(
  name: string,
  defaultValue?: T,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteParams<
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
      const data = route.params[name] ?? defaultValue
      return transform(data as T)
    },
    set(v) {
      nextTick(() => {
        router[toValue(mode)]({ ...route, params: { ...route.params, [name]: v } })
      })
    },
  })
}
