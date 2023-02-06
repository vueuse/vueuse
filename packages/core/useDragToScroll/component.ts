import { defineComponent, h, reactive, ref } from 'vue-demi'
import type { UseDragToScrollOptions } from '@vueuse/core'
import { useDragToScroll } from '@vueuse/core'
import type { RenderableComponent } from '../types'

export interface useDragToScrollProps extends UseDragToScrollOptions, RenderableComponent {

}

export const UseDragToScroll = /* #__PURE__ */ defineComponent<useDragToScrollProps>({
  name: 'UseDragToScroll',
  props: [
    'inertia',
    'disableX',
    'disableY',
    'friction',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useDragToScroll(target, {
      ...props,
    }))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target, style: 'user-select:none;' }, slots.default(data))
    }
  },
})
