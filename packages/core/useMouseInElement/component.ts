import { defineComponent, h, reactive, ref } from 'vue-demi'
import type { MouseInElementOptions } from '@vueuse/core'
import { useMouseInElement } from '@vueuse/core'
import type { RenderableComponent } from '../types'

export const UseMouseInElement = /* #__PURE__ */ defineComponent<MouseInElementOptions & RenderableComponent>({
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
