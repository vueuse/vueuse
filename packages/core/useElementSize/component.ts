import type { ElementSize } from '@vueuse/core'
import type { RenderableComponent } from '../types'
import type { UseResizeObserverOptions } from '../useResizeObserver'
import { useElementSize } from '@vueuse/core'
import { defineComponent, h, reactive, shallowRef } from 'vue'

export const UseElementSize = /* #__PURE__ */ defineComponent<Partial<ElementSize> & UseResizeObserverOptions & RenderableComponent>({
  name: 'UseElementSize',
  props: ['width', 'height', 'box', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = shallowRef<HTMLDivElement>()
    const data = reactive(useElementSize(target, { width: props.width ?? 0, height: props.height ?? 0 }, { box: props.box }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
