import type { ComputedRef, Ref, UnwrapNestedRefs } from 'vue-demi'
import { computed, isRef, reactive, unref, watch } from 'vue-demi'
import { noop, syncRef } from '@vueuse/shared'
import type { MaybeRef } from '@vueuse/shared'
import { useClamp } from '../../math/useClamp'

export interface UseOffsetPaginationOptions {
  /**
   * Total number of items.
   */
  total?: MaybeRef<number>

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
  onPageChange?: (returnValue: UnwrapNestedRefs<UseOffsetPaginationReturn>) => unknown

  /**
   * Callback when the `pageSize` change.
   */
  onPageSizeChange?: (returnValue: UnwrapNestedRefs<UseOffsetPaginationReturn>) => unknown

  /**
   * Callback when the `pageCount` change.
   */
  onPageCountChange?: (returnValue: UnwrapNestedRefs<UseOffsetPaginationReturn>) => unknown
}

export interface UseOffsetPaginationReturn {
  currentPage: Ref<number>
  currentPageSize: Ref<number>
  pageCount: ComputedRef<number>
  isFirstPage: ComputedRef<boolean>
  isLastPage: ComputedRef<boolean>
  prev: () => void
  next: () => void
}

export type UseOffsetPaginationInfinityPageReturn = Omit<UseOffsetPaginationReturn, 'isLastPage'>

export function useOffsetPagination(options: Omit<UseOffsetPaginationOptions, 'total'>): UseOffsetPaginationInfinityPageReturn
export function useOffsetPagination(options: UseOffsetPaginationOptions): UseOffsetPaginationReturn
export function useOffsetPagination(options: UseOffsetPaginationOptions): UseOffsetPaginationReturn {
  const {
    total = Infinity,
    pageSize = 10,
    page = 1,
    onPageChange = noop,
    onPageSizeChange = noop,
    onPageCountChange = noop,
  } = options

  const currentPageSize = useClamp(pageSize, 1, Infinity)

  const pageCount = computed(() => Math.max(
    1,
    Math.ceil((unref(total)) / unref(currentPageSize)),
  ))

  const currentPage = useClamp(page, 1, pageCount)

  const isFirstPage = computed(() => currentPage.value === 1)
  const isLastPage = computed(() => currentPage.value === pageCount.value)

  if (isRef(page))
    syncRef(page, currentPage)

  if (isRef(pageSize))
    syncRef(pageSize, currentPageSize)

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
