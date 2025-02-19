import type { RenderableComponent } from '../types'
import { useFullscreen } from '@vueuse/core'
import { ref as deepRef, defineComponent, h, reactive } from 'vue'

export const UseFullscreen = /* #__PURE__ */ defineComponent<RenderableComponent>({
  name: 'UseFullscreen',
  props: ['as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = deepRef()
    const data = reactive(useFullscreen(target))

    return () => {
      if (slots.default)
        return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
