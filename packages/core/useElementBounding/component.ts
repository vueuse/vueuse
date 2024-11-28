import type { RenderableComponent } from '../types'
import type { UseResizeObserverOptions } from '../useResizeObserver'
import { useElementBounding } from '@vueuse/core'
import { defineComponent, h, reactive, ref } from 'vue'

export const UseElementBounding = /* #__PURE__ */ defineComponent<UseResizeObserverOptions & RenderableComponent>({
  name: 'UseElementBounding',
  props: ['box', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useElementBounding(target))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
