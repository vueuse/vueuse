import { defineComponent, h, reactive, ref } from 'vue-demi'
import type { MouseHoverOptions } from '@vueuse/core'
import { useMouseHover } from '@vueuse/core'
import type { RenderableComponent } from '../types'

export const UseMouseHover = /* #__PURE__ */ defineComponent<Omit<MouseHoverOptions, 'target'> & RenderableComponent>({
  name: 'UseMouseHover',
  props: ['enterDelay', 'leaveDelay', 'initialValue'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useMouseHover({ ...props, target }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
