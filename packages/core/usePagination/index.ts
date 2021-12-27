import type { Ref } from 'vue-demi'
import { unref, computed, ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/core'

interface UsePaginationOptions<T> {
  initialValue: MaybeRef<T[]>
  initialPage?: MaybeRef<number>
  fetch: (page: number, pageSize: number) => Promise<T[]>
  pageSize?: MaybeRef<number>
  total: MaybeRef<number>
  immediate?: boolean
}

export function usePagination<T = any>(options: UsePaginationOptions<T>) {
  const {
    total,
    initialValue = ref([]) as Ref<T[]>,
    initialPage = 1,
    pageSize = 10,
    fetch,
    immediate = true,
  } = options
  const currentPage = ref(initialPage)
  const data = ref(initialValue) as Ref<T[]>
  const loading = ref(false)
  const maxPage = computed(() => {
    if (unref(total) === Infinity) return Infinity
    return Math.ceil((unref(total)) / unref(pageSize))
  })
  const isLastPage = computed(() => currentPage.value === maxPage.value)

  async function fetchByPage(page: number) {
    if (loading.value) return

    if (page > maxPage.value)
      throw new Error('No more data') // TODO:

    loading.value = true
    try {
      const fetchData = await fetch(page, unref(pageSize))
      data.value = fetchData
    }
    catch (error) {
      // TODO: handle error
      console.error(error)
    }
    finally {
      loading.value = false
    }
  }

  function nextPage() {
    currentPage.value++
    return fetchByPage(currentPage.value)
  }

  if (immediate)
    fetchByPage(unref(currentPage))

  return {
    currentPage,
    data,
    loading,
    maxPage,
    isLastPage,
    nextPage,
  }
}
