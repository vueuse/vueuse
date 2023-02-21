import { useVModel } from '@vueuse/core'
import { type PropType, defineComponent, h, ref } from 'vue-demi'
import { useSortable } from '@vueuse/integrations'
import type { UseSortableOptions } from '@vueuse/integrations'

export const UseSortable = /* #__PURE__ */ defineComponent({
  name: 'UseSortable',
  props: {
    value: {
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
    const list = useVModel(props, 'value')
    const target = ref()
    useSortable(target, list, props.options)
    return () => {
      if (slots.default)
        return h(props.tag, { ref: target }, slots.default())
    }
  },
})
