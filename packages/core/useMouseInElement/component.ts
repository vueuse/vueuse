import type { MouseInElementOptions } from '@vueuse/core'
import type { RenderableComponent } from '../types'
import { useMouseInElement } from '@vueuse/core'
import { ref as deepRef, defineComponent, h, reactive } from 'vue'

export const UseMouseInElement = /* #__PURE__ */ defineComponent<MouseInElementOptions & RenderableComponent>({
  name: 'UseMouseElement',
  props: ['handleOutside', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = deepRef()
    const data = reactive(useMouseInElement(target, props))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
