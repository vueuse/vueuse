import type { MousePressedOptions } from '@vueuse/core'
import type { RenderableComponent } from '../types'
import { useMousePressed } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export const UseMousePressed = /* #__PURE__ */ defineComponent<Omit<MousePressedOptions, 'target'> & RenderableComponent>({
  name: 'UseMousePressed',
  props: ['touch', 'initialValue', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive(useMousePressed({ ...props, target }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
