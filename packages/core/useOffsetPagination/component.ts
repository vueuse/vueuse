import { defineComponent, reactive } from 'vue-demi'
import { useOffsetPagination } from '@vueuse/core'
import type { UseOffsetPaginationOptions } from '.'

export const UseOffsetPagination = /* #__PURE__ */ defineComponent<UseOffsetPaginationOptions>({
  name: 'UseOffsetPagination',
  props: [
    'total',
    'page',
    'pageSize',
    'onPageChange',
    'onPageSizeChange',
    'onPageCountChange',
  ] as unknown as undefined,
  emits: [
    'page-change',
    'page-size-change',
    'page-count-change',
  ],
  setup(props, { slots, emit }) {
    const data = reactive(useOffsetPagination({
      ...props,
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
})
