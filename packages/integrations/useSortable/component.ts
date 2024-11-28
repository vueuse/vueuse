import { useVModel } from '@vueuse/core'
import { defineComponent, h, type PropType, reactive, ref } from 'vue'
import { useSortable, type UseSortableOptions } from '.'

export const UseSortable = /* #__PURE__ */ defineComponent({
  name: 'UseSortable',
  props: {
    modelValue: {
      type: Array as PropType<any[]>,
      required: true,
    },
    tag: {
      type: String,
      default: 'div',
    },
    options: {
      type: Object as PropType<UseSortableOptions>,
      required: true,
    },
  },

  setup(props, { slots }) {
    const list = useVModel(props, 'modelValue')
    const target = ref()
    const data = reactive(useSortable(target, list, props.options))
    return () => {
      if (slots.default)
        return h(props.tag, { ref: target }, slots.default(data))
    }
  },
})
