import { h, ref, defineComponent, reactive } from 'vue-demi'
import { useElementBounding } from '@vueuse/core'
import type { ResizeObserverOptions } from '../useResizeObserver'
import type { RenderableComponent } from '../types'

export const UseElementBounding = defineComponent<ResizeObserverOptions & RenderableComponent>({
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
