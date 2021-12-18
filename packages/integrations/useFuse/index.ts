import Fuse from 'fuse.js'
import type { ComputedRef } from 'vue-demi'
import { computed, ref, unref, watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'

export type FuseOptions<T> = Fuse.IFuseOptions<T>
export type UseFuseOptions<T> = {
  fuseOptions?: FuseOptions<T>
  resultLimit?: number
  matchAllWhenSearchEmpty?: boolean
}

export function useFuse<DataItem>(
  search: MaybeRef<string>,
  data: MaybeRef<DataItem[]>,
  options?: MaybeRef<UseFuseOptions<DataItem>>,
) {
  const createFuse = (data: MaybeRef<DataItem[]>, options?: FuseOptions<DataItem>) => {
    const _options = options

    return new Fuse(
      unref(data) ?? [],
      _options,
    )
  }

  const fuse = ref(createFuse(data, unref(options)?.fuseOptions))

  watch(
    () => unref(options)?.fuseOptions,
    (newOptions) => { fuse.value = createFuse(data, newOptions) },
    { deep: true },
  )

  watch(
    () => unref(data),
    (newData) => { fuse.value.setCollection(newData) },
    { deep: true },
  )

  const results: ComputedRef<Fuse.FuseResult<DataItem>[]> = computed(() => {
    // This will also be recomputed when `data` changes, as it causes a change
    // to the Fuse instance, which is tracked here.
    if (unref(options)?.matchAllWhenSearchEmpty && !unref(search))
      return unref(data).map((item, index) => ({ item, refIndex: index }))

    const limit = unref(options)?.resultLimit
    return fuse.value.search(unref(search), (limit ? { limit } : undefined))
  })

  return {
    results,
  }
}

export type UseFuseReturn = ReturnType<typeof useFuse>
