import { watch, isRef, unref, computed } from 'vue-demi'
import type { MaybeRef } from '@vueuse/core'
import { noop, useClamp, biSyncRef } from '@vueuse/core'

interface UsePaginationOptions {
  /**
   * The number of items to show per page.
   */
  total: MaybeRef<number>

  /**
   * The number of items to display per page.
   * @default 10
   */
  pageSize?: MaybeRef<number>

  /**
   * The current page number.
   * @default 1
   */
  page?: MaybeRef<number>

  /**
   * Callback when the `page` change.
   */
  onPageChange?: (page: number) => any

  /**
   * Callback when the `pageSize` change.
   */
  onPageSizeChange?: (pageSize: number) => any

  /**
   * Callback when the `pageCount` change.
   */
  onPageCountChange?: (pageCount: number) => any
}

export function usePagination(options: UsePaginationOptions) {
  const {
    total,
    pageSize = 10,
    page = 1,
    onPageChange = noop,
    onPageSizeChange = noop,
    onPageCountChange = noop,
  } = options

  const currentPageSize = useClamp(pageSize, 1, Infinity)

  const pageCount = computed(() => Math.ceil((unref(total)) / unref(currentPageSize)))

  const currentPage = useClamp(page, 1, pageCount)

  const isFirstPage = computed(() => currentPage.value === 1)
  const isLastPage = computed(() => currentPage.value === pageCount.value)

  if (isRef(page))
    biSyncRef(page, currentPage)

  if (isRef(pageSize))
    biSyncRef(pageSize, currentPageSize)

  watch(currentPage, () => {
    onPageChange(currentPage.value)
  })

  watch(currentPageSize, () => {
    onPageSizeChange(unref(currentPageSize))
  })

  watch(pageCount, () => {
    onPageCountChange(pageCount.value)
  })

  function prev() {
    currentPage.value--
  }

  function next() {
    currentPage.value++
  }

  return {
    currentPage,
    currentPageSize,
    pageCount,
    isFirstPage,
    isLastPage,
    prev,
    next,
  }
}
