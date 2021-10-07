import { ref, computed, watch, unref, ComputedRef } from 'vue-demi'
import { tryOnScopeDispose, MaybeRef } from '@vueuse/shared'

import Fuse from 'fuse.js'

export type FuseOptions<T> = Fuse.IFuseOptions<T>
export type UseFuseOptions = {
  resultLimit?: number
  matchAllWhenSearchEmpty?: boolean
}

export function useFuse<DataItem>(
  search: MaybeRef<string>,
  data: MaybeRef<DataItem[]>,
  fuseOptions?: MaybeRef<FuseOptions<DataItem>>,
  options?: MaybeRef<UseFuseOptions>,
) {
  const createFuse = (data: MaybeRef<DataItem[]>, options?: MaybeRef<FuseOptions<DataItem>>) => {
    const _options = unref(options)

    // Defaults can be set here.

    return new Fuse(
      unref(data) ?? [],
      _options,
    )
  }

  const fuse = ref(createFuse(data, fuseOptions))

  const stopFuseOptionsWatch = watch(
    () => unref(fuseOptions),
    (newOptions) => { fuse.value = createFuse(data, newOptions) },
    { deep: true },
  )

  const stopDataWatch = watch(
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

  const stop = () => {
    stopDataWatch()
    stopFuseOptionsWatch()
  }

  tryOnScopeDispose(stop)

  return {
    results,
    stop,
  }
}

export type UseFuseReturn = ReturnType<typeof useFuse>
