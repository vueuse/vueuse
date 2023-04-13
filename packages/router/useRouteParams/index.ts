import type { Ref } from 'vue-demi'
import { computed, nextTick } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { toValue } from '@vueuse/shared'
import type { DefaultTransformFn, ReactiveRouteOptionsWithTransform } from '../_types'

export function useRouteParams(name: string): Ref<null | string | string[]>

export function useRouteParams<
  T extends null | undefined | string | string[] = null | string | string[],
  K extends DefaultTransformFn<any> = DefaultTransformFn<T>,
>(name: string, defaultValue?: T, options?: ReactiveRouteOptionsWithTransform<K>): Ref<ReturnType<K>>

export function useRouteParams<T extends string | string[]>(
  name: string,
  defaultValue?: T,
  {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
    transform = value => value,
  }: ReactiveRouteOptionsWithTransform = {},
) {
  return computed<any>({
    get() {
      const data = route.params[name]
      if (data == null)
        return transform(defaultValue ?? null)
      if (Array.isArray(data))
        return transform(data.filter(Boolean))
      return transform(data)
    },
    set(v) {
      nextTick(() => {
        router[toValue(mode)]({ ...route, params: { ...route.params, [name]: v } })
      })
    },
  })
}
