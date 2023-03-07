import { type PropType, defineComponent, h, reactive, ref } from 'vue-demi'
import { useVModel } from '@vueuse/core'
import { type UseSortableOptions, useSortable } from '.'

export const UseSortable = /* #__PURE__ */ defineComponent({
  name: 'UseSortable',
  model: { // Compatible with vue2
    prop: 'modelValue',
    event: 'update:modelValue',
  },
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
