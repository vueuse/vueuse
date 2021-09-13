import { h, ref, defineComponent, reactive } from 'vue-demi'
import { useMouseInElement, MouseInElementOptions } from '@vueuse/core'
import { RenderableComponent } from '../types'

export const UseMouseInElement = defineComponent<MouseInElementOptions & RenderableComponent>({
  name: 'UseMouseElement',
  props: ['handleOutside', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useMouseInElement(target, props))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
