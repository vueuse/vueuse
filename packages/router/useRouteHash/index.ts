import type { Ref } from 'vue-demi'
import { computed, nextTick, ref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { toValue } from '@vueuse/shared'
import type { ReactiveRouteOptions, RouteDefaultValue } from '../_types'

export function useRouteHash(
  defaultValue?: RouteDefaultValue,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
  }: ReactiveRouteOptions = {},
) {
  const _hash: Ref<any> = ref(route.hash ?? defaultValue)

  return computed<string>({
    get() {
      return _hash.value
    },
    set(v) {
      _hash.value = (v === defaultValue || v === null) ? undefined : v

      nextTick(() => {
        router[toValue(mode)]({ ...route, hash: _hash.value })
      })
    },
  })
}
