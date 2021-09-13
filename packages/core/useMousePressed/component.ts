import { h, ref, defineComponent, reactive } from 'vue-demi'
import { useMousePressed, MousePressedOptions } from '@vueuse/core'
import { RenderableComponent } from '../types'

export const UseMousePressed = defineComponent<Omit<MousePressedOptions, 'target'> & RenderableComponent>({
  name: 'UseMousePressed',
  props: ['touch', 'initialValue', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useMousePressed({ ...props, target }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
