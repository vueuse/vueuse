import { defineComponent, h, reactive, ref } from 'vue-demi'
import type { MouseInElementOptions } from '@vueuse/core'
import { useMouseDistanceToElement } from '@vueuse/core'
import type { RenderableComponent } from '../types'

export const UseMouseDistanceToElement = defineComponent<MouseInElementOptions & RenderableComponent>({
  name: 'UseMouseDistanceToElement',
  props: ['handleOutside', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useMouseDistanceToElement(target, props))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
