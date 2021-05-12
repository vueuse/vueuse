import { defineComponent } from 'vue-demi'
import { useMouse, MouseOptions } from '.'

export const UseMouse = defineComponent<MouseOptions>({
  name: 'UseMouse',
  setup(props, { slots, emit }) {
    const { x, y, sourceType } = useMouse(props)

    return () => {
      if (slots.default) {
        return slots.default({
          x: x.value,
          y: y.value,
          sourceType: sourceType.value,
        })
      }
    }
  },
})
