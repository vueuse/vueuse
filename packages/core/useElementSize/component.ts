import { defineComponent, h, reactive, ref } from 'vue-demi'
import type { ElementSize } from '@vueuse/core'
import { useElementSize } from '@vueuse/core'
import type { RenderableComponent } from '../types'
import type { UseResizeObserverOptions } from '../useResizeObserver'

export const UseElementSize = /* #__PURE__ */ defineComponent<ElementSize & UseResizeObserverOptions & RenderableComponent>({
  name: 'UseElementSize',
  props: ['width', 'height', 'box'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useElementSize(target, { width: props.width, height: props.height }, { box: props.box }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
