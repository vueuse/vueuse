import { ref, computed, watch, unref } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'

import Fuse from 'fuse.js'

type FuseOptions<T> = Fuse.IFuseOptions<T>

type UseFuseOptions = {
  resultLimit?: number
  matchAllWhenSearchEmpty?: boolean
}

function useFuse<DataItem>(
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

  const results = computed(() => {
    // This will also be recomputed when `data` changes, as it causes a change
    // to the Fuse instance, which is tracked here.

    if (unref(options)?.matchAllWhenSearchEmpty && !unref(search))
      return unref(data).map((item, index) => ({ item, index }))

    const limit = unref(options)?.resultLimit
    return fuse.value
      .search(unref(search), (limit ? { limit } : undefined))
      .map(entry => ({ item: entry.item, index: entry.refIndex }))
  })

  const stop = () => {
    stopDataWatch()
    stopFuseOptionsWatch()
  }

  return { results, stop }
}

export { useFuse, UseFuseOptions, FuseOptions }
