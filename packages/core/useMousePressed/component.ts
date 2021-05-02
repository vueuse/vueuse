import { h, ref, defineComponent } from 'vue-demi'
import { useMousePressed, MousePressedOptions } from '.'

export const UseMousePressed = defineComponent<{ local: boolean; options: MousePressedOptions }>({
  name: 'UseMousePressed',
  setup(props, { slots }) {
    const target = ref()
    const { pressed, sourceType } = useMousePressed({
      ...props.options,
      target: props.local ? target : null,
    })

    return () => {
      if (slots.default) {
        return h('div', { ref: target }, slots.default({
          pressed: pressed.value,
          sourceType: sourceType.value,
        }))
      }
    }
  },
})
