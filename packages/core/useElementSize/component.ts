import { h, ref, defineComponent, reactive } from 'vue-demi'
import { useElementSize, ElementSize } from '@vueuse/core'
import { RenderableComponent } from '../types'
import { ResizeObserverOptions } from '../useResizeObserver'

export const UseElementSize = defineComponent<ElementSize & ResizeObserverOptions & RenderableComponent>({
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
