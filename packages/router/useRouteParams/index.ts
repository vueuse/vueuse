import type { Ref } from 'vue-demi'
import { computed, nextTick, ref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { toValue } from '@vueuse/shared'
import type { ReactiveRouteOptionsWithTransform, RouteDefaultValue } from '../_types'

export function useRouteParams(
  name: string
): Ref<null | string | string[]>

export function useRouteParams<
  T extends RouteDefaultValue = RouteDefaultValue,
  K = T,
>(
  name: string,
  defaultValue?: T,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteParams<
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
  const _param: Ref<any> = ref(route.params[name] ?? defaultValue)

  return computed<any>({
    get() {
      return transform(_param.value ?? defaultValue)
    },
    set(v) {
      _param.value = (v === defaultValue || v === null) ? undefined : v

      nextTick(() => {
        router[toValue(mode)]({ ...route, params: { ...route.params, [name]: _param.value } })
      })
    },
  })
}
