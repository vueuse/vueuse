import { defineComponent, h, reactive, ref } from 'vue-demi'
import { useElementVisibility } from '@vueuse/core'
import type { RenderableComponent } from '../types'

export const UseElementVisibility = /* #__PURE__ */ defineComponent<RenderableComponent>({
  name: 'UseElementVisibility',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive({
      isVisible: useElementVisibility(target),
    })

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
