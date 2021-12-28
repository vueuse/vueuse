import type { UnwrapNestedRefs } from 'vue-demi'
import { computed, isRef, reactive, unref, watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/core'
import { biSyncRef, noop, useClamp } from '@vueuse/core'

export interface UsePaginationOptions {
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
  onPageChange?: (returnValue: UnwrapNestedRefs<UsePaginationReturn>) => any

  /**
     * Callback when the `pageSize` change.
     */
  onPageSizeChange?: (returnValue: UnwrapNestedRefs<UsePaginationReturn>) => any

  /**
     * Callback when the `pageCount` change.
     */
  onPageCountChange?: (returnValue: UnwrapNestedRefs<UsePaginationReturn>) => any
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

  function prev() {
    currentPage.value--
  }

  function next() {
    currentPage.value++
  }

  const returnValue = {
    currentPage,
    currentPageSize,
    pageCount,
    isFirstPage,
    isLastPage,
    prev,
    next,
  }

  watch(currentPage, () => {
    onPageChange(reactive(returnValue))
  })

  watch(currentPageSize, () => {
    onPageSizeChange(reactive(returnValue))
  })

  watch(pageCount, () => {
    onPageCountChange(reactive(returnValue))
  })

  return returnValue
}

export type UsePaginationReturn = ReturnType<typeof usePagination>
