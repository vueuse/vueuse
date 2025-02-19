import type { MousePressedOptions } from '@vueuse/core'
import type { RenderableComponent } from '../types'
import { useMousePressed } from '@vueuse/core'
import { ref as deepRef, defineComponent, h, reactive } from 'vue'

export const UseMousePressed = /* #__PURE__ */ defineComponent<Omit<MousePressedOptions, 'target'> & RenderableComponent>({
  name: 'UseMousePressed',
  props: ['touch', 'initialValue', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = deepRef()
    const data = reactive(useMousePressed({ ...props, target }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
