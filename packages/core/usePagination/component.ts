import { defineComponent, reactive } from 'vue-demi'
import { usePagination } from '@vueuse/core'
import type { UsePaginationOptions } from '.'

export const UsePagination = defineComponent<UsePaginationOptions>({
  name: 'UsePagination',
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
    const data = reactive(usePagination({
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
