import { defineComponent, reactive } from 'vue-demi'
import { usePagination } from '@vueuse/core'

export const UsePagination = defineComponent({
  name: 'UsePagination',
  props: {
    total: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    page: {
      type: Number,
      default: 1,
    },
  },
  emits: ['page-change', 'page-size-change', 'page-count-change'],
  setup(props, { slots, emit }) {
    const data = reactive(usePagination({
      ...props,
      onPageChange(...args) {
        emit('page-change', ...args)
      },
      onPageSizeChange(...args) {
        emit('page-size-change', ...args)
      },
      onPageCountChange(...args) {
        emit('page-count-change', ...args)
      },
    }))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
