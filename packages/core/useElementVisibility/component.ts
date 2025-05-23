import type { RenderableComponent } from '../types'
import { useElementVisibility } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export const UseElementVisibility = /* #__PURE__ */ defineComponent<RenderableComponent>({
  name: 'UseElementVisibility',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive({
      isVisible: useElementVisibility(target),
    })

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
