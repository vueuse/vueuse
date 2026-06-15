import type { UseOffsetPaginationOptions, UseOffsetPaginationReturn } from '@vueuse/core'
import type { Reactive, SlotsType } from 'vue'
import { useOffsetPagination } from '@vueuse/core'
import { defineComponent, reactive, toValue } from 'vue'

export interface UseOffsetPaginationProps extends UseOffsetPaginationOptions {}
// eslint-disable-next-line ts/consistent-type-definitions
export type UseOffsetPaginationEmits = {
  'page-change': (...args: Parameters<NonNullable<UseOffsetPaginationOptions['onPageChange']>>) => void
  'page-size-change': (...args: Parameters<NonNullable<UseOffsetPaginationOptions['onPageSizeChange']>>) => void
  'page-count-change': (...args: Parameters<NonNullable<UseOffsetPaginationOptions['onPageCountChange']>>) => void
}
interface UseOffsetPaginationSlots {
  default: (data: Reactive<UseOffsetPaginationReturn>) => any
}

export const UseOffsetPagination = /* #__PURE__ */ defineComponent<
  UseOffsetPaginationProps,
  UseOffsetPaginationEmits,
  string,
  SlotsType<UseOffsetPaginationSlots>
>(
  (props, { slots, emit }) => {
    const data = reactive(useOffsetPagination({
      ...props,
      total: toValue(props.total) || undefined,
      onPageChange(...args) {
        props.onPageChange?.(...args)
        emit('page-change', ...args)
      },
      onPageSizeChange(...args) {
        props.onPageSizeChange?.(...args)
        emit('page-size-change', ...args)
      },
      onPageCountChange(...args) {
        props.onPageCountChange?.(...args)
        emit('page-count-change', ...args)
      },
    }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
  {
    name: 'UseOffsetPagination',
    props: [
      'onPageChange',
      'onPageCountChange',
      'onPageSizeChange',
      'page',
      'pageSize',
      'total',
    ],
  },
)
