import { h, ref, defineComponent } from 'vue-demi'
import { useMousePressed, MousePressedOptions } from '.'

export const UseMousePressed = defineComponent<MousePressedOptions>({
  name: 'UseMousePressed',
  setup(props, { slots }) {
    const target = ref()
    const { pressed, sourceType } = useMousePressed({
      ...props,
      target: props.target ? props.target : target,
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
