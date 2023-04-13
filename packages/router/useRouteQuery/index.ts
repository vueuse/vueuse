import type { Ref } from 'vue-demi'
import { computed, nextTick, unref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import type { DefaultTransformFn, ReactiveRouteOptionsWithTransform } from '../_types'

export function useRouteQuery(
  name: string
): Ref<null | string | string[]>

export function useRouteQuery<
  T extends null | undefined | string | string[] = null | string | string[],
  K extends DefaultTransformFn<any> = DefaultTransformFn<T>,
>(
  name: string,
  defaultValue?: T,
  options?: ReactiveRouteOptionsWithTransform<K>
): Ref<ReturnType<K>>

export function useRouteQuery<T extends string | string[]>(
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
      const data = route.query[name]

      if (data == null)
        return transform(defaultValue ?? null)
      if (Array.isArray(data))
        return transform(data.filter(Boolean) as string[])

      return transform(data)
    },
    set(v) {
      nextTick(() => {
        router[unref(mode)]({ query: { ...route.query, [name]: v === defaultValue || v === null ? undefined : v } })
      })
    },
  })
}
