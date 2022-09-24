import Fuse from 'fuse.js'
import type { ComputedRef } from 'vue-demi'
import { computed, ref, unref, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

export type FuseOptions<T> = Fuse.IFuseOptions<T>
export interface UseFuseOptions<T> {
  fuseOptions?: FuseOptions<T>
  resultLimit?: number
  matchAllWhenSearchEmpty?: boolean
}

export function useFuse<DataItem>(
  search: MaybeComputedRef<string>,
  data: MaybeComputedRef<DataItem[]>,
  options?: MaybeComputedRef<UseFuseOptions<DataItem>>,
) {
  const createFuse = () => {
    return new Fuse(
      resolveUnref(data) ?? [],
      resolveUnref(options)?.fuseOptions,
    )
  }

  const fuse = ref(createFuse())

  watch(
    () => resolveUnref(options)?.fuseOptions,
    () => { fuse.value = createFuse() },
    { deep: true },
  )

  watch(
    () => resolveUnref(data),
    (newData) => { fuse.value.setCollection(newData) },
    { deep: true },
  )

  const results: ComputedRef<Fuse.FuseResult<DataItem>[]> = computed(() => {
    const resolved = resolveUnref(options)
    // This will also be recomputed when `data` changes, as it causes a change
    // to the Fuse instance, which is tracked here.
    if (resolved?.matchAllWhenSearchEmpty && !unref(search))
      return resolveUnref(data).map((item, index) => ({ item, refIndex: index }))

    const limit = resolved?.resultLimit
    return fuse.value.search(resolveUnref(search), (limit ? { limit } : undefined))
  })

  return {
    fuse,
    results,
  }
}

export type UseFuseReturn = ReturnType<typeof useFuse>
