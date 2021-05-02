import { h, ref, defineComponent } from 'vue-demi'
import { useElementSize } from '.'

export const UseElementSize = defineComponent({
  name: 'UseElementSize',
  setup(props, { slots, emit }) {
    const target = ref()
    const { width, height } = useElementSize(target)

    return () => {
      if (slots.default) {
        return h('div', { ref: target }, slots.default({
          width: width.value,
          height: height.value,
        }))
      }
    }
  },
})
