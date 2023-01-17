import { defineComponent, h, reactive, ref } from 'vue-demi'
import { useFullscreen } from '@vueuse/core'
import type { RenderableComponent } from '../types'

export const UseFullscreen = /* #__PURE__ */ defineComponent<RenderableComponent>({
  name: 'UseFullscreen',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useFullscreen(target))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
