import { defineComponent, h, reactive, ref } from 'vue-demi'
import type { RenderableComponent } from '@vueuse/core'
import { useDragScroll } from '@vueuse/core'

export const UseDragScroll = /* #__PURE__ */ defineComponent<RenderableComponent>({
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useDragScroll(target))
    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
